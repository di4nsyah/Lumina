import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { CachedBook } from "@/lib/bookService";
import SaveButton from "@/components/SaveButton";

type LibraryShelfClientProps = {
  shelfBooks: CachedBook[];
  savedIdByTitle: Record<string, string>;
  isAuthenticated: boolean;
};

export default function LibraryShelfClient({
  shelfBooks,
  savedIdByTitle,
  isAuthenticated,
}: LibraryShelfClientProps) {
  return (
    <div className="mt-6 flex gap-5 overflow-x-auto border-b border-hairline pb-4">
      {shelfBooks.map((book) => (
        <article key={book.id} className="w-36 shrink-0 sm:w-44">
          <Link href={`/book/${book.id}`} className="group block focus-visible:outline-none">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm border border-hairline bg-surface transition-transform duration-300 group-hover:-translate-y-0.5">
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
          </Link>
          <div className="mt-2.5">
            <h3 className="line-clamp-1 font-display text-sm font-semibold text-ink sm:text-base">
              {book.title}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-ink sm:text-sm">
              {book.author}
            </p>
          </div>
          <div className="mt-2.5">
            <SaveButton
              book={{
                title: book.title,
                author: book.author,
                cover_url: book.cover_url,
                genre: book.genre || undefined,
              }}
              savedId={savedIdByTitle[book.title] ?? null}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
