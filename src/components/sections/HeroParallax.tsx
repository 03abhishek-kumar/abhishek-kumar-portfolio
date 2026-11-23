"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Scroll-out choreography for the hero: the name drifts and widens as it leaves. */
export function HeroParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const name = document.querySelector<HTMLElement>("[data-hero-name]");
    const hero = document.getElementById("top");
    if (!name || !hero) return;

    const ctx = gsap.context(() => {
      gsap.to(name, {
        yPercent: -18,
        letterSpacing: "-0.03em",
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}
