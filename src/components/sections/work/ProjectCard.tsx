import { ArrowUpRight, Plus } from "lucide-react";
import type { Project } from "@/content/projects";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { GitHubIcon } from "@/components/ui/icons";

/**
 * Server-rendered card. Clicks on `[data-open-case]` are handled by the
 * client-side WorkController via event delegation, so none of this markup
 * (including the illustrated visual) needs to hydrate.
 */
export function ProjectCard({ project, total }: { project: Project; total: number }) {
  const p = project;
  return (
    <article
      aria-labelledby={`project-${p.id}-title`}
      className="project-card grid gap-6 p-4 md:h-[min(80vh,46rem)] md:grid-cols-12 md:gap-8 md:p-6 lg:p-8"
      style={{ ["--accent" as string]: p.accent }}
      data-card-inner
    >
      {/* Info */}
      <div className="order-2 flex flex-col md:order-1 md:col-span-5">
        <div className="flex items-center justify-between font-mono text-xs text-subtle">
          <span>
            <span className="text-fg">{p.index}</span> / {String(total).padStart(2, "0")}
          </span>
          <span className="flex items-center gap-3">
            {p.flagship && (
              <span className="rounded-full border px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.14em]" style={{ borderColor: `${p.accent}66`, color: p.accent }}>
                Flagship
              </span>
            )}
            {p.year}
          </span>
        </div>

        <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] md:mt-10" style={{ color: p.accent }}>
          {p.categories.join(" · ")}
        </p>
        <h3 id={`project-${p.id}-title`} className="mt-3 text-[clamp(2.2rem,4.6vw,4.2rem)] font-medium leading-[0.95] tracking-[-0.05em]">
          {p.title}
        </h3>
        <p className="mt-4 text-lg leading-snug tracking-[-0.01em] text-fg/90">{p.tagline}</p>
        <p className="mt-4 line-clamp-4 text-[0.95rem] leading-relaxed text-muted">{p.summary}</p>

        <ul className="mt-6 hidden flex-wrap gap-1.5 md:flex" aria-label="Stack">
          {p.stack.slice(0, 6).map((s) => (
            <li key={s} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.68rem] text-muted">
              {s}
            </li>
          ))}
        </ul>

        <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-line pt-5 max-md:mt-8">
          {p.highlights.map((h) => (
            <div key={h.label}>
              <dt className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-subtle">{h.label}</dt>
              <dd className="mt-1.5 text-[0.82rem] leading-snug text-fg/90">{h.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-primary h-11!" data-open-case={p.id} data-cursor="Open">
            Read case study
            <Plus className="btn-icon size-4" aria-hidden />
          </button>
          {p.links.live && (
            <a href={p.links.live} target="_blank" rel="noreferrer" className="btn btn-ghost h-11!">
              Live
              <ArrowUpRight className="btn-icon size-4" aria-hidden />
              <span className="sr-only">(opens {p.title} live demo in a new tab)</span>
            </a>
          )}
          {p.links.github && (
            <a href={p.links.github} target="_blank" rel="noreferrer" className="btn btn-ghost h-11! px-4!" aria-label={`${p.title} on GitHub`}>
              <GitHubIcon className="size-4" />
            </a>
          )}
        </div>
      </div>

      {/* Visual: a pointer shortcut to the case study. Keyboard and screen-reader
          users get the equivalent "Read case study" button above. */}
      <div
        data-open-case={p.id}
        data-cursor="View"
        aria-hidden
        className="visual-frame order-1 aspect-[16/11] w-full cursor-pointer md:order-2 md:col-span-7 md:aspect-auto md:h-full"
      >
        <ProjectVisual kind={p.visual} />
      </div>
    </article>
  );
}
