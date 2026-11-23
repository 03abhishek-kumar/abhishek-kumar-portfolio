import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-6 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 text-[clamp(3rem,10vw,8rem)] font-medium leading-none tracking-[-0.06em]">
          Lost in <span className="font-serif-italic text-accent">orbit.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-muted">This page doesn&apos;t exist, but the rest of the portfolio does.</p>
        <Link href="/" className="btn btn-primary mt-10">
          <ArrowLeft className="size-4" aria-hidden />
          Back home
        </Link>
      </div>
    </main>
  );
}
