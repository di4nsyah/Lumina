import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-slate-200/60 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
            <BookOpen className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-900">
            Lumina<span className="font-medium text-slate-500">Books</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/privacy" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
            Terms
          </Link>
          <Link href="/contact" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
            Contact
          </Link>
        </nav>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} LuminaBooks. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
