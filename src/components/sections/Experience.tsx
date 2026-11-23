import { experience } from "@/content/experience";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollLine } from "@/components/ui/ScrollLine";

export function Experience() {
  return (
    <section id="experience" data-scene="experience" aria-labelledby="experience-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          id="experience-title"
          index="02"
          label="Experience & leadership"
          title={["Owning the product,", { em: "not just" }, "the ticket."]}
          intro="Real product engineering inside a growing platform: architecture, implementation and coordination, end to end."
        />

        <ol className="relative mt-20 md:mt-28">
          {experience.map((item) => (
            <li key={item.organization} className="relative grid gap-10 md:grid-cols-12 md:gap-6">
              {/* Timeline rail */}
              <div className="absolute bottom-0 left-0 top-2 hidden w-px bg-line md:block" aria-hidden>
                <ScrollLine className="h-full w-px" />
              </div>
              <span
                className="absolute left-0 top-2 hidden size-3 -translate-x-1/2 rounded-full border border-accent bg-ink shadow-[0_0_0_6px_rgba(124,140,255,0.12),0_0_24px_rgba(124,140,255,0.6)] md:block"
                aria-hidden
              />

              {/* Sticky identity */}
              <div className="md:col-span-4 md:pl-10">
                <div className="md:sticky md:top-28" data-reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">{item.period}</p>
                  <h3 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.035em] md:text-4xl">{item.role}</h3>
                  <p className="mt-3 text-lg text-fg/90">{item.organization}</p>
                  {item.orgNote && <p className="mt-1 text-sm text-muted">{item.orgNote}</p>}
                  <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
                    {item.stack.map((s) => (
                      <li key={s} className="rounded-full border border-line-strong px-3 py-1 font-mono text-[0.7rem] text-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:col-span-8">
                <p data-reveal className="text-xl leading-relaxed tracking-[-0.01em] text-fg md:text-2xl">
                  {item.summary}
                </p>

                {/* Product surface map */}
                <div className="mt-14" data-reveal>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="eyebrow">Product surface</p>
                    <p className="font-mono text-xs text-subtle">{item.areas.length} areas</p>
                  </div>
                  <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                    {item.areas.map((a, i) => (
                      <li
                        key={a}
                        className="group relative flex min-h-28 flex-col justify-between bg-ink-2 p-4 transition-colors duration-500 hover:bg-surface md:min-h-32 md:p-5"
                      >
                        <span className="flex items-center justify-between font-mono text-[0.65rem] text-subtle">
                          <span>M{String(i + 1).padStart(2, "0")}</span>
                          <span className="size-1.5 rounded-full bg-line-strong transition-colors duration-500 group-hover:bg-accent-3" aria-hidden />
                        </span>
                        <span className="text-[0.95rem] font-medium leading-snug tracking-[-0.01em]">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Responsibilities */}
                <div className="mt-14">
                  <p className="eyebrow mb-2" data-reveal>
                    What I own
                  </p>
                  <ul>
                    {item.responsibilities.map((r, i) => (
                      <li
                        key={i}
                        data-reveal
                        style={{ ["--d" as string]: i * 60 }}
                        className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-5 text-[1.02rem] leading-relaxed text-muted"
                      >
                        <span className="font-mono text-xs leading-7 text-subtle">{String(i + 1).padStart(2, "0")}</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
