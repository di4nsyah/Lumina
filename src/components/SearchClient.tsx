"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, LoaderCircle, Search } from "lucide-react";
import { searchGoogleBooks, type GoogleBook } from "@/lib/googleBooks";
import { getSavedStateByTitle } from "@/lib/savedBooks";
import SiteHeader, { type SiteHeaderUser } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SaveButton from "@/components/SaveButton";

type SearchClientProps = {
  user: SiteHeaderUser;
};

function toSaveInput(book: GoogleBook) {
  return {
    title: book.title,
    author: book.author,
    cover_url: book.cover_url,
    genre: book.genre || undefined,
  };
}

export default function SearchClient({ user }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [savedMap, setSavedMap] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    const found = await searchGoogleBooks(query);
    setResults(found);
    setHasSearched(true);

    if (user && found.length > 0) {
      const saved = await getSavedStateByTitle(found.map((b) => b.title));
      setSavedMap(saved);
    } else {
      setSavedMap(new Map());
    }

    setLoading(false);
  }

  function handleSavedChange(title: string, savedId: string | null) {
    setSavedMap((prev) => {
      const next = new Map(prev);
      if (savedId) next.set(title, savedId);
      else next.delete(title);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-slate-900 antialiased">
      <SiteHeader user={user} />

      <main className="relative px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Find your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                next read
              </span>
            </h1>
            <p className="mt-2.5 text-base text-slate-500">
              Search millions of titles and save the ones that catch your eye.
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-slate-200/60 bg-white p-2 pl-5 shadow-sm transition-shadow focus-within:shadow-md"
            >
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="A title, an author, a mood..."
                aria-label="Search books"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                aria-label="Search"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Search</span>
                )}
              </button>
            </form>
          </div>

          <div className="mt-14">
            {loading && (
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[2/3] w-full rounded-2xl bg-slate-200/70" />
                    <div className="mt-3 h-4 w-3/4 rounded-full bg-slate-200/70" />
                    <div className="mt-2 h-3 w-1/2 rounded-full bg-slate-200/70" />
                  </div>
                ))}
              </div>
            )}

            {!loading && !hasSearched && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-20 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Search className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-slate-900">
                  What are you in the mood for?
                </h2>
                <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                  Try an author like &ldquo;Terry Pratchett&rdquo;, a title, or
                  something vaguer like &ldquo;space opera&rdquo;.
                </p>
              </div>
            )}

            {!loading && hasSearched && results.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-20 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <BookOpen className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-slate-900">
                  No books found
                </h2>
                <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                  Nothing matched &ldquo;{query}&rdquo;. Check the spelling or
                  try a different keyword.
                </p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                <p className="text-sm text-slate-500" aria-live="polite">
                  {results.length} result{results.length === 1 ? "" : "s"} for{" "}
                  <span className="font-semibold text-slate-700">
                    &ldquo;{query}&rdquo;
                  </span>
                </p>
                <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {results.map((book) => (
                    <article
                      key={book.google_id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <Link
                        href={`/book/${book.google_id}`}
                        className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100"
                      >
                        {book.cover_url ? (
                          <Image
                            src={book.cover_url}
                            alt={`Cover of ${book.title} by ${book.author}`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <BookOpen className="h-10 w-10" />
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col gap-2 p-3.5">
                        <div className="min-w-0">
                          <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
                            {book.title}
                          </h3>
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                            {book.author}
                          </p>
                        </div>
                        <div className="mt-auto pt-1">
                          <SaveButton
                            book={toSaveInput(book)}
                            savedId={savedMap.get(book.title) ?? null}
                            isAuthenticated={user !== null}
                            onSavedChange={(savedId) =>
                              handleSavedChange(book.title, savedId)
                            }
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
