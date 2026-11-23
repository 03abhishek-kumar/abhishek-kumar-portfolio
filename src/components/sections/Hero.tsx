import { ArrowDown, ArrowUpRight, Download, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { LocalTime } from "@/components/ui/LocalTime";
import { Magnetic } from "@/components/ui/Magnetic";
import { RoleTicker } from "./RoleTicker";
import { HeroParallax } from "./HeroParallax";

function Chars({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <span className="char-mask" aria-hidden>
      {text.split("").map((c, i) => (
        <span key={i} className="char" style={{ ["--i" as string]: i + offset }}>
          {c}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const resumeHref = profile.resumeUrl ?? `mailto:${profile.email}?subject=${encodeURIComponent("Resume request")}`;

  return (
    <section
      id="top"
      data-scene="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-x-clip pt-[calc(var(--nav-h)+2rem)]"
    >
      <HeroParallax />

      {/* Meta row */}
      <div className="container-x flex items-start justify-between gap-6">
        <p data-enter style={{ ["--d" as string]: 0 }} className="flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent-3/60" />
            <span className="relative size-2 rounded-full bg-accent-3" />
          </span>
          {profile.currently}
        </p>
        <p data-enter style={{ ["--d" as string]: 80 }} className="hidden font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle sm:block">
          <LocalTime timeZone={profile.timezone} label="BLR" />
        </p>
      </div>

      {/* Name */}
      <div className="container-x mt-auto pt-[18vh] md:mt-0 md:pt-[9vh]">
        <h1
          id="hero-title"
          data-hero-name
          aria-label={`${profile.name}: ${profile.roles.slice(0, 3).join(", ")}`}
          className="select-none font-semibold uppercase leading-[0.82] tracking-[-0.06em] text-white mix-blend-difference"
          style={{ fontSize: "clamp(3.4rem, min(15.2vw, 25svh), 16.5rem)" }}
        >
          <span className="block">
            <Chars text={profile.firstName} />
          </span>
          <span className="block pl-[0.6em] md:pl-[1.5em]">
            <Chars text={profile.lastName} offset={profile.firstName.length} />
          </span>
        </h1>
      </div>

      {/* Lower band */}
      <div className="container-x mt-10 grid gap-10 pb-10 md:mt-auto md:grid-cols-12 md:items-end md:gap-6 md:pb-12">
        <div className="md:col-span-6 lg:col-span-5">
          <div data-enter style={{ ["--d" as string]: 260 }}>
            <RoleTicker roles={profile.roles} />
          </div>
          <p
            data-enter
            style={{ ["--d" as string]: 340 }}
            className="mt-5 text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-[1.08] tracking-[-0.035em] text-balance"
          >
            Building products that solve <span className="font-serif-italic text-[1.08em] text-accent">real problems.</span>
          </p>
          <p data-enter style={{ ["--d" as string]: 420 }} className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-muted">
            {profile.intro}
          </p>
        </div>

        <div className="flex flex-col gap-6 md:col-span-6 md:items-end lg:col-span-7">
          <div data-enter style={{ ["--d" as string]: 500 }} className="flex flex-wrap gap-3 md:justify-end">
            <Magnetic>
              <a href="#work" className="btn btn-primary" data-cursor="Explore">
                View projects
                <ArrowDown className="btn-icon size-4" aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn btn-ghost">
                Let&apos;s connect
                <Mail className="size-4" aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={resumeHref}
                className="btn btn-ghost"
                {...(profile.resumeUrl ? { download: true } : {})}
              >
                {profile.resumeUrl ? "Download resume" : "Request resume"}
                {profile.resumeUrl ? <Download className="size-4" aria-hidden /> : <ArrowUpRight className="btn-icon size-4" aria-hidden />}
              </a>
            </Magnetic>
          </div>

          <div data-enter style={{ ["--d" as string]: 580 }} className="flex w-full items-center justify-between gap-6 border-t border-line pt-5 md:max-w-xl">
            <div className="flex items-center gap-5 text-sm text-muted">
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 transition-colors hover:text-fg">
                <GitHubIcon className="size-4" />
                <span className="link-underline">GitHub</span>
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 transition-colors hover:text-fg">
                <LinkedInIcon className="size-4" />
                <span className="link-underline">LinkedIn</span>
              </a>
            </div>
            <a href="#about" className="group hidden items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-subtle sm:flex">
              Scroll
              <span className="relative block h-8 w-px overflow-hidden bg-line-strong">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-fg" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
