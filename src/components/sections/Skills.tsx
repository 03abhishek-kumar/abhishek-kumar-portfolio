import { skillGroups, skillLevels, type SkillLevel } from "@/content/skills";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { esc } from "@/lib/svg";
import { SkillsFocus } from "./SkillsFocus";

const CENTERS: Record<string, [number, number]> = {
  frontend: [255, 215],
  backend: [745, 225],
  ai: [270, 590],
  infra: [735, 585],
};
const CORE: [number, number] = [500, 400];

// Conceptual adjacencies drawn between clusters.
const BRIDGES: [string, string][] = [
  ["Next.js", "Vercel"],
  ["Node.js", "Docker"],
  ["Evaluation engines", "PostgreSQL"],
  ["React", "Node.js"],
  ["Python", "Ollama"],
];

type Placed = {
  name: string;
  level: SkillLevel;
  group: string;
  x: number;
  y: number;
  anchor: "start" | "end" | "middle";
  lx: number;
  ly: number;
  i: number;
};

function layout(): Placed[] {
  const nodes: Placed[] = [];
  for (const g of skillGroups) {
    const [cx, cy] = CENTERS[g.id] ?? CORE;
    const n = g.skills.length;
    // Fan nodes away from the core so clusters never collide in the middle.
    const away = Math.atan2(cy - CORE[1], cx - CORE[0]);
    const spread = Math.PI * 1.55;
    g.skills.forEach((s, i) => {
      const a = away - spread / 2 + (spread * i) / Math.max(1, n - 1);
      const r = 118 + (i % 2) * 34;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * 0.86;
      const c = Math.cos(a);
      const anchor = c > 0.25 ? "start" : c < -0.25 ? "end" : "middle";
      const lx = x + (anchor === "start" ? 13 : anchor === "end" ? -13 : 0);
      const ly = y + (anchor === "middle" ? (Math.sin(a) > 0 ? 24 : -15) : 5);
      nodes.push({ name: s.name, level: s.level, group: g.id, x, y, anchor, lx, ly, i: nodes.length });
    });
  }
  return nodes;
}

const f = (n: number) => n.toFixed(1);

/** The constellation as a static SVG string: one opaque node for React to hydrate. */
function constellationSvg(nodes: Placed[]) {
  const byName = new Map(nodes.map((n) => [n.name, n]));
  let s = `<svg viewBox="0 0 1000 800" width="100%" style="display:block;overflow:visible" role="img" aria-label="Constellation of technical skills grouped into frontend, backend and data, AI, and tools and infrastructure.">`;
  s += `<defs><radialGradient id="core-glow"><stop offset="0" stop-color="#7c8cff" stop-opacity="0.55"/><stop offset="1" stop-color="#7c8cff" stop-opacity="0"/></radialGradient></defs>`;
  for (const r of [150, 290, 400]) {
    s += `<ellipse cx="${CORE[0]}" cy="${CORE[1]}" rx="${r * 1.15}" ry="${r * 0.85}" fill="none" stroke="rgb(255 255 255 / 0.05)"/>`;
  }
  for (const [a, b] of BRIDGES) {
    const A = byName.get(a);
    const B = byName.get(b);
    if (!A || !B) continue;
    s += `<path data-bridge="${A.group} ${B.group}" d="M${f(A.x)},${f(A.y)} Q${CORE[0]},${CORE[1]} ${f(B.x)},${f(B.y)}" fill="none" stroke="#a78bfa" stroke-opacity="0.16" stroke-dasharray="2 6"/>`;
  }
  for (const g of skillGroups) {
    const [cx, cy] = CENTERS[g.id];
    s += `<g data-cluster="${g.id}">`;
    s += `<circle cx="${cx}" cy="${cy}" r="155" fill="transparent"/>`;
    s += `<line x1="${CORE[0]}" y1="${CORE[1]}" x2="${cx}" y2="${cy}" stroke="#7c8cff" stroke-opacity="0.35" stroke-dasharray="4 8" style="animation:dash 1.6s linear infinite"/>`;
    for (const n of nodes.filter((n) => n.group === g.id)) {
      s += `<line x1="${cx}" y1="${cy}" x2="${f(n.x)}" y2="${f(n.y)}" stroke="rgb(255 255 255 / 0.12)"/>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="6" fill="#7c8cff"/><circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="#7c8cff" stroke-opacity="0.4"/>`;
    s += `<text x="${cx}" y="${cy + (cy < CORE[1] ? -26 : 36)}" text-anchor="middle" fill="#7c8cff" font-size="13" font-family="var(--font-mono)" letter-spacing="2">${esc(g.title.toUpperCase())}</text>`;
    for (const n of nodes.filter((n) => n.group === g.id)) {
      const anim = `animation:node-float ${5 + (n.i % 4)}s ease-in-out ${(n.i % 7) * -0.7}s infinite;--fx:${(n.i % 3) - 1}px;--fy:${-3 - (n.i % 3)}px`;
      s += `<g style="${anim}">`;
      if (n.level === "core") s += `<circle cx="${f(n.x)}" cy="${f(n.y)}" r="14" fill="#fff" fill-opacity="0.07"/>`;
      const r = n.level === "core" ? 6.5 : n.level === "working" ? 5 : 4.5;
      const fill = n.level === "core" ? "#fff" : n.level === "working" ? "#7c8cff" : "transparent";
      const stroke = n.level === "exploring" ? ` stroke="#7b7b87" stroke-width="1.4"` : "";
      s += `<circle cx="${f(n.x)}" cy="${f(n.y)}" r="${r}" fill="${fill}"${stroke}/>`;
      s += `<text x="${f(n.lx)}" y="${f(n.ly)}" text-anchor="${n.anchor}" fill="${n.level === "exploring" ? "#8d8d99" : "#ededf0"}" font-size="16" font-family="var(--font-geist)">${esc(n.name)}</text>`;
      s += `</g>`;
    }
    s += `</g>`;
  }
  s += `<circle cx="${CORE[0]}" cy="${CORE[1]}" r="90" fill="url(#core-glow)"/>`;
  s += `<circle cx="${CORE[0]}" cy="${CORE[1]}" r="30" fill="#0b0b10" stroke="rgb(255 255 255 / 0.3)"/>`;
  s += `<text x="${CORE[0]}" y="${CORE[1] + 5}" text-anchor="middle" fill="#ededf0" font-size="15" font-family="var(--font-mono)" letter-spacing="2">AK</text>`;
  return s + `</svg>`;
}

const levelDot: Record<SkillLevel, string> = {
  core: "bg-fg shadow-[0_0_10px_rgba(255,255,255,0.6)]",
  working: "bg-accent",
  exploring: "border border-subtle bg-transparent",
};

export function Skills() {
  const nodes = layout();
  // Dimming rules per group, driven by `data-focus` on the section (set by SkillsFocus).
  const focusCss = skillGroups
    .map(
      (g) =>
        `#skills[data-focus="${g.id}"] [data-cluster]:not([data-cluster="${g.id}"]){opacity:.14}` +
        `#skills[data-focus="${g.id}"] [data-bridge]:not([data-bridge~="${g.id}"]){stroke-opacity:.04}` +
        `@media (min-width:1024px){#skills[data-focus="${g.id}"] [data-group]:not([data-group="${g.id}"]){opacity:.4}}`,
    )
    .join("");

  return (
    <section id="skills" data-scene="skills" aria-labelledby="skills-title" className="relative py-28 md:py-40">
      <style>{`#skills [data-cluster],#skills [data-group]{transition:opacity .5s}#skills [data-bridge]{transition:stroke-opacity .5s}${focusCss}`}</style>
      <div className="container-x">
        <SectionHeader
          id="skills-title"
          index="05"
          label="Technical skills"
          title={["A toolkit, mapped", { em: "honestly." }]}
          intro="Grouped by where they sit in a product. Each tool is marked by how deeply I've actually used it, from daily drivers to things I'm still exploring."
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* Constellation (decorative duplicate of the list on the right) */}
          <div
            className="relative hidden lg:col-span-7 lg:block"
            data-reveal
            dangerouslySetInnerHTML={{ __html: constellationSvg(nodes) }}
          />

          {/* Accessible grouped list */}
          <div className="lg:col-span-5">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 border-b border-line pb-5" aria-label="Skill levels">
              {(Object.keys(skillLevels) as SkillLevel[]).map((l) => (
                <li key={l} className="flex items-center gap-2 text-xs text-muted">
                  <span className={`size-2 rounded-full ${levelDot[l]}`} aria-hidden />
                  <span className="text-fg">{skillLevels[l].label}</span>
                  <span className="hidden text-subtle sm:inline">· {skillLevels[l].description}</span>
                </li>
              ))}
            </ul>

            <ul className="mt-2">
              {skillGroups.map((g, gi) => (
                <li
                  key={g.id}
                  data-group={g.id}
                  data-reveal
                  style={{ ["--d" as string]: gi * 80 }}
                  tabIndex={0}
                  aria-label={`${g.title}: ${g.skills.map((s) => `${s.name} (${skillLevels[s.level].label})`).join(", ")}`}
                  className="group border-b border-line py-6 outline-none"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-xl font-medium tracking-[-0.025em] transition-colors group-hover:text-accent group-focus-visible:text-accent">
                      {g.title}
                    </h3>
                    <span className="font-mono text-xs text-subtle">{String(g.skills.length).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{g.blurb}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-hidden>
                    {g.skills.map((s) => (
                      <li
                        key={s.name}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[0.8rem] ${
                          s.level === "exploring" ? "border-line text-muted" : "border-line-strong text-fg/90"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${levelDot[s.level]}`} />
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SkillsFocus />
    </section>
  );
}
