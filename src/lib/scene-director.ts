import { motion, type ScenePose } from "./motion-store";

/**
 * Choreography for the persistent 3D core. Each section on the page carries
 * `data-scene="<id>"`; as the visitor scrolls, the core eases between poses.
 */
const desktopPoses: Record<string, ScenePose> = {
  hero: { x: 0.42, y: 0.02, scale: 1, opacity: 1, energy: 0 },
  about: { x: 0.84, y: -0.1, scale: 0.78, opacity: 0.45, energy: 0.2 },
  experience: { x: -1.02, y: -0.3, scale: 0.62, opacity: 0.2, energy: 0.1 },
  work: { x: 0, y: 0, scale: 0.5, opacity: 0, energy: 0 },
  process: { x: 0.0, y: 0.0, scale: 0.85, opacity: 0.35, energy: 1 },
  skills: { x: -0.7, y: 0, scale: 0.5, opacity: 0, energy: 0.3 },
  milestones: { x: 0.85, y: 0.1, scale: 0.6, opacity: 0.25, energy: 0.2 },
  github: { x: 0, y: 0, scale: 0.5, opacity: 0, energy: 0 },
  contact: { x: 0.36, y: -0.08, scale: 1.02, opacity: 0.72, energy: 0.35 },
};

function mobilePose(p: ScenePose, id: string): ScenePose {
  if (id === "hero") return { x: 0, y: 0.36, scale: 0.78, opacity: 0.85, energy: 0 };
  if (id === "contact") return { x: 0, y: 0.18, scale: 0.8, opacity: 0.45, energy: 0.35 };
  return { x: p.x * 0.4, y: p.y, scale: p.scale * 0.8, opacity: p.opacity * 0.55, energy: p.energy };
}

type Keyframe = { at: number; pose: ScenePose };
let keyframes: Keyframe[] = [];

export function measureScenes(isMobile: boolean) {
  const vh = window.innerHeight;
  const sy = window.scrollY;
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
  const next: Keyframe[] = [];
  for (const el of els) {
    const id = el.dataset.scene ?? "";
    const base = desktopPoses[id];
    if (!base) continue;
    const pose = isMobile ? mobilePose(base, id) : base;
    // Pinned sections are offset inside their GSAP pin-spacer once scrolled past;
    // the spacer reflects their true document position and full scroll duration.
    const box = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
    const rect = box.getBoundingClientRect();
    const top = rect.top + sy;
    const bottom = top + rect.height;
    // Hold the pose while the section owns the viewport; transition across the boundary.
    const start = id === "hero" ? -Infinity : top - vh * 0.45;
    const end = Math.max(start, bottom - vh * 0.65);
    next.push({ at: start, pose }, { at: end, pose });
  }
  keyframes = next.sort((a, b) => a.at - b.at);
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export function poseAt(scrollY: number): ScenePose {
  if (keyframes.length === 0) return motion.pose;
  if (scrollY <= keyframes[0].at) return keyframes[0].pose;
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (scrollY >= a.at && scrollY <= b.at) {
      const span = b.at - a.at;
      const t = span <= 0 || !Number.isFinite(span) ? 1 : smooth((scrollY - a.at) / span);
      return {
        x: a.pose.x + (b.pose.x - a.pose.x) * t,
        y: a.pose.y + (b.pose.y - a.pose.y) * t,
        scale: a.pose.scale + (b.pose.scale - a.pose.scale) * t,
        opacity: a.pose.opacity + (b.pose.opacity - a.pose.opacity) * t,
        energy: a.pose.energy + (b.pose.energy - a.pose.energy) * t,
      };
    }
  }
  return keyframes[keyframes.length - 1].pose;
}
