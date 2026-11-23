"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onIdle } from "@/lib/idle";

gsap.registerPlugin(ScrollTrigger);

/** Words brighten one by one as the paragraph scrolls through the viewport. */
export function ScrollHighlight({ text, accentWords = [] }: { text: string; accentWords?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = el.querySelectorAll<HTMLElement>("[data-w]");
    const ctx = gsap.context(() => {}, el);
    const cancel = onIdle(() =>
      ctx.add(() => {
        gsap.fromTo(
          spans,
          // Unlit words stay above WCAG's 3:1 large-text contrast on the ink background
          // (the accent colour is darker than white, so it needs a higher floor).
          { opacity: (_: number, w: Element) => (w.classList.contains("text-accent") ? 0.68 : 0.4) },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: 0.6 },
          },
        );
      }),
    );
    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  const clean = (w: string) => w.replace(/[^a-z-]/gi, "").toLowerCase();

  return (
    <p
      ref={ref}
      className="text-[clamp(1.85rem,4.4vw,4.1rem)] font-medium leading-[1.06] tracking-[-0.045em] text-balance"
    >
      {words.map((w, i) => (
        <span
          key={i}
          data-w
          className={accentWords.includes(clean(w)) ? "font-serif-italic text-accent" : undefined}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
