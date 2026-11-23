import type Lenis from "lenis";

/**
 * A tiny mutable store shared between the DOM scroll system and the WebGL scene.
 * It's intentionally NOT React state: values change every frame and nothing
 * should re-render because of them.
 */
export type ScenePose = {
  /** Horizontal position as a fraction of the visible half-width (-1..1). */
  x: number;
  /** Vertical position as a fraction of the visible half-height (-1..1). */
  y: number;
  scale: number;
  opacity: number;
  /** Extra spin/energy, 0..1 */
  energy: number;
};

export const motion = {
  scrollY: 0,
  velocity: 0,
  /** Normalised pointer, -1..1 on both axes (0,0 = centre). */
  pointer: { x: 0, y: 0 },
  reducedMotion: false,
  lenis: null as Lenis | null,
  pose: { x: 0.45, y: 0, scale: 1, opacity: 1, energy: 0 } as ScenePose,
};

export function lockScroll() {
  motion.lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
  motion.lenis?.start();
}

export function scrollToTarget(target: string | HTMLElement | number) {
  const el =
    typeof target === "string" ? (document.querySelector(target) as HTMLElement | null) : target;
  if (el === null) return;
  if (motion.lenis) {
    motion.lenis.scrollTo(el as HTMLElement | number, { duration: 1.6 });
  } else if (typeof el === "number") {
    window.scrollTo({ top: el, behavior: motion.reducedMotion ? "auto" : "smooth" });
  } else {
    el.scrollIntoView({ behavior: motion.reducedMotion ? "auto" : "smooth" });
  }
}
