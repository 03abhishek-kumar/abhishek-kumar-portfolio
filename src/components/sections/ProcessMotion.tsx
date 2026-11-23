"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onIdle } from "@/lib/idle";

gsap.registerPlugin(ScrollTrigger);

/**
 * Desktop: pins the process section and scrubs the step track horizontally.
 * Smaller screens / reduced motion keep the plain vertical stack.
 */
export function ProcessMotion() {
  useEffect(() => {
    const s = document.getElementById("process");
    const t = document.getElementById("process-track");
    const bar = document.getElementById("process-bar");
    if (!s || !t) return;
    const mm = gsap.matchMedia();
    const cancel = onIdle(() => mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => t.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(t).paddingLeft);
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: s,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      // Panel contents lift in as each panel slides into view.
      t.querySelectorAll<HTMLElement>("[data-panel]").forEach((panel) => {
        gsap.from(panel.querySelectorAll("[data-panel-item]"), {
          y: 40,
          opacity: 0,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 85%", end: "left 45%", scrub: true },
        });
      });
    }));
    return () => {
      cancel();
      mm.revert();
    };
  }, []);

  return null;
}
