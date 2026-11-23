const items = [
  "Full-stack engineering",
  "AI-powered systems",
  "Product ownership",
  "System architecture",
  "Backend & data",
  "Shipping to production",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-6 text-[clamp(1.5rem,3.4vw,3rem)] font-medium tracking-[-0.04em] text-fg/90 md:px-10">{t}</span>
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-accent md:size-6" aria-hidden>
            <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-line bg-ink/60 py-6 backdrop-blur-sm md:py-8">
      <p className="sr-only">{items.join(", ")}</p>
      <div className="marquee-track">
        <Row />
        <Row />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" aria-hidden />
    </div>
  );
}
