import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { searchGoogleBooks } from "@/lib/googleBooks";
import { getSavedStateByTitle } from "@/lib/savedBooks";
import { createClient } from "@/lib/supabase/server";
import SiteHeader, { type SiteHeaderUser } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SaveButton from "@/components/SaveButton";
import SearchForm from "@/components/SearchForm";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const siteUser: SiteHeaderUser = user ? { email: user.email ?? "" } : null;

  // Server-driven search: the URL is the single source of truth.
  const results = query ? await searchGoogleBooks(query) : [];

  const savedMap =
    user && siteUser && results.length > 0
      ? await getSavedStateByTitle(
          supabase,
          results.map((b) => b.title),
        )
      : new Map<string, string>();

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <SiteHeader user={siteUser} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <SectionHeading title="Browse the stacks" squiggle />

        <SearchForm initialQuery={query} />

        <div className="mt-12">
          {!query && (
            <EmptyState
              title="What are you in the mood for?"
              body='Try an author like "Terry Pratchett", a title, or something vaguer like "space opera".'
            />
          )}

          {query && (
            <p className="text-sm text-muted-ink" aria-live="polite">
              {results.length} result{results.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-ink">&ldquo;{query}&rdquo;</span>
            </p>
          )}

          {query && results.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((book) => (
                <article key={book.google_id} className="flex flex-col">
                  <Link
                    href={`/book/${book.google_id}`}
                    className="group block focus-visible:outline-none"
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-hairline bg-surface transition-transform duration-300 group-hover:-translate-y-0.5">
                      {book.cover_url ? (
                        <Image
                          src={book.cover_url}
                          alt={`Cover of ${book.title} by ${book.author}`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-hairline">
                          <BookOpen className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="mt-2.5 flex flex-1 flex-col gap-2.5">
                    <div className="min-w-0">
                      <h2 className="line-clamp-1 font-display text-sm font-semibold text-ink sm:text-base">
                        {book.title}
                      </h2>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-ink sm:text-sm">
                        {book.author}
                      </p>
                    </div>
                    <div className="mt-auto pt-1">
                      <SaveButton
                        book={{
                          title: book.title,
                          author: book.author,
                          cover_url: book.cover_url,
                          genre: book.genre || undefined,
                        }}
                        savedId={savedMap.get(book.title) ?? null}
                        isAuthenticated={siteUser !== null}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
