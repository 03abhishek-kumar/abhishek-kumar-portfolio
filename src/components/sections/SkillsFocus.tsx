"use client";

import { useEffect } from "react";

/**
 * Links the constellation and the list: hovering or focusing a group in
 * either place sets `data-focus` on the section, and CSS dims everything else.
 */
export function SkillsFocus() {
  useEffect(() => {
    const root = document.getElementById("skills");
    if (!root) return;
    const set = (id: string | null) => {
      if (id) root.dataset.focus = id;
      else delete root.dataset.focus;
    };
    const targets = Array.from(root.querySelectorAll<HTMLElement | SVGElement>("[data-cluster], [data-group]"));
    const cleanups = targets.map((el) => {
      const id = el.getAttribute("data-cluster") ?? el.getAttribute("data-group");
      const on = () => set(id);
      const off = () => set(null);
      el.addEventListener("pointerenter", on);
      el.addEventListener("pointerleave", off);
      el.addEventListener("focus", on);
      el.addEventListener("blur", off);
      return () => {
        el.removeEventListener("pointerenter", on);
        el.removeEventListener("pointerleave", off);
        el.removeEventListener("focus", on);
        el.removeEventListener("blur", off);
      };
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
