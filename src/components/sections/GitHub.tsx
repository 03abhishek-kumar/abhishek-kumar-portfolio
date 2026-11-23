import { ArrowUpRight, GitFork, Star } from "lucide-react";
import type { ContributionDay, GitHubData } from "@/lib/github";
import { profile } from "@/content/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GitHubIcon } from "@/components/ui/icons";
import { esc } from "@/lib/svg";

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#4b8bbe",
  CSS: "#8f6ad9",
  HTML: "#e34c26",
  Shell: "#89e051",
};
const langColor = (l: string | null) => (l && LANG_COLORS[l]) || "#7b7b87";

const LEVEL_BG = [
  "rgb(255 255 255 / 0.045)",
  "rgb(124 140 255 / 0.3)",
  "rgb(124 140 255 / 0.5)",
  "rgb(140 150 255 / 0.75)",
  "rgb(167 139 250 / 1)",
];

const monthFmt = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const dayFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function toWeeks(days: ContributionDay[]) {
  if (days.length === 0) return [];
  const first = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const padded: (ContributionDay | null)[] = [...Array(first).fill(null), ...days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

/**
 * The calendar is emitted as a static SVG string: one opaque node for React
 * instead of ~370 elements to hydrate. Native <title>s give per-day tooltips.
 */
function heatmapSvg(weeks: (ContributionDay | null)[][]) {
  const cell = 11;
  const gap = 3;
  const step = cell + gap;
  const w = weeks.length * step - gap;
  const h = 7 * step - gap;
  let rects = "";
  weeks.forEach((week, wi) => {
    week.forEach((d, di) => {
      if (!d) return;
      const label = `${d.count} contribution${d.count === 1 ? "" : "s"} on ${dayFmt.format(new Date(`${d.date}T00:00:00Z`))}`;
      rects += `<rect x="${wi * step}" y="${di * step}" width="${cell}" height="${cell}" rx="2.5" fill="${LEVEL_BG[d.level]}"><title>${esc(label)}</title></rect>`;
    });
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block" role="img" aria-label="Daily contribution calendar">${rects}</svg>`;
}

function Heatmap({ data }: { data: NonNullable<GitHubData["contributions"]> }) {
  const weeks = toWeeks(data.days);
  const months: { label: string; col: number }[] = [];
  weeks.forEach((w, col) => {
    const d = w.find(Boolean);
    if (!d) return;
    const date = new Date(`${d.date}T00:00:00Z`);
    if (date.getUTCDate() <= 7) months.push({ label: monthFmt.format(date), col });
  });

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-ink-2 p-5 md:p-7" data-reveal>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-lg tracking-[-0.02em]">
          <span className="font-medium text-fg">{data.total.toLocaleString("en-IN")}</span>{" "}
          <span className="text-muted">contributions in the last year</span>
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[0.65rem] text-subtle">
          Less
          {LEVEL_BG.map((bg, i) => (
            <span key={i} className="size-2.5 rounded-[3px]" style={{ background: bg }} />
          ))}
          More
        </span>
      </figcaption>
      <div className="-mx-5 mt-6 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0" tabIndex={0} aria-label="Contribution calendar, scrollable">
        {/* Fluid on wide screens, fixed minimum (scrolls within the card) on small ones. */}
        <div className="relative min-w-[44rem]">
          <div className="relative mb-2 h-4 font-mono text-[0.62rem] text-subtle">
            {months.map((m) => (
              <span key={`${m.label}-${m.col}`} className="absolute" style={{ left: `${(m.col / weeks.length) * 100}%` }}>
                {m.label}
              </span>
            ))}
          </div>
          <div className="heatmap" dangerouslySetInnerHTML={{ __html: heatmapSvg(weeks) }} />
        </div>
      </div>
    </figure>
  );
}

export function GitHub({ data }: { data: GitHubData }) {
  const repos = data.repos.slice(0, 6);
  const topLangs = data.languages.slice(0, 6);

  return (
    <section id="github" data-scene="github" aria-labelledby="github-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeader
          id="github-title"
          index="07"
          label="Open source & activity"
          title={["Building", { em: "in public."}]}
          intro="Live from the GitHub API and refreshed hourly. The numbers here are whatever GitHub reports."
        />

        <div className="mt-16 space-y-4 md:mt-24">
          {data.contributions && <Heatmap data={data.contributions} />}

          <div className="grid gap-4 lg:grid-cols-12">
            {/* Languages + stats */}
            <div className="flex flex-col rounded-2xl border border-line bg-ink-2 p-5 md:p-7 lg:col-span-5" data-reveal>
              <p className="eyebrow">Language distribution</p>
              {topLangs.length > 0 ? (
                <>
                  <div className="mt-6 flex h-2.5 w-full overflow-hidden rounded-full bg-white/5" role="img" aria-label={topLangs.map((l) => `${l.name} ${(l.share * 100).toFixed(1)}%`).join(", ")}>
                    {topLangs.map((l) => (
                      <span key={l.name} style={{ width: `${l.share * 100}%`, background: langColor(l.name) }} />
                    ))}
                  </div>
                  <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
                    {topLangs.map((l) => (
                      <li key={l.name} className="flex items-center gap-2.5 text-sm">
                        <span className="size-2 shrink-0 rounded-full" style={{ background: langColor(l.name) }} aria-hidden />
                        <span className="text-fg/90">{l.name}</span>
                        <span className="ml-auto font-mono text-xs tabular-nums text-subtle">{(l.share * 100).toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-subtle">By bytes of code across my original public repositories.</p>
                </>
              ) : (
                <p className="mt-6 text-sm text-muted">Language data is unavailable right now.</p>
              )}

              {data.profile && (
                <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-line pt-6 max-lg:mt-8">
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-subtle">Public repos</dt>
                    <dd className="mt-1 text-3xl font-medium tracking-[-0.04em]">{data.profile.publicRepos}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-subtle">Followers</dt>
                    <dd className="mt-1 text-3xl font-medium tracking-[-0.04em]">{data.profile.followers}</dd>
                  </div>
                </dl>
              )}

              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="btn btn-ghost mt-6 w-full justify-center">
                <GitHubIcon className="size-4" />
                github.com/{data.username}
                <ArrowUpRight className="btn-icon size-4" aria-hidden />
              </a>
            </div>

            {/* Repositories */}
            <div className="lg:col-span-7">
              {repos.length > 0 ? (
                <ul className="grid h-full gap-4 sm:grid-cols-2">
                  {repos.map((r, i) => (
                    <li key={r.name} data-reveal style={{ ["--d" as string]: i * 60 }}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex h-full flex-col rounded-2xl border border-line bg-ink-2 p-5 transition-colors duration-500 hover:border-line-strong hover:bg-surface"
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-medium tracking-[-0.015em] text-fg">{r.name}</span>
                          <ArrowUpRight className="size-4 shrink-0 text-subtle transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
                        </span>
                        <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                          {r.description ?? "No description provided."}
                        </span>
                        <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 font-mono text-[0.68rem] text-subtle">
                          {r.language && (
                            <span className="flex items-center gap-1.5">
                              <span className="size-2 rounded-full" style={{ background: langColor(r.language) }} aria-hidden />
                              {r.language}
                            </span>
                          )}
                          {r.fork && <span>fork</span>}
                          <span className="flex items-center gap-1" aria-label={`${r.stars} stars`}>
                            <Star className="size-3" aria-hidden />
                            {r.stars}
                          </span>
                          <span className="flex items-center gap-1" aria-label={`${r.forks} forks`}>
                            <GitFork className="size-3" aria-hidden />
                            {r.forks}
                          </span>
                          <span className="ml-auto">Updated {monthFmt.format(new Date(r.pushedAt))} {new Date(r.pushedAt).getUTCFullYear()}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid h-full place-items-center rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
                  Repositories couldn&apos;t be loaded right now. Browse them directly on GitHub.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
