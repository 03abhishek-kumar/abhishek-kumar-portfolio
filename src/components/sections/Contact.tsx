"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { SplitWords, plainText, type SplitPart } from "@/components/ui/SplitWords";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/Magnetic";

const headline: SplitPart[] = ["Have an interesting idea?", "Let's build something", { em: "meaningful." }];

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: <Mail className="size-4" aria-hidden />, external: false },
    { label: "LinkedIn", value: "in/03abhishek-kumar", href: profile.socials.linkedin, icon: <LinkedInIcon className="size-4" />, external: true },
    { label: "GitHub", value: `@${profile.githubUsername}`, href: profile.socials.github, icon: <GitHubIcon className="size-4" />, external: true },
  ];

  return (
    <section
      id="contact"
      data-scene="contact"
      aria-labelledby="contact-title"
      className="relative flex min-h-svh flex-col justify-center py-28 md:py-40"
    >
      <div className="container-x">
        <p className="eyebrow flex items-center gap-3" data-reveal>
          <span className="text-accent">(08)</span>
          <span>Contact</span>
        </p>

        <h2
          id="contact-title"
          data-split
          aria-label={plainText(headline)}
          className="mt-8 max-w-[14ch] text-[clamp(2.8rem,8.4vw,8.5rem)] font-medium leading-[0.92] tracking-[-0.058em]"
        >
          <SplitWords parts={headline} />
        </h2>

        <div className="mt-14 flex flex-col gap-6 md:mt-20 md:flex-row md:items-center" data-reveal>
          <Magnetic strength={0.18}>
            <a href={`mailto:${profile.email}`} className="btn btn-primary h-14! px-7! text-base!" data-cursor="Say hi">
              Start a conversation
              <ArrowUpRight className="btn-icon size-5" aria-hidden />
            </a>
          </Magnetic>
          <button
            type="button"
            onClick={copy}
            className="group inline-flex items-center gap-3 self-start text-left text-muted transition-colors hover:text-fg md:self-auto"
          >
            <span className="font-mono text-sm md:text-base">{profile.email}</span>
            <span className="grid size-9 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-fg/40">
              {copied ? <Check className="size-4 text-accent-3" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            </span>
            <span className="sr-only">{copied ? "Email copied" : "Copy email address"}</span>
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Email address copied to clipboard" : ""}
          </span>
        </div>

        <ul className="mt-20 grid border-t border-line md:mt-28 md:grid-cols-3">
          {links.map((l, i) => (
            <li key={l.label} data-reveal style={{ ["--d" as string]: i * 80 }} className="border-b border-line md:border-b-0 md:border-r md:last:border-r-0">
              <a
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex items-center justify-between gap-4 py-6 transition-colors md:px-6 md:first:pl-0"
              >
                <span>
                  <span className="eyebrow flex items-center gap-2">
                    {l.icon}
                    {l.label}
                  </span>
                  <span className="mt-2 block truncate text-lg tracking-[-0.02em] text-fg transition-colors group-hover:text-accent">
                    {l.value}
                  </span>
                </span>
                <ArrowUpRight
                  className="size-5 shrink-0 text-subtle transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fg"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
