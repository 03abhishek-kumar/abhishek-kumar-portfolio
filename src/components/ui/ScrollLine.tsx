"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onIdle } from "@/lib/idle";

gsap.registerPlugin(ScrollTrigger);

/** A line that draws itself (scaleY or scaleX) as its parent scrolls through view. */
export function ScrollLine({ axis = "y", className = "" }: { axis?: "x" | "y"; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "none";
      return;
    }
    const prop = axis === "y" ? "scaleY" : "scaleX";
    el.style.transform = axis === "y" ? "scaleY(0)" : "scaleX(0)";
    let tween: gsap.core.Tween | null = null;
    const cancel = onIdle(() => {
      tween = gsap.fromTo(
        el,
        { [prop]: 0 },
        {
          [prop]: 1,
          ease: "none",
          scrollTrigger: { trigger: parent, start: "top 70%", end: "bottom 60%", scrub: 0.5 },
        },
      );
    });
    return () => {
      cancel();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [axis]);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`block bg-gradient-to-b from-accent via-accent-2 to-transparent ${axis === "y" ? "origin-top" : "origin-left"} ${className}`}
    />
  );
}
