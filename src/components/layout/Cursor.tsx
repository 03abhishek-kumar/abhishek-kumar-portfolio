"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * A trailing ring that grows over elements marked with `data-cursor="Label"`.
 * Fine pointers only; the native cursor is never hidden.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const ok =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    gsap.set(el, { x: -100, y: -100, opacity: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

    let lx = -1;
    let ly = -1;
    let raf = 0;
    const resolve = () => {
      const hit = lx >= 0 ? document.elementFromPoint(lx, ly) : null;
      const target = hit?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(target ? target.dataset.cursor || "" : null);
    };
    const move = (e: PointerEvent) => {
      lx = e.clientX;
      ly = e.clientY;
      xTo(lx);
      yTo(ly);
      el.style.opacity = "1";
      resolve();
    };
    // Content moves under a still pointer while scrolling → re-check what's beneath it.
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(resolve);
    };
    const leave = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className="cursor-ring" data-active={label !== null} aria-hidden>
      <span>{label}</span>
    </div>
  );
}
