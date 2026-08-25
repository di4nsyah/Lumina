"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import type {
  CachedBook,
  GenreShelf,
  RecommendationResult,
} from "@/lib/bookService";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SectionHeading from "@/components/ui/SectionHeading";
import StampBadge from "@/components/ui/StampBadge";
import Reveal from "@/components/decor/Reveal";
import TapeStrip from "@/components/decor/TapeStrip";
import TornEdge from "@/components/decor/TornEdge";
import Squiggle from "@/components/decor/Squiggle";

type AuthUser = {
  email: string;
} | null;

const GENRE_TAGS: string[] = [
  "Sci-Fi",
  "Fantasy",
  "Romance",
  "Mystery",
  "Biography",
];

function BookCover({ book }: { book: CachedBook }) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-hairline bg-surface">
      {book.cover_url ? (
        <Image
          src={book.cover_url}
          alt={`Cover of ${book.title} by ${book.author}`}
          fill
          sizes="(max-width: 640px) 45vw, 176px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-hairline">
          <BookOpen className="h-10 w-10" />
        </div>
      )}
    </div>
  );
}

function BookCard({ book }: { book: CachedBook }) {
  return (
    <article className="w-36 shrink-0 sm:w-44">
      <Link href={`/book/${book.id}`} className="group block focus-visible:outline-none">
        <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
          <BookCover book={book} />
        </div>
        <h3 className="mt-2.5 line-clamp-1 font-display text-sm font-semibold text-ink sm:text-base">
          {book.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-ink sm:text-sm">
          {book.author}
        </p>
      </Link>
    </article>
  );
}

function ShelfRow({
  children,
  stagger = true,
}: {
  children: React.ReactNode[];
  stagger?: boolean;
}) {
  return (
    <div className="mt-6 flex gap-5 overflow-x-auto border-b border-hairline pb-4">
      {children.map((child, index) =>
        stagger ? (
          <Reveal key={(child as { key?: string })?.key ?? index} delay={Math.min(index, 5) * 60}>
            {child}
          </Reveal>
        ) : (
          child
        ),
      )}
    </div>
  );
}

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURE_NOTES: FeatureCard[] = [
  {
    icon: BookOpen,
    title: "Staff picks, honestly made",
    description:
      "Every shelf starts from books people actually saved — no paid placements, no algorithmic filler.",
  },
];

export default function HomeClient({
  shelves = [],
  staffPicks = [],
  user = null,
  recommended = null,
}: HomeClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  const forYouSubtitle =
    recommended?.basis === "activity"
      ? "Based on what you've saved and rated."
      : recommended?.basis === "preferences"
        ? "Based on your favorite genres."
        : "Popular right now — save a few books to personalize this.";

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <SiteHeader user={user} />

      {/* Masthead */}
      <section className="relative bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10 lg:pt-24 xl:gap-16">
          <Reveal>
            <p className="font-display text-sm italic text-muted-ink">
              est. for people with too many bookmarks
            </p>
            <h1 className="mt-4 max-w-xl text-balance font-display text-5xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">
              Find the book that{" "}
              <span className="relative inline-block">
                finds you.
                <Squiggle className="absolute -bottom-3 left-0" />
              </span>
            </h1>

            <form
              onSubmit={handleSearchSubmit}
              className="mt-9 flex max-w-md items-center gap-2"
            >
              <Input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="A mood, an author, a feeling..."
                aria-label="Search books"
                className="border-ink/25"
              />
              <Button type="submit" aria-label="Search" className="shrink-0 px-4">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>

            <div className="mt-7 flex max-w-lg flex-wrap items-center gap-x-3 gap-y-3">
              {GENRE_TAGS.map((genre, index) => (
                <StampBadge key={genre} rotate={index % 2 === 0 ? -2 : 1.5}>
                  {genre}
                </StampBadge>
              ))}
            </div>
          </Reveal>

          {/* Staff picks — taped to the wall */}
          {staffPicks.length > 0 && (
            <Reveal delay={150}>
              <div className="relative mx-auto w-fit rotate-1 rounded-sm border border-hairline bg-paper px-8 pb-8 pt-10 shadow-sm lg:mx-0">
                <TapeStrip angle={-5} className="-top-3 left-6" />
                <TapeStrip angle={3} className="-top-2 right-8" />
                <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] select-none font-display text-lg italic text-muted-ink/30">
                  staff picks
                </p>
                <div className="relative flex items-end justify-center gap-4">
                  {staffPicks.map((book, index) => (
                    <Link
                      key={book.id}
                      href={`/book/${book.id}`}
                      className="block w-24 transition-transform duration-300 hover:rotate-0 sm:w-28"
                      style={{ rotate: `${(index - 1) * 3}deg` }}
                    >
                      <span className="block transition-transform duration-300 hover:-translate-y-1">
                        <span className="pointer-events-none relative block aspect-[2/3] w-full overflow-hidden rounded-sm border border-hairline bg-surface shadow-sm">
                          {book.cover_url ? (
                            <Image
                              src={book.cover_url}
                              alt={`Cover of ${book.title}`}
                              fill
                              sizes="112px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-hairline">
                              <BookOpen className="h-8 w-8" />
                            </span>
                          )}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
        <TornEdge position="bottom" />
      </section>

      {/* For You */}
      {recommended && recommended.books.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              title="For You"
              sub={forYouSubtitle}
            />
          </Reveal>
          <ShelfRow>
            {recommended.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ShelfRow>
        </section>
      )}

      {/* Genre shelves */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            title="The shelves"
            sub="Recommended by genre, drawn from what readers are saving."
          />
        </Reveal>

        {shelves.length === 0 ? (
          <div className="mt-10">
            <EmptyStateHome />
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-12">
            {shelves.map((shelf) => (
              <div key={shelf.genre}>
                <Reveal>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {shelf.genre}
                    </h3>
                    <span className="text-xs text-muted-ink">
                      {shelf.books.length} on the shelf
                    </span>
                  </div>
                </Reveal>
                <ShelfRow>
                  {shelf.books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </ShelfRow>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* A quiet note */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <Reveal>
            {FEATURE_NOTES.map((note) => {
              const Icon = note.icon;
              return (
                <div key={note.title}>
                  <Icon className="mx-auto h-6 w-6 text-accent" strokeWidth={1.75} />
                  <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
                    {note.title}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-ink">
                    {note.description}
                  </p>
                </div>
              );
            })}
            {!user && (
              <Link
                href="/sign-up"
                className="mt-7 inline-flex items-center gap-1.5 rounded-md bg-ink px-6 py-3 text-sm font-semibold text-surface transition-colors hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Start your collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function EmptyStateHome() {
  return (
    <div className="relative mx-auto flex max-w-xl flex-col items-center justify-center border border-dashed border-hairline bg-surface px-6 py-16 text-center">
      <span aria-hidden="true" className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
      <span aria-hidden="true" className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
      <p className="font-display text-lg italic text-muted-ink">
        The shelves are being stocked.
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-ink">
        A shelf appears once two or more saved books share a genre. Be the
        first to start one.
      </p>
      <Link
        href="/search"
        className="mt-6 inline-flex items-center gap-1.5 rounded-md border border-ink/30 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Browse some books
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

type HomeClientProps = {
  shelves: GenreShelf[];
  staffPicks?: CachedBook[];
  user?: AuthUser;
  recommended?: RecommendationResult | null;
};
