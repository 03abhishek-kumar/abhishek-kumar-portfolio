"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, scrollToTarget } from "@/lib/motion-store";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global motion system:
 *  - Lenis smooth scrolling driven by GSAP's ticker (one RAF loop for everything)
 *  - ScrollTrigger kept in sync with Lenis
 *  - in-page anchor links routed through Lenis
 *  - pointer tracking for parallax
 *  - IntersectionObserver-based reveal classes for [data-reveal] / [data-split]
 */
export function MotionProvider() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motion.reducedMotion = reduced;

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      motion.lenis = lenis;
      lenis.on("scroll", (l: Lenis) => {
        motion.scrollY = l.scroll;
        motion.velocity = l.velocity;
        ScrollTrigger.update();
      });
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    // Native scroll position is the fallback source (reduced motion / before Lenis ticks).
    const onScroll = () => {
      if (!lenis) motion.scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    motion.scrollY = window.scrollY;

    // ── Anchor links ──
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href") ?? "";
      if (hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.replaceState(null, "", hash);
      // Move focus for keyboard + screen-reader users without a second jump.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    // ── Pointer ──
    const onPointer = (e: PointerEvent) => {
      motion.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      motion.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // ── Reveals ──
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const observeAll = () =>
      document.querySelectorAll("[data-reveal]:not(.is-in), [data-split]:not(.is-in)").forEach((el) => io.observe(el));
    observeAll();

    // ── Pause decorative CSS animations in sections that are off-screen ──
    // (waveforms, constellation nodes, dashes…) via the Web Animations API, which
    // pauses them without invalidating any styles (a CSS attribute toggle would
    // force a style recalc of every descendant).
    const paused = new WeakSet<Animation>();
    const pauseIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (typeof e.target.getAnimations !== "function") continue;
          for (const a of e.target.getAnimations({ subtree: true })) {
            if (typeof CSSAnimation === "undefined" || !(a instanceof CSSAnimation)) continue;
            if (!e.isIntersecting && a.playState === "running") {
              a.pause();
              paused.add(a);
            } else if (e.isIntersecting && paused.has(a)) {
              a.play();
              paused.delete(a);
            }
          }
        }
      },
      { rootMargin: "15% 0px 15% 0px" },
    );
    document.querySelectorAll("main > section, main > div").forEach((el) => pauseIo.observe(el));

    // Fonts change layout → refresh trigger positions once they settle.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      io.disconnect();
      pauseIo.disconnect();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      motion.lenis = null;
    };
  }, []);

  return null;
}
