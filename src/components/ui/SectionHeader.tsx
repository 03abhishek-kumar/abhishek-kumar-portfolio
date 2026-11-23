import { SplitWords, plainText, type SplitPart } from "./SplitWords";

export function SectionHeader({
  index,
  label,
  title,
  intro,
  id,
  className = "",
}: {
  index: string;
  label: string;
  title: SplitPart[];
  intro?: string;
  id?: string;
  className?: string;
}) {
  return (
    <header className={`grid gap-8 md:grid-cols-12 ${className}`}>
      <div className="md:col-span-3" data-reveal>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">({index})</span>
          <span>{label}</span>
        </p>
      </div>
      <div className="md:col-span-9">
        <h2
          id={id}
          data-split
          aria-label={plainText(title)}
          className="text-[clamp(2.25rem,5.6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.045em] text-balance"
        >
          <SplitWords parts={title} />
        </h2>
        {intro && (
          <p data-reveal style={{ ["--d" as string]: 200 }} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
