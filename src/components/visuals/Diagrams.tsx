import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, Cpu, Database, FlaskConical, Keyboard, Mic, ShieldCheck, Hand } from "lucide-react";
import type { ProjectDiagram } from "@/content/projects";

export function Diagram({ kind }: { kind: ProjectDiagram }) {
  return kind === "viva" ? <VivaArchitecture /> : <BouncerFlow />;
}

function Node({
  title,
  sub,
  icon,
  tone = "default",
  className = "",
}: {
  title: string;
  sub?: string;
  icon?: ReactNode;
  tone?: "default" | "accent" | "experimental" | "stop";
  className?: string;
}) {
  const tones = {
    default: "border-line-strong bg-white/[0.025]",
    accent: "border-accent/50 bg-accent/[0.08] shadow-[0_0_40px_-12px_rgba(124,140,255,0.6)]",
    experimental: "border-dashed border-accent-2/50 bg-accent-2/[0.04]",
    stop: "border-[#fbbf24]/50 bg-[#fbbf24]/[0.07]",
  } as const;
  return (
    <div className={`rounded-xl border px-4 py-3 ${tones[tone]} ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium tracking-[-0.01em] text-fg">
        {icon}
        {title}
      </div>
      {sub && <p className="mt-1 text-xs leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

function Arrow({ dir = "right" }: { dir?: "right" | "down" }) {
  return (
    <div className="grid place-items-center text-subtle" aria-hidden>
      {dir === "right" ? (
        <>
          <ArrowDown className="size-4 lg:hidden" />
          <ArrowRight className="hidden size-4 lg:block" />
        </>
      ) : (
        <ArrowDown className="size-4" />
      )}
    </div>
  );
}

function Lane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-subtle">{label}</p>
      {children}
    </div>
  );
}

/* ─────────────────────────────── AI Viva ─────────────────────────────── */
function VivaArchitecture() {
  return (
    <figure className="rounded-2xl border border-line bg-ink-2 p-5 md:p-7">
      <div className="grid items-center gap-3 lg:grid-cols-[1fr_auto_1.15fr_auto_1.15fr]">
        <Lane label="Input">
          <Node title="Speech recognition" sub="Spoken answer → transcript" icon={<Mic className="size-4 text-accent" />} />
          <Node title="Text input" sub="Fallback for noisy audio or accessibility" icon={<Keyboard className="size-4 text-accent" />} />
        </Lane>
        <Arrow />
        <Lane label="Viva engine">
          <Node title="Session manager" sub="Starts sessions, serves questions, persists every answer" icon={<Cpu className="size-4 text-accent" />} />
          <Node title="Question banks" sub="JavaScript · Python · DBMS · Computer Networks, each with expected keywords" />
        </Lane>
        <Arrow />
        <Lane label="Evaluation (deterministic)">
          <Node
            tone="accent"
            title="Keyword evaluation engine"
            sub="Runs locally. Matches the answer against expected keywords, with no LLM in the scoring path"
            icon={<ShieldCheck className="size-4 text-accent" />}
          />
          <Node title="Score + feedback" sub="Covered vs. missed concepts, per question and per session" />
        </Lane>
      </div>

      <div className="my-4 flex justify-center">
        <Arrow dir="down" />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Node
          title="Prisma ORM → Neon PostgreSQL"
          sub="Questions, sessions, answers and scores in a relational schema on serverless Postgres"
          icon={<Database className="size-4 text-accent" />}
        />
        <Node
          tone="experimental"
          title="LLM lab: Ollama · Phi-3 (experimental)"
          sub="Local-model experiments for richer AI features. Not used to compute scores."
          icon={<FlaskConical className="size-4 text-accent-2" />}
        />
      </div>

      <figcaption className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm border border-accent/60 bg-accent/20" /> Production scoring path
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm border border-dashed border-accent-2/70" /> Experimental
        </span>
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────── Bouncer ─────────────────────────────── */
function BouncerFlow() {
  const steps: { title: string; sub: string; tone?: "accent" | "stop" }[] = [
    { title: "Scan", sub: "Read-only MCP reads roles, grants & governance data" },
    { title: "Flag", sub: "6 rules surface access that needs a closer look" },
    { title: "Investigate", sub: "HR status, usage history, owners, service dependencies, blast radius" },
    { title: "Decide", sub: "KEEP · REVOKE · HOLD per role", tone: "accent" },
    { title: "Plan", sub: "revoke-plan.sql + rollback-plan.sql + held-for-review" },
    { title: "Sandbox", sub: "Lint + simulated dry run (no network path to the DB)" },
    { title: "STOP", sub: "Human approval required before anything destructive", tone: "stop" },
    { title: "Execute & verify", sub: "Shielded revoker runs approved SQL; reader verifies final state" },
  ];
  return (
    <figure className="rounded-2xl border border-line bg-ink-2 p-5 md:p-7">
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title}>
            <Node
              tone={s.tone}
              title={`${String(i + 1).padStart(2, "0")} · ${s.title}`}
              sub={s.sub}
              icon={s.tone === "stop" ? <Hand className="size-4 text-[#fbbf24]" /> : undefined}
              className="h-full"
            />
          </li>
        ))}
      </ol>
      <figcaption className="mt-5 text-xs leading-relaxed text-muted">
        Flow summarised from the project README. A flag means “investigate”, never “revoke”.
      </figcaption>
    </figure>
  );
}
