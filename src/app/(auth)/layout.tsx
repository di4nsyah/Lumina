import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FBFBF9] px-4 py-12 text-slate-900 antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-24 h-[26rem] w-[26rem] rounded-full bg-amber-300/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-[22rem] w-[22rem] rounded-full bg-orange-300/25 blur-3xl"
      />

      <Link
        href="/"
        className="relative z-10 mb-8 flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-full"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm">
          <BookOpen className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          Lumina<span className="font-medium text-slate-500">Books</span>
        </span>
      </Link>

      <main className="relative z-10 w-full max-w-md">{children}</main>
    </div>
  );
}
