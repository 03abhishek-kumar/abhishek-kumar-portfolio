import { ArrowUp } from "lucide-react";
import { profile } from "@/content/profile";
import { LocalTime } from "@/components/ui/LocalTime";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line">
      <div className="container-x flex flex-col gap-6 py-10 text-sm text-subtle md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {profile.name}. Designed &amp; engineered by hand.
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.14em]">
          <LocalTime timeZone={profile.timezone} label="Bengaluru" />
        </p>
        <a href="#top" className="group inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
          Back to top
          <span className="grid size-8 place-items-center rounded-full border border-line-strong transition-transform duration-500 group-hover:-translate-y-1">
            <ArrowUp className="size-3.5" aria-hidden />
          </span>
        </a>
      </div>
    </footer>
  );
}
