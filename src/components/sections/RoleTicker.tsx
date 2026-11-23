"use client";

import { useEffect, useState } from "react";

/** All roles stay visible; a soft highlight travels across them. */
export function RoleTicker({ roles }: { roles: readonly string[] }) {
  const shown = roles.slice(0, 3);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % shown.length), 2200);
    return () => window.clearInterval(id);
  }, [shown.length]);

  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.72rem] uppercase tracking-[0.16em]">
      {shown.map((r, i) => (
        <span key={r} className="flex items-center gap-3">
          <span className={`transition-colors duration-700 ${i === active ? "text-fg" : "text-subtle"}`}>{r}</span>
          {i < shown.length - 1 && <span className="text-subtle/60" aria-hidden>/</span>}
        </span>
      ))}
    </p>
  );
}
