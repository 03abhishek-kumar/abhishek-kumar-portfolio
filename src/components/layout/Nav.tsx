"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, profile } from "@/content/profile";
import { lockScroll, scrollToTarget, unlockScroll } from "@/lib/motion-store";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 400);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Active section = the nav section crossing the viewport's centre line (or none).
  useEffect(() => {
    const els = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const update = () => {
      const mid = window.innerHeight / 2;
      const hit = els.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      });
      setActive(hit ? hit.id : null);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mobile menu: lock scroll, ESC to close, focus management.
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const first = menuRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const f = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a,button"));
        const a = f[0];
        const b = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      toggleRef.current?.focus();
    };
  }, [open]);

  // Close the menu first (which unlocks scrolling), then travel to the section.
  const navTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      scrollToTarget(target);
      history.replaceState(null, "", `#${id}`);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }, 60);
  };

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[120] -translate-y-24 rounded-full bg-fg px-4 py-2 text-sm font-medium text-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 z-[70] transition-transform duration-700"
        style={{
          transform: hidden && !open ? "translate3d(0,-110%,0)" : "none",
          transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="container-x pt-4">
          <nav
            aria-label="Primary"
            className={`flex h-14 items-center justify-between rounded-full pl-4 pr-2 transition-[background-color,border-color,backdrop-filter] duration-500 ${
              scrolled && !open ? "glass" : "border border-transparent"
            }`}
          >
            <a href="#top" className="group flex items-center gap-3">
              <span
                aria-hidden
                className="relative grid size-8 place-items-center rounded-full border border-line-strong font-mono text-[0.7rem] tracking-wider"
              >
                {profile.initials}
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent-3 shadow-[0_0_10px_2px_rgba(94,234,212,0.5)]" />
              </span>
              <span className="sr-only text-sm font-medium tracking-tight sm:not-sr-only">{profile.name}</span>
              <span className="sr-only">, back to top</span>
            </a>

            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    aria-current={active === l.id ? "true" : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                      active === l.id ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {active === l.id && (
                      <span className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]" aria-hidden />
                    )}
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <a href="#contact" className="btn btn-primary hidden !h-10 !px-4 !text-sm md:inline-flex">
                Let&apos;s talk
                <ArrowUpRight className="btn-icon size-4" aria-hidden />
              </a>
              <button
                ref={toggleRef}
                type="button"
                className="grid size-10 place-items-center rounded-full border border-line-strong md:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="fixed inset-0 z-[65] flex flex-col bg-ink/95 px-[var(--gutter)] pb-10 pt-28 backdrop-blur-xl md:hidden"
      >
        <ul className="flex flex-1 flex-col justify-center gap-2">
          {navLinks.map((l, i) => (
            <li key={l.id} className="overflow-hidden">
              <a
                href={`#${l.id}`}
                onClick={(e) => navTo(e, l.id)}
                className="flex items-baseline gap-4 py-2 text-5xl font-medium tracking-[-0.04em]"
                style={{
                  transform: open ? "none" : "translateY(100%)",
                  transition: `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 60 + 80}ms`,
                }}
              >
                <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-line pt-6 text-sm text-muted">
          <a href={`mailto:${profile.email}`} className="truncate">
            {profile.email}
          </a>
          <div className="flex gap-4 text-lg">
            <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
