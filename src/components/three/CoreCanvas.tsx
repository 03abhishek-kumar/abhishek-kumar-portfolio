"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "@/lib/motion-store";
import { measureScenes, poseAt } from "@/lib/scene-director";
import {
  coreDisplace,
  haloFragment,
  haloVertex,
  particleFragment,
  particleVertex,
  simplexNoise3D,
} from "./shaders";
import { createChromeMatcap } from "./matcap";

type Tier = "low" | "high";

const damp = THREE.MathUtils.damp;
const ORIGIN = new THREE.Vector3(0, 0, 0);

/* ─────────────────────────────────────────────────────────────
   Shared animated state that the director writes and meshes read.
   ───────────────────────────────────────────────────────────── */
const live = {
  x: 0.42,
  y: 0,
  scale: 0,
  opacity: 0,
  energy: 0,
  enter: 0,
  spin: 0,
};

/* ─────────────────────────────── Director ─────────────────────────────── */
function Director({
  layer,
  isMobile,
  onLive,
}: {
  layer: RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  onLive?: () => void;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const measure = () => measureScenes(isMobile);
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    ScrollTrigger.addEventListener("refresh", measure);

    let visible = false;
    let started = performance.now();
    let ready = false;

    // Compile shaders without blocking the main thread (KHR_parallel_shader_compile
    // where available) before the first frame is ever drawn.
    let compiled = false;
    let cancelled = false;
    let announced = false;
    Promise.resolve(gl.compileAsync ? gl.compileAsync(scene, camera) : undefined)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) compiled = true;
      });

    const tick = () => {
      if (!compiled) return;
      const now = performance.now();
      const isReady = document.documentElement.classList.contains("is-ready");
      if (isReady && !ready) {
        ready = true;
        started = now;
      }
      if (ready && !announced) {
        announced = true;
        onLive?.();
      }
      const target = poseAt(motion.scrollY);
      const k = motion.reducedMotion ? 1 : 0.075;
      live.x += (target.x - live.x) * k;
      live.y += (target.y - live.y) * k;
      live.scale += (target.scale - live.scale) * k;
      live.energy += (target.energy - live.energy) * k;
      live.enter = ready
        ? motion.reducedMotion
          ? 1
          : Math.min(1, (now - started) / 2200)
        : 0;
      const easedEnter = 1 - Math.pow(1 - live.enter, 4);
      live.opacity += (target.opacity * easedEnter - live.opacity) * (motion.reducedMotion ? 1 : 0.12);

      const el = layer.current;
      if (el) {
        el.style.opacity = live.opacity.toFixed(3);
        if (!visible && live.opacity > 0.002) el.classList.add("is-visible");
      }
      visible = live.opacity > 0.004;
      // Only render while the core can actually be seen.
      if (visible) invalidate();
    };

    gsap.ticker.add(tick);
    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      ro.disconnect();
      ScrollTrigger.removeEventListener("refresh", measure);
    };
  }, [invalidate, isMobile, layer, gl, scene, camera, onLive]);

  return null;
}

/* ─────────────────────────────── The core ─────────────────────────────── */
function Core({ tier }: { tier: Tier }) {
  const group = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmp: { value: 0.16 }, uRipple: { value: 0.015 } }),
    [],
  );

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, tier === "high" ? 56 : 26), [tier]);

  const material = useMemo(() => {
    // Desktop: physical PBR reflecting the lightformer studio.
    // Mobile: a matcap painted to match that studio, one texture lookup, no env map.
    const m =
      tier === "high"
        ? new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#e6e8f2"),
            metalness: 1,
            roughness: 0.07,
            clearcoat: 1,
            clearcoatRoughness: 0.05,
            envMapIntensity: 1.35,
          })
        : new THREE.MeshMatcapMaterial({ matcap: createChromeMatcap(256) });
    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\n${simplexNoise3D}\n${coreDisplace}`)
        .replace(
          "#include <beginnormal_vertex>",
          /* glsl */ `
          vec3 _n = normalize(position);
          vec3 _up = abs(_n.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
          vec3 _t = normalize(cross(_n, _up));
          vec3 _b = normalize(cross(_n, _t));
          float _e = 0.012;
          vec3 _p0 = coreDisplace(position);
          vec3 _p1 = coreDisplace(position + _t * _e);
          vec3 _p2 = coreDisplace(position + _b * _e);
          vec3 objectNormal = normalize(cross(_p1 - _p0, _p2 - _p0));
          if (dot(objectNormal, _n) < 0.0) objectNormal = -objectNormal;
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3(tangent.xyz);
          #endif
          `,
        )
        .replace("#include <begin_vertex>", "vec3 transformed = _p0;");
    };
    m.customProgramCacheKey = () => `ak-core-v2-${tier}`;
    return m;
  }, [uniforms, tier]);

  useEffect(() => () => {
    geometry.dispose();
    if ("matcap" in material) material.matcap?.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = motion.reducedMotion ? 0 : state.clock.elapsedTime;
    const vel = Math.min(Math.abs(motion.velocity), 60) / 60;

    uniforms.uTime.value = t;
    uniforms.uAmp.value = damp(uniforms.uAmp.value, 0.13 + live.energy * 0.04 + vel * 0.07, 3, delta);
    uniforms.uRipple.value = damp(uniforms.uRipple.value, 0.003 + vel * 0.045 + live.energy * 0.012, 4, delta);

    // Position in viewport-relative units.
    const v = state.viewport.getCurrentViewport(state.camera, ORIGIN);
    const hw = v.width / 2;
    const hh = v.height / 2;
    const base = THREE.MathUtils.clamp(Math.min(hw * 0.34, hh * 0.56), 0.55, 1.25);
    const enter = 1 - Math.pow(1 - live.enter, 4);

    g.position.x = live.x * hw;
    g.position.y = live.y * hh + (1 - enter) * -0.4;
    const s = base * live.scale * (0.6 + 0.4 * enter);
    g.scale.setScalar(Math.max(s, 0.0001));

    // Pointer parallax + slow idle drift + scroll-driven spin.
    if (!motion.reducedMotion) {
      live.spin += delta * (0.08 + live.energy * 0.25) + motion.velocity * 0.0009;
    }
    const px = motion.pointer.x;
    const py = motion.pointer.y;
    const sp = spinner.current;
    if (sp) {
      sp.rotation.y = damp(sp.rotation.y, live.spin + px * 0.35, 2.5, delta);
      sp.rotation.x = damp(sp.rotation.x, -py * 0.25 + Math.sin(t * 0.3) * 0.08, 2.5, delta);
    }
    if (mesh.current) mesh.current.rotation.z = t * 0.05;
  });

  return (
    <group ref={group}>
      <group ref={spinner}>
        <mesh ref={mesh} geometry={geometry} material={material} />
        <Rings tier={tier} />
      </group>
      <Halo />
    </group>
  );
}

/* ─────────────────────────────── Rings + satellites ─────────────────────────────── */
function Rings({ tier }: { tier: Tier }) {
  const refs = [useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const rings = useMemo(
    () => [
      { r: 1.62, tube: 0.0045, tilt: [1.25, 0.2, 0.0], speed: 0.18, color: "#9aa6ff", opacity: 0.5 },
      { r: 2.08, tube: 0.003, tilt: [1.05, -0.5, 0.3], speed: -0.12, color: "#c4b5fd", opacity: 0.26 },
      { r: 2.65, tube: 0.0025, tilt: [1.45, 0.6, -0.2], speed: 0.07, color: "#5eead4", opacity: 0.12 },
    ],
    [],
  );
  const satMat = useMemo(
    () =>
      tier === "high"
        ? new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 1, roughness: 0.1 })
        : new THREE.MeshBasicMaterial({ color: "#c7ccff" }),
    [tier],
  );

  useFrame((state, delta) => {
    const t = motion.reducedMotion ? 0 : state.clock.elapsedTime;
    refs.forEach((ref, i) => {
      const g = ref.current;
      if (!g) return;
      const spread = 1 + live.energy * 0.12 * (i + 1);
      g.scale.setScalar(damp(g.scale.x, spread, 2, delta));
      g.rotation.z = t * rings[i].speed;
    });
  });

  return (
    <>
      {rings.map((ring, i) => (
        <group key={i} rotation={ring.tilt as [number, number, number]}>
          <group ref={refs[i]}>
            <mesh>
              <torusGeometry args={[ring.r, ring.tube, 8, tier === "high" ? 220 : 120]} />
              <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} depthWrite={false} />
            </mesh>
            <mesh position={[ring.r, 0, 0]} material={satMat}>
              <sphereGeometry args={[0.035 + i * 0.012, 24, 24]} />
            </mesh>
          </group>
        </group>
      ))}
    </>
  );
}

/* ─────────────────────────────── Halo glow ─────────────────────────────── */
function Halo() {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color("#6d7cff") }, uOpacity: { value: 0.22 } }),
    [],
  );
  return (
    <mesh position={[0, 0, -1.2]} renderOrder={-1}>
      <planeGeometry args={[7, 7]} />
      <shaderMaterial
        vertexShader={haloVertex}
        fragmentShader={haloFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ─────────────────────────────── Particle field ─────────────────────────────── */
function Particles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const gl = useThree((s) => s.gl);
  const { geometry, uniforms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Shell distribution — denser near the core, sparse further out.
      const r = 2.4 + Math.pow(Math.random(), 1.6) * 9;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.6;
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.9;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
      seed[i] = Math.random();
      size[i] = 0.6 + Math.random() * 1.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return {
      geometry: g,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uOpacity: { value: 0.9 },
        uColorA: { value: new THREE.Color("#c7ccff") },
        uColorB: { value: new THREE.Color("#a78bfa") },
      },
    };
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const t = motion.reducedMotion ? 0 : state.clock.elapsedTime;
    uniforms.uTime.value = t;
    uniforms.uPixelRatio.value = gl.getPixelRatio();
    const p = points.current;
    if (!p) return;
    p.rotation.y = t * 0.012 + motion.scrollY * 0.00008;
    p.rotation.x = damp(p.rotation.x, motion.pointer.y * 0.05, 2, delta);
    p.position.y = damp(p.position.y, motion.scrollY * 0.0004, 4, delta);
  });

  return (
    <points ref={points} geometry={geometry}>
      <shaderMaterial
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─────────────────────────────── Camera rig ─────────────────────────────── */
function CameraRig() {
  useFrame((state, delta) => {
    const cam = state.camera;
    const tx = motion.reducedMotion ? 0 : motion.pointer.x * 0.35;
    const ty = motion.reducedMotion ? 0 : motion.pointer.y * 0.22;
    cam.position.x = damp(cam.position.x, tx, 2, delta);
    cam.position.y = damp(cam.position.y, ty, 2, delta);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

/* ─────────────────────────────── Studio lighting ─────────────────────────────── */
/**
 * A tiny "studio": emissive light strips rendered once into a prefiltered
 * environment map with three's own PMREMGenerator (no HDR files, no loaders).
 */
function Studio() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    const env = new THREE.Scene();
    env.background = new THREE.Color("#030305");
    const disposables: { dispose: () => void }[] = [];
    const strip = (
      geo: THREE.BufferGeometry,
      color: string,
      intensity: number,
      pos: [number, number, number],
      rot: [number, number, number],
      scale: [number, number, number],
    ) => {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
        toneMapped: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      mesh.scale.set(...scale);
      env.add(mesh);
      disposables.push(mat);
    };
    const plane = new THREE.PlaneGeometry(1, 1);
    const ring = new THREE.RingGeometry(0.5, 1, 64);
    disposables.push(plane, ring);

    strip(plane, "#ffffff", 3.2, [0, 5, -3], [Math.PI / 2, 0, 0], [12, 1.4, 1]); // key
    strip(plane, "#7c8cff", 2.6, [-6, 0.5, 0], [0, Math.PI / 2, 0], [10, 2.4, 1]); // blue rim
    strip(plane, "#b18cff", 2.4, [6, -1, 0], [0, -Math.PI / 2, 0], [10, 2.4, 1]); // violet rim
    strip(ring, "#ffffff", 1.6, [0, 0, 7], [0, 0, 0], [2.4, 2.4, 2.4]); // ring catch-light
    strip(plane, "#5eead4", 1.1, [0, -5, 2], [-Math.PI / 2, 0, 0], [8, 1, 1]); // teal kicker

    const pmrem = new THREE.PMREMGenerator(gl);
    const target = pmrem.fromScene(env, 0.02);
    scene.environment = target.texture;

    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      disposables.forEach((d) => d.dispose());
    };
  }, [gl, scene]);

  return null;
}

/* ─────────────────────────────── Canvas ─────────────────────────────── */
export default function CoreCanvas({
  layer,
  onLive,
}: {
  layer: RefObject<HTMLDivElement | null>;
  onLive?: () => void;
}) {
  const [isMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(pointer: coarse)").matches,
  );
  const tier: Tier = isMobile ? "low" : "high";
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);

  return (
    <Canvas
      frameloop="demand"
      dpr={dpr}
      camera={{ fov: 35, position: [0, 0, 7], near: 0.1, far: 60 }}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(0x000000, 0);
      }}
      aria-hidden
    >
      <Director layer={layer} isMobile={isMobile} onLive={onLive} />
      <CameraRig />
      {tier === "high" && <Studio />}
      <Core tier={tier} />
      <Particles count={isMobile ? 380 : 1400} />
    </Canvas>
  );
}
