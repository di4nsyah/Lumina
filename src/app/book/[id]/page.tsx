import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, UserRound } from "lucide-react";
import { getBookById } from "@/lib/googleBooks";
import { createClient } from "@/lib/supabase/server";
import SiteHeader, { type SiteHeaderUser } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BookSaveSection from "@/components/BookSaveSection";
import RatingSection from "@/components/RatingSection";

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
    const { data } = await supabase
      .from("books")
      .select("title,author,cover_url,genre")
      .eq("id", id)
      .maybeSingle();
    if (data) {
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

  return getBookById(id);
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const book = await loadBook(id);
  return { title: book ? `${book.title} — LuminaBooks` : "Book — LuminaBooks" };
}

export default async function BookPage({ params }: PageProps) {
  const { id } = await params;

  const [book, supabase] = await Promise.all([loadBook(id), createClient()]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const siteUser: SiteHeaderUser = user ? { email: user.email ?? "" } : null;

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-slate-900 antialiased">
      <SiteHeader user={siteUser} />

      <main className="relative px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-orange-300 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>

          {!book ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-24 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <BookOpen className="h-6 w-6" />
              </span>
              <h1 className="mt-4 text-lg font-bold text-slate-900">
                Book not found
              </h1>
              <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                We couldn&apos;t find this book. It may have been removed from
                the catalogue.
              </p>
              <Link
                href="/search"
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Search for another book
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          ) : (
            <article className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-[240px_1fr] sm:gap-12">
              <div className="mx-auto w-full max-w-[240px] sm:mx-0">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100 shadow-md">
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
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <BookOpen className="h-14 w-14" />
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-4">
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
                </div>
              </div>

              <div>
                {book.genre && (
                  <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {book.genre}
                  </span>
                )}
                <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                  {book.title}
                </h1>
                <p className="mt-3 inline-flex items-center gap-1.5 text-base text-slate-500">
                  <UserRound className="h-4 w-4" />
                  {book.author}
                </p>

                {book.description ? (
                  <div className="mt-8 max-w-prose space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      About this book
                    </h2>
                    {book.description.split("\n").map((paragraph, index) =>
                      paragraph.trim() ? (
                        <p
                          key={index}
                          className="text-[15px] leading-relaxed text-slate-600"
                        >
                          {paragraph}
                        </p>
                      ) : null,
                    )}
                  </div>
                ) : (
                  <p className="mt-8 max-w-prose text-sm italic text-slate-400">
                    No description available for this title.
                  </p>
                )}
              </div>
            </article>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
