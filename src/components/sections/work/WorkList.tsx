"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/content/projects";
import { CaseStudy } from "./CaseStudy";
import { onIdle } from "@/lib/idle";

gsap.registerPlugin(ScrollTrigger);

/**
 * Client behaviour for the server-rendered work list:
 *  - opens case studies from any `[data-open-case]` element (event delegation)
 *  - desktop stacking: each card recedes as the next slides over it
 */
export function WorkController({ listId }: { listId: string }) {
  const [active, setActive] = useState<Project | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById(listId);
    if (!root) return;

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-open-case]") as HTMLElement | null;
      if (!el || !root.contains(el)) return;
      const p = projects.find((x) => x.id === el.dataset.openCase);
      if (!p) return;
      // Return focus to the card's real button (the visual is pointer-only).
      lastTrigger.current =
        el.tagName === "BUTTON" ? el : (el.closest("[data-card]")?.querySelector("button[data-open-case]") as HTMLElement | null);
      setActive(p);
    };
    root.addEventListener("click", onClick);

    const mm = gsap.matchMedia();
    const cancel = onIdle(() =>
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-card]"));
        items.forEach((item, i) => {
          const next = items[i + 1];
          const inner = item.querySelector<HTMLElement>("[data-card-inner]");
          if (!next || !inner) return;
          gsap.to(inner, {
            scale: 0.92,
            filter: "brightness(0.45)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 15%", scrub: true },
          });
        });
      }),
    );

    return () => {
      cancel();
      root.removeEventListener("click", onClick);
      mm.revert();
    };
  }, [listId]);

  const close = useCallback(() => {
    setActive(null);
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);

  const idx = active ? projects.findIndex((p) => p.id === active.id) : -1;
  const next = idx >= 0 ? projects[(idx + 1) % projects.length] : null;

  return <CaseStudy project={active} next={next} onClose={close} onNext={() => next && setActive(next)} />;
}
