"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Info, X } from "lucide-react";
import type { Project } from "@/content/projects";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { Diagram } from "@/components/visuals/Diagrams";
import { GitHubIcon } from "@/components/ui/icons";
import { lockScroll, unlockScroll } from "@/lib/motion-store";

export function CaseStudy({
  project,
  next,
  onClose,
  onNext,
}: {
  project: Project | null;
  next: Project | null;
  onClose: () => void;
  onNext: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"open" | "closed">("closed");
  const closing = useRef(false);

  // Open when a project is selected.
  useEffect(() => {
    const d = ref.current;
    if (!d || !project) return;
    if (!d.open) {
      d.showModal();
      lockScroll();
      requestAnimationFrame(() => setState("open"));
    }
    scroller.current?.scrollTo({ top: 0 });
  }, [project]);

  const close = useCallback(() => {
    const d = ref.current;
    if (!d || closing.current) return;
    closing.current = true;
    setState("closed");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        d.close();
        unlockScroll();
        closing.current = false;
        onClose();
      },
      reduced ? 0 : 420,
    );
  }, [onClose]);

  // ESC → animated close instead of the instant native one.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [close]);

  const p = project;

  return (
    <dialog
      ref={ref}
      className="case-study"
      data-state={state}
      aria-labelledby={p ? `cs-${p.id}-title` : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {p && (
        <div
          className="sheet absolute inset-x-0 bottom-0 top-[3vh] mx-auto flex max-w-6xl flex-col overflow-hidden rounded-t-[1.5rem] border border-b-0 border-line-strong bg-[#09090d] md:top-[4vh]"
          style={{ ["--accent" as string]: p.accent }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 md:px-8">
            <p className="truncate font-mono text-xs uppercase tracking-[0.14em] text-subtle">
              <span style={{ color: p.accent }}>{p.index}</span> · Case study · {p.title}
            </p>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong transition-colors hover:bg-white/5"
              aria-label="Close case study"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div ref={scroller} className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
            <div className="px-5 pb-20 pt-10 md:px-12 md:pt-14">
              {/* Title */}
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em]" style={{ color: p.accent }}>
                {p.categories.join(" · ")}
              </p>
              <h2 id={`cs-${p.id}-title`} className="mt-4 text-[clamp(2.6rem,7vw,6rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                {p.title}
              </h2>
              <p className="mt-5 max-w-3xl text-xl leading-snug tracking-[-0.015em] text-fg/90 md:text-2xl">{p.tagline}</p>

              {/* Meta */}
              <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-4">
                <div>
                  <dt className="eyebrow">Role</dt>
                  <dd className="mt-2 text-sm">{p.role}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Timeline</dt>
                  <dd className="mt-2 text-sm">{p.year}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="eyebrow">Links</dt>
                  <dd className="mt-2 flex flex-wrap gap-4 text-sm">
                    {p.links.live && (
                      <a href={p.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-fg hover:text-accent">
                        Live demo <ArrowUpRight className="size-3.5" aria-hidden />
                      </a>
                    )}
                    {p.links.github && (
                      <a href={p.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-fg hover:text-accent">
                        <GitHubIcon className="size-3.5" /> Repository <ArrowUpRight className="size-3.5" aria-hidden />
                      </a>
                    )}
                    {!p.links.live && !p.links.github && <span className="text-muted">Private codebase</span>}
                  </dd>
                </div>
              </dl>

              {/* Visual */}
              <div className="project-card mt-10 overflow-hidden p-2" style={{ ["--accent" as string]: p.accent }}>
                <div className="visual-frame relative aspect-[16/10] md:aspect-[21/9]">
                  <ProjectVisual kind={p.visual} />
                </div>
              </div>

              {/* Problem + summary */}
              <div className="mt-16 grid gap-10 md:grid-cols-12">
                <h3 className="eyebrow md:col-span-3">The problem</h3>
                <div className="md:col-span-9">
                  <p className="text-xl leading-relaxed tracking-[-0.01em] text-fg md:text-2xl">{p.problem}</p>
                  <p className="mt-6 text-lg leading-relaxed text-muted">{p.summary}</p>
                </div>
              </div>

              {/* Built */}
              <div className="mt-16 grid gap-10 md:grid-cols-12">
                <h3 className="eyebrow md:col-span-3">What I built</h3>
                <ul className="md:col-span-9">
                  {p.built.map((b, i) => (
                    <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-line py-4 leading-relaxed text-fg/90">
                      <span className="font-mono text-xs leading-7 text-subtle">{String(i + 1).padStart(2, "0")}</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Challenges */}
              <div className="mt-16 grid gap-10 md:grid-cols-12">
                <h3 className="eyebrow md:col-span-3">Technical challenges</h3>
                <div className="grid gap-3 md:col-span-9 md:grid-cols-2">
                  {p.challenges.map((c) => (
                    <div key={c.title} className="rounded-2xl border border-line bg-white/[0.02] p-6">
                      <p className="text-lg font-medium tracking-[-0.02em]">{c.title}</p>
                      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{c.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture */}
              {p.diagram && (
                <div className="mt-16 grid gap-10 md:grid-cols-12">
                  <h3 className="eyebrow md:col-span-3">Architecture</h3>
                  <div className="md:col-span-9">
                    <Diagram kind={p.diagram} />
                  </div>
                </div>
              )}

              {/* Stack */}
              <div className="mt-16 grid gap-10 md:grid-cols-12">
                <h3 className="eyebrow md:col-span-3">Stack</h3>
                <ul className="flex flex-wrap gap-2 md:col-span-9">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg/90">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {p.note && (
                <p className="mt-12 flex items-start gap-3 rounded-xl border border-line bg-white/[0.02] p-4 text-sm leading-relaxed text-muted md:ml-[25%]">
                  <Info className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden />
                  {p.note}
                </p>
              )}

              {next && (
                <button
                  type="button"
                  onClick={onNext}
                  className="group mt-20 flex w-full items-end justify-between gap-6 border-t border-line pt-8 text-left"
                >
                  <span>
                    <span className="eyebrow">Next case study</span>
                    <span className="mt-3 block text-[clamp(2rem,5vw,4rem)] font-medium leading-none tracking-[-0.05em] transition-colors group-hover:text-accent">
                      {next.title}
                    </span>
                  </span>
                  <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line-strong transition-transform duration-500 group-hover:translate-x-1">
                    <ArrowRight className="size-5" aria-hidden />
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
