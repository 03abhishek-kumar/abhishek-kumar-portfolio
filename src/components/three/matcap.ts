import * as THREE from "three";

/**
 * Paints a chrome "matcap" (a pre-lit sphere) on a 2D canvas, mirroring the
 * desktop studio: white key strip above, ion-blue rim on the left, violet on
 * the right, a teal kicker below and a ring catch-light in front.
 *
 * A matcap shader is a single texture lookup, so mobile gets the chrome look
 * without environment-map prefiltering or a heavy PBR shader.
 */
export function createChromeMatcap(size = 256): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const s = size;
  const r = s / 2;

  const blob = (x: number, y: number, rad: number, color: string, alpha: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, color.replace("A", String(alpha)));
    g.addColorStop(1, color.replace("A", "0"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  };

  // Base: deep graphite sphere, darker towards the rim.
  const base = ctx.createRadialGradient(r * 0.9, r * 0.8, 0, r, r, r);
  base.addColorStop(0, "#1c1e29");
  base.addColorStop(0.7, "#0b0c12");
  base.addColorStop(1, "#030305");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);

  ctx.globalCompositeOperation = "lighter";
  blob(s * 0.12, s * 0.52, s * 0.42, "rgba(124,140,255,A)", 0.95); // blue rim (left)
  blob(s * 0.9, s * 0.58, s * 0.4, "rgba(177,140,255,A)", 0.85); // violet rim (right)
  blob(s * 0.5, s * 0.95, s * 0.28, "rgba(94,234,212,A)", 0.55); // teal kicker (below)
  blob(s * 0.5, s * 0.1, s * 0.32, "rgba(255,255,255,A)", 0.95); // key strip (above)
  blob(s * 0.36, s * 0.27, s * 0.09, "rgba(255,255,255,A)", 1); // hotspot

  // Front ring catch-light.
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = s * 0.018;
  ctx.filter = `blur(${Math.round(s * 0.01)}px)`;
  ctx.beginPath();
  ctx.arc(r, r, s * 0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.filter = "none";

  // Mask outside the sphere.
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
