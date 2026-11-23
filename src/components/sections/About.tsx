import { GraduationCap, MapPin } from "lucide-react";
import { about } from "@/content/about";
import { profile } from "@/content/profile";
import { ScrollHighlight } from "./ScrollHighlight";

export function About() {
  return (
    <section id="about" data-scene="about" aria-labelledby="about-title" className="relative py-28 md:py-44">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3" data-reveal>
            <h2 id="about-title" className="eyebrow flex items-center gap-3">
              <span className="text-accent">(01)</span>
              <span>About</span>
            </h2>
          </div>
          <div className="md:col-span-9">
            <ScrollHighlight text={about.statement} accentWords={["production-ready"]} />
          </div>
        </div>

        <div className="mt-20 grid gap-12 md:mt-32 md:grid-cols-12 md:gap-6">
          {/* Identity card */}
          <aside className="md:col-span-5 lg:col-span-4" data-reveal>
            <div className="glass relative overflow-hidden rounded-2xl p-6 md:p-7">
              <div
                className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-accent/20 blur-3xl"
                aria-hidden
              />
              <div className="flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.16em] text-subtle">
                <span>Profile</span>
                <span>{profile.initials}</span>
              </div>
              <p className="mt-10 text-3xl font-medium tracking-[-0.04em]">{profile.name}</p>
              <p className="mt-1 text-muted">Software Developer · Product Builder</p>

              <ul className="mt-8 divide-y divide-line border-y border-line text-sm">
                <li className="flex items-start gap-3 py-4">
                  <GraduationCap className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  <div>
                    <span className="sr-only">Education: </span>
                    <p className="text-fg">{profile.education.institution}</p>
                    <p className="text-muted">{profile.education.degree}</p>
                    <p className="mt-1 font-mono text-xs text-subtle">{profile.education.period}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 py-4">
                  <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
                  <span className="sr-only">Location: </span>
                  <span>{profile.location}</span>
                </li>
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-muted">{profile.education.note}</p>
            </div>
          </aside>

          <div className="md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <div className="space-y-5 text-lg leading-relaxed text-muted">
              {about.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={{ ["--d" as string]: i * 90 }} className={i === 0 ? "text-fg" : undefined}>
                  {p}
                </p>
              ))}
            </div>

            <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {about.focus.map((f, i) => (
                <li
                  key={f.title}
                  data-reveal
                  style={{ ["--d" as string]: i * 70 }}
                  className="group relative bg-ink-2 p-6 transition-colors duration-500 hover:bg-surface"
                >
                  <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-6 text-lg font-medium tracking-[-0.02em]">{f.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
                  <span
                    className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2 transition-transform duration-700 group-hover:scale-x-100"
                    aria-hidden
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
