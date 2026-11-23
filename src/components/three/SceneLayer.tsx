"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

// Three.js + R3F live in their own chunk and never block first paint.
const CoreCanvas = dynamic(() => import("./CoreCanvas"), { ssr: false });

/**
 * True only for hardware-accelerated WebGL. Software rasterisers (SwiftShader,
 * llvmpipe, WARP) run shaders on the CPU, where compiling the materials can
 * freeze the main thread for over a second, so those keep the CSS poster.
 */
function hasHardwareWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|microsoft basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/** Visitors who don't interact still get the 3D core after this long. */
const IDLE_FALLBACK_MS = 5500;

/**
 * Progressive enhancement for the 3D core:
 *  1. First paint: a lightweight CSS "poster" of the chrome core (same spot, same palette).
 *  2. On first intent (pointer, touch, wheel, key, scroll), or after a few idle seconds,
 *     the WebGL chunk loads and the live core crossfades in over the poster.
 * Heavy GPU/JS work therefore never competes with the initial load on phones.
 */
export function SceneLayer() {
  const layer = useRef<HTMLDivElement>(null);
  const poster = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState(false);
  const [posterGone, setPosterGone] = useState(false);

  // Poster: fade with the hero as it scrolls away.
  useEffect(() => {
    if (posterGone) return;
    const fade = () => {
      const el = poster.current;
      if (!el || el.dataset.leaving) return;
      const o = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.9));
      el.style.opacity = o.toFixed(3);
    };
    fade();
    window.addEventListener("scroll", fade, { passive: true });
    return () => window.removeEventListener("scroll", fade);
  }, [posterGone]);

  useEffect(() => {
    // `?webgl=force` previews the 3D scene on software renderers anyway.
    const forced = new URLSearchParams(window.location.search).get("webgl") === "force";
    if (!forced && !hasHardwareWebGL()) return; // poster only

    const html = document.documentElement;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let wanted = false;
    let done = false;
    let idleId = 0;
    const start = () => {
      if (done || !wanted || !html.classList.contains("is-ready")) return;
      done = true;
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setWebgl(true), { timeout: 400 });
      else setWebgl(true);
    };
    const want = () => {
      wanted = true;
      start();
    };

    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, want, { once: true, passive: true }));
    const timer = window.setTimeout(want, IDLE_FALLBACK_MS);
    // If intent arrives during the intro, start as soon as the intro ends.
    const mo = new MutationObserver(start);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      events.forEach((e) => window.removeEventListener(e, want));
      window.clearTimeout(timer);
      mo.disconnect();
      if (idleId) w.cancelIdleCallback?.(idleId);
    };
  }, []);

  // Live core has drawn its first frame → retire the poster.
  const onLive = useCallback(() => {
    const el = poster.current;
    if (!el) return;
    el.dataset.leaving = "1";
    el.style.transition = "opacity 1.4s cubic-bezier(0.16,1,0.3,1)";
    el.style.opacity = "0";
    window.setTimeout(() => setPosterGone(true), 1500);
  }, []);

  return (
    <>
      <div className="atmosphere" aria-hidden />
      {!posterGone && (
        <div ref={poster} className="scene-poster" aria-hidden>
          <div className="scene-fallback" />
        </div>
      )}
      <div ref={layer} className="scene-layer" aria-hidden>
        {webgl && <CoreCanvas layer={layer} onLive={onLive} />}
      </div>
    </>
  );
}
