"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

/**
 * A short (≈1.4s) curtain shown once per session. It waits for web fonts
 * so the hero typography lands in its final face, then lifts away and
 * flags the document as ready, which triggers the hero entrance.
 */
export function Intro() {
  const [done, setDone] = useState(false);
  const [lifting, setLifting] = useState(false);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("no-intro")) {
      html.classList.add("is-ready");
      setDone(true);
      return;
    }

    let raf = 0;
    let finished = false;
    const start = performance.now();
    const duration = 900;
    let fontsReady = false;
    const fontTimeout = window.setTimeout(() => (fontsReady = true), 1800);
    document.fonts?.ready.then(() => (fontsReady = true));

    const step = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      // Hold at 92% until fonts are in.
      const p = fontsReady ? raw : Math.min(raw, 0.92);
      const eased = 1 - Math.pow(1 - p, 3);
      if (counter.current) counter.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${eased})`;
      if (p >= 1 && !finished) {
        finished = true;
        try {
          sessionStorage.setItem("ak-intro", "1");
        } catch {}
        setLifting(true);
        window.setTimeout(() => html.classList.add("is-ready"), 250);
        window.setTimeout(() => setDone(true), 1100);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fontTimeout);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className="intro place-items-center"
      style={{
        transform: lifting ? "translate3d(0,-100%,0)" : "none",
        transition: "transform 1s cubic-bezier(0.76, 0, 0.24, 1)",
      }}
      aria-hidden
    >
      <div className="flex w-[min(80vw,22rem)] flex-col gap-5">
        <div className="flex items-end justify-between font-mono text-xs uppercase tracking-[0.18em] text-subtle">
          <span>{profile.name}</span>
          <span ref={counter} className="tabular-nums text-fg">000</span>
        </div>
        <span className="relative block h-px w-full overflow-hidden bg-line">
          <span
            ref={bar}
            className="absolute inset-0 origin-left bg-gradient-to-r from-accent to-accent-2"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-subtle">Portfolio · {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
