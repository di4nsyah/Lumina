import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";
import Squiggle from "@/components/decor/Squiggle";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center text-ink antialiased">
      <Wordmark />

      <div className="relative mt-12 w-full max-w-md border border-dashed border-hairline bg-surface px-8 py-14 shadow-sm">
        <span
          aria-hidden="true"
          className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper"
        />
        <span
          aria-hidden="true"
          className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper"
        />
        <p className="font-display text-7xl font-semibold text-accent/70">404</p>
        <h1 className="mt-3 font-display text-xl font-semibold text-ink">
          This bookmark fell out.
        </h1>
        <Squiggle className="mx-auto mt-3" />
        <p className="mt-4 text-sm leading-relaxed text-muted-ink">
          The page you were looking for isn&apos;t in this section. Try the
          front table instead.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-md bg-ink px-6 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Back to Discover
        </Link>
      </div>
    </div>
  );
}
