"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Menu,
  Search,
  Sparkles,
  User,
  Wand2,
  X,
} from "lucide-react";
import type { GenreShelf } from "@/lib/bookService";
import UserMenu from "@/components/UserMenu";

type AuthUser = {
  email: string;
} | null;

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { label: "Discover", href: "/" },
  { label: "Library", href: "/library" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Community", href: "/community" },
];

const GENRE_TAGS: string[] = ["Sci-Fi", "Fantasy", "Romance", "Mystery", "Biography"];

type FeatureCard = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: Sparkles,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
    title: "Describe the Mood",
    description:
      "Tell Lumina how you want a book to feel. It turns a mood, a pace, even a single scene, into a shortlist that matches.",
  },
  {
    icon: Wand2,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Taste Calibration",
    description:
      "Every rating and reread sharpens your Style Fingerprint, so each new recommendation lands a little closer to right.",
  },
  {
    icon: BookOpen,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-500",
    title: "Living Synopsis",
    description:
      "Skip the back-cover blurb. Get a preview written for exactly how much of the story you already know.",
  },
];

function isRecentlyAdded(createdAt?: string): boolean {
  if (!createdAt) return false;
  const addedAt = new Date(createdAt).getTime();
  if (Number.isNaN(addedAt)) return false;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - addedAt < sevenDaysMs;
}

type HomeClientProps = {
  shelves: GenreShelf[];
  user?: AuthUser;
};

export default function HomeClient({ shelves = [], user = null }: HomeClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 38 });
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  function handleHeroMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (prefersReducedMotion.current) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Searching Lumina for:", searchQuery || "(empty query)");
  }

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-slate-900 antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm">
              <BookOpen className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Lumina<span className="font-medium text-slate-500">Books</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm ${
                  link.label === "Discover"
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <UserMenu email={user.email} />
            ) : (
              <Link
                href="/sign-in"
                className="hidden items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:inline-flex"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/60 text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-200/50 bg-white/95 px-4 pb-5 pt-3 backdrop-blur-md md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    link.label === "Discover"
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="relative isolate overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-24 h-[26rem] w-[26rem] rounded-full bg-amber-300/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-40 h-[22rem] w-[22rem] rounded-full bg-orange-300/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-200/30 blur-3xl transition-[left,top] duration-700 ease-out"
          style={{ left: `${glow.x}%`, top: `${glow.y}%` }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl md:leading-[1.05]">
            Discover Your Next{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Literary Masterpiece
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base text-slate-500 sm:text-lg">
            Lumina reads the mood, pace, and prose style you&apos;re chasing, then
            matches it against a living map of stories to surface the one
            you didn&apos;t know you were looking for.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-full border border-slate-200/60 bg-white p-2 pl-5 shadow-sm transition-shadow focus-within:shadow-md"
          >
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Describe a mood, an author, or a feeling..."
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
            />
            <button
              type="submit"
              aria-label="Search"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:px-6"
            >
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mx-auto mt-7 flex max-w-xl flex-wrap items-center justify-center gap-2.5">
            {GENRE_TAGS.map((genre) => {
              const isActive = activeGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setActiveGenre(isActive ? null : genre)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 sm:text-sm ${
                    isActive
                      ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                      : "border-slate-200 bg-white/70 text-slate-500 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Curated Discovery
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Let AI Paint Your Next Story
            </h2>
            <p className="mt-3 text-base text-slate-500">
              Three ways Lumina turns a vague craving for &ldquo;something
              good&rdquo; into your next favorite book.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CARDS.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200/60 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${feature.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${feature.iconColor}`} strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                The Gallery
              </h2>
              <p className="mt-2 text-base text-slate-500">
                Recommended by genre, drawn from what&apos;s already in your library.
              </p>
            </div>
            <Link
              href="/library"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-orange-300 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {shelves.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <BookOpen className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No genre shelves yet
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                A shelf appears once at least two saved books share a genre.
                Search for a few titles to get your first one going.
              </p>
              <Link
                href="/search"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Go to Search
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex flex-col gap-12">
              {shelves.map((shelf) => (
                <div key={shelf.genre}>
                  <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {shelf.genre}
                  </h3>
                  <div className="mt-4 flex gap-4 overflow-x-auto pb-3 sm:gap-5">
                    {shelf.books.map((book) => (
                      <article
                        key={book.id}
                        className="group w-36 shrink-0 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-44"
                      >
                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
                          {book.cover_url ? (
                            <Image
                              src={book.cover_url}
                              alt={`Cover of ${book.title} by ${book.author}`}
                              fill
                              sizes="176px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <BookOpen className="h-10 w-10" />
                            </div>
                          )}

                          {isRecentlyAdded(book.created_at) && (
                            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600 shadow-sm backdrop-blur-sm">
                              New
                            </span>
                          )}

                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition-all duration-300 group-hover:bg-slate-900/10 group-hover:opacity-100">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-sm backdrop-blur-md">
                              <BookOpen className="h-5 w-5" />
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 sm:p-4">
                          <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 sm:text-base">
                            {book.title}
                          </h3>
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 sm:text-sm">
                            {book.author}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
    </div>
  );
}