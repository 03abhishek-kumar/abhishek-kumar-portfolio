import { Award } from "lucide-react";
import { milestones, type Milestone } from "@/content/milestones";
import { SectionHeader } from "@/components/ui/SectionHeader";

const kindLabel: Record<Milestone["kind"], string> = {
  recognition: "Recognition",
  ownership: "Ownership",
  engineering: "Engineering",
  practice: "Practice",
};

export function Milestones() {
  return (
    <section id="milestones" data-scene="milestones" aria-labelledby="milestones-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          id="milestones-title"
          index="06"
          label="Milestones"
          title={["Milestones", { em: "&" }, "recognition."]}
          intro="One formal recognition, plus the ownership and engineering milestones that shaped how I build."
        />

        <ol className="mt-16 border-t border-line md:mt-24">
          {milestones.map((m, i) => {
            const isAward = m.kind === "recognition";
            return (
              <li
                key={m.title}
                data-reveal
                style={{ ["--d" as string]: i * 50 }}
                className="group relative grid gap-3 border-b border-line py-7 md:grid-cols-12 md:items-baseline md:gap-6 md:py-9"
              >
                <span
                  className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-white/[0.035] to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
                  aria-hidden
                />
                <span className="relative font-mono text-xs text-subtle md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative md:col-span-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${
                      isAward ? "border-[#fbbf24]/50 text-[#fcd34d]" : "border-line-strong text-muted"
                    }`}
                  >
                    {isAward && <Award className="size-3" aria-hidden />}
                    {kindLabel[m.kind]}
                  </span>
                </span>
                <h3
                  className={`relative text-[clamp(1.35rem,2.4vw,2.1rem)] font-medium leading-tight tracking-[-0.035em] md:col-span-5 ${
                    isAward ? "text-fg" : "text-fg/90"
                  }`}
                >
                  {m.title}
                </h3>
                <p className="relative leading-relaxed text-muted md:col-span-3">{m.detail}</p>
                <span className="relative font-mono text-xs text-subtle md:col-span-1 md:text-right">{m.when ?? ""}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
