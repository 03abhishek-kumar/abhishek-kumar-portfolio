import type { ProjectVisual as VisualKind } from "@/content/projects";

/**
 * Code-drawn thumbnails. Each one illustrates the real mechanics of the
 * project rather than showing a generic screenshot. Purely decorative.
 */
export function ProjectVisual({ kind }: { kind: VisualKind }) {
  return (
    <div className="@container absolute inset-0" aria-hidden>
      {kind === "eduvantix" && <EduvantixVisual />}
      {kind === "viva" && <VivaVisual />}
      {kind === "bouncer" && <BouncerVisual />}
      {kind === "bhojango" && <BhojanGoVisual />}
      {kind === "health" && <HealthVisual />}
    </div>
  );
}

function GridBg() {
  return (
    <div
      className="absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          "linear-gradient(rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(ellipse at 60% 40%, black 30%, transparent 75%)",
      }}
    />
  );
}

/* ─────────────────────────────── Eduvantix ─────────────────────────────── */
function EduvantixVisual() {
  const nav = ["Learn", "Practice", "Viva", "Live", "Career", "Institute"];
  return (
    <div className="absolute inset-0 flex items-center justify-center p-[6%]">
      <GridBg />
      <div className="relative flex h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b0c14]/90 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* sidebar */}
        <div className="hidden w-[22%] flex-col gap-1 border-r border-white/[0.06] p-3 @md:flex">
          <div className="mb-3 flex items-center gap-2">
            <span className="size-4 rounded-md bg-gradient-to-br from-[#7c8cff] to-[#a78bfa]" />
            <span className="text-[10px] font-semibold tracking-tight text-white/80">eduvantix</span>
          </div>
          {nav.map((n, i) => (
            <div
              key={n}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${i === 2 ? "bg-[#7c8cff]/15 text-white" : "text-white/45"}`}
            >
              <span className={`size-1.5 rounded-full ${i === 2 ? "bg-[#7c8cff]" : "bg-white/20"}`} />
              {n}
            </div>
          ))}
        </div>
        {/* main */}
        <div className="flex flex-1 flex-col gap-3 p-3 @md:p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-2 w-24 rounded-full bg-white/70" />
              <div className="h-1.5 w-36 rounded-full bg-white/15" />
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 px-2 py-1 text-[9px] text-white/60">
              <span className="size-1.5 animate-[pulse-dot_1.6s_ease-in-out_infinite] rounded-full bg-[#f87171]" />
              Live class · REC
            </div>
          </div>
          <div className="grid flex-1 grid-cols-6 grid-rows-2 gap-2.5">
            {/* progress ring */}
            <div className="col-span-2 row-span-1 flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <svg viewBox="0 0 36 36" className="size-[38%] min-w-8 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="url(#edg)" strokeWidth="3" strokeDasharray="94" strokeDashoffset="30" strokeLinecap="round" />
                <defs>
                  <linearGradient id="edg">
                    <stop offset="0" stopColor="#7c8cff" />
                    <stop offset="1" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="hidden flex-1 space-y-1.5 @sm:block">
                <div className="h-1.5 w-full rounded-full bg-white/40" />
                <div className="h-1.5 w-2/3 rounded-full bg-white/15" />
              </div>
            </div>
            {/* code card */}
            <div className="col-span-4 row-span-1 overflow-hidden rounded-lg border border-white/[0.07] bg-[#07080d] p-2.5 font-mono text-[8.5px] leading-[1.55] @lg:text-[10px]">
              <div className="text-white/55">{"// practice · javascript"}</div>
              <div>
                <span className="text-[#c4b5fd]">function</span> <span className="text-[#7dd3fc]">twoSum</span>
                <span className="text-white/60">(nums, target) {"{"}</span>
              </div>
              <div className="pl-3">
                <span className="text-[#c4b5fd]">const</span> <span className="text-white/70">seen = </span>
                <span className="text-[#c4b5fd]">new</span> <span className="text-[#7dd3fc]">Map</span>
                <span className="text-white/60">();</span>
              </div>
              <div className="pl-3 text-white/40">
                <span className="text-[#c4b5fd]">for</span> (...)
                <span className="ml-0.5 inline-block h-2.5 w-1 translate-y-0.5 animate-[blink_1s_steps(1)_infinite] bg-[#7c8cff]" />
              </div>
              <div className="mt-1 flex gap-1.5">
                <span className="rounded bg-[#4ade80]/15 px-1.5 text-[#4ade80]">✓ test 1</span>
                <span className="rounded bg-[#4ade80]/15 px-1.5 text-[#4ade80]">✓ test 2</span>
              </div>
            </div>
            {/* course list */}
            <div className="col-span-3 row-span-1 space-y-2 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              {[0.85, 0.6, 0.4].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="size-4 shrink-0 rounded bg-white/10" />
                  <div className="flex-1 space-y-1">
                    <div className="h-1.5 rounded-full bg-white/30" style={{ width: `${50 + i * 12}%` }} />
                    <div className="h-1 rounded-full bg-white/10">
                      <div className="h-1 rounded-full bg-[#7c8cff]" style={{ width: `${w * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* AI viva card */}
            <div className="col-span-3 row-span-1 flex flex-col justify-between rounded-lg border border-[#a78bfa]/30 bg-[#a78bfa]/[0.06] p-2.5">
              <div className="flex items-center justify-between text-[9px] text-white/70">
                <span>AI Viva</span>
                <span className="rounded-full bg-[#a78bfa]/20 px-1.5 text-[#c4b5fd]">session</span>
              </div>
              <div className="flex h-[40%] items-center gap-[3px]">
                {Array.from({ length: 22 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-full origin-center rounded-full bg-[#c4b5fd]/70"
                    style={{
                      height: `${30 + ((i * 37) % 70)}%`,
                      animation: `wave ${1 + (i % 5) * 0.18}s ease-in-out ${i * 0.05}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── AI Viva ─────────────────────────────── */
function VivaVisual() {
  const keywords: [string, boolean][] = [
    ["function", true],
    ["lexical scope", true],
    ["outer variables", true],
    ["memory", false],
  ];
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-[5%] p-[7%]">
      <GridBg />
      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Q · JavaScript</p>
        <p className="mt-2 text-[clamp(0.95rem,4.2cqw,1.6rem)] font-medium leading-tight tracking-[-0.02em] text-white">
          “Explain closures in JavaScript.”
        </p>
      </div>
      <div className="relative flex h-[18%] min-h-10 items-center gap-[2px]">
        {Array.from({ length: 56 }).map((_, i) => (
          <span
            key={i}
            className="w-full origin-center rounded-full"
            style={{
              height: `${18 + Math.abs(Math.sin(i * 0.7) * 70) + ((i * 13) % 12)}%`,
              background: `linear-gradient(to top, #7c8cff, #c4b5fd)`,
              opacity: 0.35 + (i % 7) * 0.08,
              animation: `wave ${0.9 + (i % 6) * 0.15}s ease-in-out ${i * 0.03}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="relative grid grid-cols-[1fr_auto] items-end gap-4">
        <div>
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">Expected keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map(([k, hit]) => (
              <span
                key={k}
                className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                  hit ? "border-[#4ade80]/40 bg-[#4ade80]/10 text-[#86efac]" : "border-[#f87171]/40 bg-[#f87171]/10 text-[#fca5a5]"
                }`}
              >
                {hit ? "✓" : "✗"} {k}
              </span>
            ))}
          </div>
        </div>
        <div className="relative grid size-[clamp(3.5rem,16cqw,6rem)] place-items-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="2.5" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray="97.4" strokeDashoffset="24.4" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-[11px] text-white">3/4</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Bouncer ─────────────────────────────── */
function BouncerVisual() {
  const rows: [string, string, "REVOKE" | "HOLD" | "KEEP" | "REVOKE DELETE"][] = [
    ["test_final_2", "superuser · not in HR", "REVOKE"],
    ["intern_2023", "left 425d ago", "REVOKE"],
    ["priya", "DELETE never used", "REVOKE DELETE"],
    ["svc_payments_sync", "unused 91d · critical job", "HOLD"],
    ["alice", "active · recent use", "KEEP"],
  ];
  const tone = (d: string) =>
    d === "HOLD"
      ? "border-[#fbbf24]/50 bg-[#fbbf24]/10 text-[#fcd34d]"
      : d === "KEEP"
        ? "border-[#4ade80]/40 bg-[#4ade80]/10 text-[#86efac]"
        : "border-[#f87171]/40 bg-[#f87171]/10 text-[#fca5a5]";
  return (
    <div className="absolute inset-0 flex items-center justify-center p-[6%]">
      <GridBg />
      <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#06090a]/95 font-mono text-[9.5px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] @lg:text-[11px]">
        <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-2">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="ml-2 text-white/40">bouncer · access review</span>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {rows.map(([role, why, d]) => (
            <div
              key={role}
              className={`grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-2 @md:grid-cols-[1.1fr_1.4fr_auto] ${
                d === "HOLD" ? "bg-[#fbbf24]/[0.05]" : ""
              }`}
            >
              <span className="truncate text-white/85">{role}</span>
              <span className="hidden truncate text-white/40 @md:block">{why}</span>
              <span className={`rounded border px-1.5 py-0.5 text-[9px] tracking-wider ${tone(d)}`}>{d}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-white/[0.07] px-3 py-2.5 text-[#5eead4]">
          <span className="size-1.5 animate-[pulse-dot_1.4s_ease-in-out_infinite] rounded-full bg-[#5eead4]" />
          STOP · awaiting human approval
          <span className="ml-auto hidden text-white/30 @md:inline">dry run passed</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── BhojanGo ─────────────────────────────── */
function BhojanGoVisual() {
  const steps = ["Placed", "Preparing", "On the way", "Delivered"];
  // Bar shape mirrors the repo's peak-hour chart sample data.
  const slots = [
    { label: "Morning", bars: [2, 3, 2.5, 3.5] },
    { label: "Lunch", bars: [5, 9, 8, 6], active: true },
    { label: "Tea", bars: [3, 4, 3.5, 4.5] },
    { label: "Dinner", bars: [6, 7, 8, 6.5] },
  ];
  return (
    <div className="absolute inset-0 grid grid-cols-1 gap-[4%] p-[6%] @lg:grid-cols-[1.1fr_1fr]">
      <GridBg />
      {/* order journey */}
      <div className="relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#0d0a08]/90 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white/85">Order journey</span>
          <span className="rounded-full bg-[#fb923c]/15 px-2 py-0.5 font-mono text-[9px] text-[#fdba74]">tracking</span>
        </div>
        <div className="relative my-4">
          <div className="absolute left-0 right-0 top-[7px] h-px bg-white/10" />
          <div className="absolute left-0 top-[7px] h-px w-[62%] bg-gradient-to-r from-[#fb923c] to-[#fdba74]" />
          <div className="relative flex justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <span
                  className={`size-[15px] rounded-full border-2 ${
                    i < 2 ? "border-[#fb923c] bg-[#fb923c]" : i === 2 ? "border-[#fb923c] bg-[#0d0a08]" : "border-white/20 bg-[#0d0a08]"
                  }`}
                  style={i === 2 ? { animation: "pulse-dot 1.4s ease-in-out infinite" } : undefined}
                />
                <span className="text-[9px] text-white/50">{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-2">
              <span className="size-7 shrink-0 rounded-md bg-gradient-to-br from-[#fb923c]/60 to-[#f43f5e]/40" />
              <div className="flex-1 space-y-1">
                <div className="h-1.5 rounded-full bg-white/40" style={{ width: `${60 - i * 15}%` }} />
                <div className="h-1 w-1/3 rounded-full bg-white/15" />
              </div>
              <span className="font-mono text-[9px] text-white/40">×{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      {/* peak hours */}
      <div className="relative hidden flex-col justify-between rounded-xl border border-white/10 bg-[#0d0a08]/90 p-4 @lg:flex">
        <span className="text-[11px] font-semibold text-white/85">Peak hours</span>
        <div className="flex flex-1 items-end justify-between gap-3 pt-4">
          {slots.map((s) => (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end justify-center gap-[3px]">
                {s.bars.map((h, j) => (
                  <span
                    key={j}
                    className={`w-full rounded-t-sm ${s.active ? "bg-[#fb923c]" : "bg-white/15"}`}
                    style={{ height: `${(h / 9) * 100}%`, opacity: s.active ? 0.6 + j * 0.1 : 1 }}
                  />
                ))}
              </div>
              <span className={`text-[9px] ${s.active ? "text-[#fdba74]" : "text-white/40"}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Health metrics ─────────────────────────────── */
function HealthVisual() {
  // Semicircle gauge: BMI bands < 18.5, 18.5–24.9, 25–29.9, ≥ 30 mapped across 15–40.
  const bands = [
    { from: 15, to: 18.5, color: "#60a5fa", label: "Under" },
    { from: 18.5, to: 25, color: "#4ade80", label: "Healthy" },
    { from: 25, to: 30, color: "#fbbf24", label: "Over" },
    { from: 30, to: 40, color: "#f87171", label: "Obese" },
  ];
  const toAngle = (v: number) => Math.PI * (1 - (v - 15) / 25);
  const pt = (a: number, r: number) => [50 + r * Math.cos(a), 52 - r * Math.sin(a)];
  const arc = (from: number, to: number, r: number) => {
    const [x1, y1] = pt(toAngle(from), r);
    const [x2, y2] = pt(toAngle(to), r);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[4%] p-[6%]">
      <GridBg />
      <div className="relative w-[78%] max-w-md">
        <svg viewBox="0 0 100 58" className="w-full overflow-visible">
          {bands.map((b) => (
            <path key={b.label} d={arc(b.from, b.to, 40)} stroke={b.color} strokeWidth="7" fill="none" strokeOpacity="0.85" />
          ))}
          {bands.map((b) => {
            const [x, y] = pt(toAngle((b.from + b.to) / 2), 51);
            return (
              <text key={b.label} x={x} y={y} fill="rgb(255 255 255 / 0.5)" fontSize="3.6" textAnchor="middle" fontFamily="var(--font-mono)">
                {b.label}
              </text>
            );
          })}
          <g style={{ transformOrigin: "50px 52px", animation: "needle 6s ease-in-out infinite" }}>
            <line x1="50" y1="52" x2="50" y2="20" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
          </g>
          <circle cx="50" cy="52" r="3" fill="#0b0b10" stroke="#fff" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="relative grid w-[86%] max-w-md grid-cols-2 gap-2 font-mono text-[10px]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <p className="text-white/40">BMI</p>
          <p className="mt-0.5 text-white/85">kg ÷ m²</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
          <p className="text-white/40">BMR · Mifflin–St Jeor</p>
          <p className="mt-0.5 truncate text-white/85">10W + 6.25H − 5A + s</p>
        </div>
      </div>
    </div>
  );
}
