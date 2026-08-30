import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, UserRound } from "lucide-react";
import { getBookById } from "@/lib/googleBooks";
import { createClient } from "@/lib/supabase/server";
import SiteHeader, { type SiteHeaderUser } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BookSaveSection from "@/components/BookSaveSection";
import RatingSection from "@/components/RatingSection";
import StampBadge from "@/components/ui/StampBadge";
import ShareButton from "@/components/ShareButton";

export const dynamic = "force-dynamic";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type BookDetail = {
  title: string;
  author: string;
  cover_url: string;
  description: string;
  genre?: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function loadBook(id: string): Promise<BookDetail | null> {
  if (UUID_PATTERN.test(id)) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("books")
      .select("title,author,cover_url,genre")
      .eq("id", id)
      .maybeSingle();
    if (data && !error) {
      const row = data as {
        title: string;
        author: string;
        cover_url: string;
        genre: string | null;
      };
      return {
        title: row.title,
        author: row.author,
        cover_url: row.cover_url,
        description: "",
        genre: row.genre ?? undefined,
      };
    }
  }

  try {
    const book = await getBookById(id);
    if (book) return book;
  } catch (err) {
    console.warn("Error loading book detail:", err);
  }

  return null;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const book = await loadBook(id);
  return { title: book ? `${book.title}` : "Book not found" };
}

export default async function BookPage({ params }: PageProps) {
  const { id } = await params;

  const [book, supabase] = await Promise.all([loadBook(id), createClient()]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const siteUser: SiteHeaderUser = user ? { email: user.email ?? "" } : null;

  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <SiteHeader user={siteUser} />

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the stacks
        </Link>

        {!book ? (
          <div className="relative mt-10 flex flex-col items-center justify-center border border-dashed border-hairline bg-surface px-6 py-24 text-center">
            <span aria-hidden="true" className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
            <span aria-hidden="true" className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
            <p className="font-display text-xl italic text-muted-ink">
              This bookmark fell out of the catalogue.
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-ink">
              We couldn&apos;t find this book. It may have been removed.
            </p>
            <Link
              href="/search"
              className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Search for another book
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        ) : (
          <article className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-[240px_1fr] sm:gap-14">
            <div className="mx-auto w-full max-w-[240px] sm:mx-0">
              <div className="rounded-sm p-2 outline outline-1 outline-dashed outline-hairline [outline-offset:4px]">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-hairline bg-surface shadow-sm">
                  {book.cover_url ? (
                    <Image
                      src={book.cover_url}
                      alt={`Cover of ${book.title} by ${book.author}`}
                      fill
                      sizes="240px"
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-hairline">
                      <BookOpen className="h-14 w-14" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <BookSaveSection
                  user={siteUser}
                  book={{
                    title: book.title,
                    author: book.author,
                    cover_url: book.cover_url,
                    genre: book.genre,
                  }}
                />
                <RatingSection
                  user={siteUser}
                  book={{
                    title: book.title,
                    author: book.author,
                    cover_url: book.cover_url,
                    genre: book.genre,
                  }}
                  nextPath={`/book/${id}`}
                />
                <ShareButton
                  title={book.title}
                  author={book.author}
                  url={`/book/${id}`}
                />
              </div>
            </div>

            <div>
              {book.genre && (
                <StampBadge rotate={-2}>{book.genre}</StampBadge>
              )}
              <h1 className="mt-4 max-w-lg text-balance font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
                {book.title}
              </h1>
              <p className="mt-3 inline-flex items-center gap-1.5 font-display text-base italic text-muted-ink">
                <UserRound className="h-4 w-4" strokeWidth={2} />
                {book.author}
              </p>

              {book.description ? (
                <div className="mt-10 max-w-prose border-l-2 border-hairline pl-6">
                  {book.description.split("\n").map((paragraph, index) =>
                    paragraph.trim() ? (
                      <p
                        key={index}
                        className="font-display mb-4 text-[17px] font-light leading-relaxed last:mb-0"
                      >
                        {paragraph}
                      </p>
                    ) : null,
                  )}
                </div>
              ) : (
                <p className="mt-10 max-w-prose text-sm italic text-muted-ink">
                  No description available for this title.
                </p>
              )}
            </div>
          </article>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
