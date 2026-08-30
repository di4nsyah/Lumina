import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";
import TornEdge from "@/components/decor/TornEdge";

export default function SiteFooter() {
  return (
    <footer className="relative mt-auto">
      <TornEdge position="bottom" flip />
      <div className="border-t border-hairline bg-surface px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <Wordmark />
            <p className="mt-1.5 text-xs text-muted-ink">
              A neighborhood bookshop on the web.
            </p>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-ink transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-ink transition-colors hover:text-ink">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-muted-ink transition-colors hover:text-ink">
              Contact
            </Link>
          </nav>

          <p className="text-xs text-muted-ink/70">
            © {new Date().getFullYear()} LuminaBooks
          </p>
        </div>
      </div>
    </footer>
  );
}
