import { process } from "@/content/process";
import { SplitWords, plainText } from "@/components/ui/SplitWords";
import { ProcessMotion } from "./ProcessMotion";

const glyphs = [
  // 01 understand — focusing rings
  <g key="1">
    <circle cx="60" cy="60" r="46" />
    <circle cx="60" cy="60" r="30" strokeDasharray="3 5" />
    <circle cx="60" cy="60" r="12" />
    <path d="M60 4v20M60 96v20M4 60h20M96 60h20" />
  </g>,
  // 02 architecture — connected nodes
  <g key="2">
    <rect x="44" y="8" width="32" height="20" rx="4" />
    <rect x="8" y="88" width="32" height="20" rx="4" />
    <rect x="80" y="88" width="32" height="20" rx="4" />
    <rect x="44" y="50" width="32" height="20" rx="4" />
    <path d="M60 28v22M60 70v8H24v10M60 78h36v10" />
  </g>,
  // 03 build — stacked layers
  <g key="3">
    <path d="M60 14 108 38 60 62 12 38Z" />
    <path d="M12 58l48 24 48-24" />
    <path d="M12 78l48 24 48-24" />
  </g>,
  // 04 test — signal + check
  <g key="4">
    <path d="M6 70h18l8-26 12 50 12-64 12 48 8-8h38" />
    <circle cx="92" cy="30" r="14" />
    <path d="m85 30 5 5 9-10" />
  </g>,
  // 05 deploy — loop
  <g key="5">
    <path d="M30 60a30 30 0 1 1 30 30" />
    <path d="m48 100 12-10-12-10" />
    <path d="M60 46v-24M50 32l10-10 10 10" />
  </g>,
];

export function Process() {
  const title = ["Beyond", { em: "writing code." }] as const;

  return (
    <section
      id="process"
      data-scene="process"
      aria-labelledby="process-title"
      className="relative overflow-hidden py-28 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="container-x lg:pt-[calc(var(--nav-h)+1rem)]">
        <div className="grid gap-6 md:grid-cols-12">
          <p className="eyebrow flex items-center gap-3 md:col-span-3" data-reveal>
            <span className="text-accent">(04)</span>
            <span>Engineering mindset</span>
          </p>
          <div className="md:col-span-9">
            <h2
              id="process-title"
              data-split
              aria-label={plainText([...title])}
              className="text-[clamp(2.6rem,7vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.055em]"
            >
              <SplitWords parts={[...title]} />
            </h2>
            <p data-reveal className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              I think in product lifecycles, not tickets. This is how a feature goes from an idea to something people rely on.
            </p>
          </div>
        </div>
      </div>

      <ol
        id="process-track"
        className="mt-14 flex flex-col gap-4 px-(--gutter) lg:mt-14 lg:w-max lg:flex-row lg:gap-6 lg:pl-[calc(var(--gutter)+25vw)] lg:pr-[var(--gutter)] lg:will-change-transform"
      >
        {process.map((step, i) => (
          <li
            key={step.no}
            data-panel
            data-reveal
            className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white/[0.035] to-white/[0.01] p-6 backdrop-blur-sm md:p-8 lg:h-[min(52vh,30rem)] lg:w-[min(38vw,34rem)]"
          >
            <div className="flex items-start justify-between" data-panel-item>
              <span
                className="text-[clamp(4rem,8vw,7rem)] font-semibold leading-none tracking-[-0.06em] text-transparent"
                style={{ WebkitTextStroke: "1px rgb(255 255 255 / 0.28)" }}
              >
                {step.no}
              </span>
              <svg
                viewBox="0 0 120 120"
                className="size-16 text-accent md:size-20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {glyphs[i]}
              </svg>
            </div>
            <h3 data-panel-item className="mt-8 text-[clamp(1.6rem,2.4vw,2.3rem)] font-medium leading-tight tracking-[-0.035em] lg:mt-auto">
              {step.title}
            </h3>
            <p data-panel-item className="mt-3 max-w-md leading-relaxed text-muted">
              {step.body}
            </p>
            <ul data-panel-item className="mt-6 flex flex-wrap gap-2">
              {step.points.map((pt) => (
                <li key={pt} className="rounded-full border border-line-strong px-3 py-1 font-mono text-[0.68rem] text-muted">
                  {pt}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* Progress */}
      <div className="container-x mt-10 hidden lg:block">
        <div className="relative h-px w-full bg-line">
          <span id="process-bar" className="absolute inset-0 origin-left bg-gradient-to-r from-accent to-accent-2" style={{ transform: "scaleX(0)" }} />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em] text-subtle">
          {process.map((s) => (
            <span key={s.no}>{s.no}</span>
          ))}
        </div>
      </div>
      <ProcessMotion />
    </section>
  );
}
