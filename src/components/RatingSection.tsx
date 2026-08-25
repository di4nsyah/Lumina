"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Star, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getOrSaveBook } from "@/lib/bookService";
import type { SaveBookInput } from "@/lib/savedBooks";
import type { SiteHeaderUser } from "@/components/SiteHeader";

type RatingStats = {
  average: number | null;
  count: number;
  mine: number | null;
};

type RatingSectionProps = {
  user: SiteHeaderUser;
  book: SaveBookInput;
  nextPath: string;
};

async function fetchStats(
  bookRowId: string,
  userId: string,
): Promise<RatingStats> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ratings")
    .select("user_id,rating")
    .eq("book_id", bookRowId);

  if (error) {
    console.error("Error loading ratings:", error);
    return { average: null, count: 0, mine: null };
  }

  const rows = data as { user_id: string; rating: number }[];
  const mine = rows.find((row) => row.user_id === userId)?.rating ?? null;
  const count = rows.length;
  const sum = rows.reduce((total, row) => total + row.rating, 0);

  return {
    average: count > 0 ? Math.round((sum / count) * 10) / 10 : null,
    count,
    mine,
  };
}

export default function RatingSection({
  user,
  book,
  nextPath,
}: RatingSectionProps) {
  const router = useRouter();
  const [stats, setStats] = useState<RatingStats>({
    average: null,
    count: 0,
    mine: null,
  });
  const [hovered, setHovered] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [justStamped, setJustStamped] = useState(false);

  useEffect(() => {
    if (!user) return;

    let active = true;
    (async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!active || !authUser) return;

      // Read-only resolution — do NOT cache on mount, only when rating.
      const { data: cached } = await supabase
        .from("books")
        .select("id")
        .eq("title", book.title)
        .limit(1);

      if (!active) return;
      const row = (cached as { id: string }[] | null)?.[0];
      if (!row) {
        setLoaded(true);
        return;
      }

      const fetched = await fetchStats(String(row.id), authUser.id);
      if (active) {
        setStats(fetched);
        setLoaded(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [user, book.title]);

  async function handleRate(rating: number) {
    setError(null);

    if (!user) {
      router.push(`/sign-in?next=${encodeURIComponent(nextPath)}`);
      return;
    }
    if (isSaving) return;

    setIsSaving(true);

    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) {
      setIsSaving(false);
      return;
    }

    // Caches the book row on first interaction so ratings have an anchor.
    const cached = await getOrSaveBook(book);
    if (!cached) {
      setError("Could not register your rating. Try again.");
      setIsSaving(false);
      return;
    }

    const { error: upsertError } = await supabase.from("ratings").upsert(
      { user_id: authUser.id, book_id: String(cached.id), rating },
      { onConflict: "user_id,book_id" },
    );

    if (upsertError) {
      console.error("Error saving rating:", upsertError);
      setError("Could not save your rating. Try again.");
      setIsSaving(false);
      return;
    }

    const fresh = await fetchStats(String(cached.id), authUser.id);
    setStats(fresh);
    setIsSaving(false);
    setJustStamped(true);
    setTimeout(() => setJustStamped(false), 400);
  }

  const displayValue = hovered ?? stats.mine ?? 0;

  return (
    <section className="rounded-sm border border-hairline bg-paper p-5">
      <h2 className="text-xs font-semibold text-muted-ink">Your rating</h2>

      <div className="mt-3 flex items-center gap-3">
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHovered(null)}
          role={user ? "radiogroup" : undefined}
          aria-label={user ? "Rate this book" : undefined}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSaving}
              onMouseEnter={() => setHovered(star)}
              onClick={() => handleRate(star)}
              aria-label={`Rate ${star} out of 5`}
              className={`rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                justStamped ? "[animation:stamp_0.3s_ease-out]" : ""
              }`}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= displayValue
                    ? "fill-accent/80 text-accent/80"
                    : "text-hairline"
                }`}
                strokeWidth={1.75}
              />
            </button>
          ))}
          {isSaving && (
            <LoaderCircle className="ml-1 h-4 w-4 animate-spin text-muted-ink" />
          )}
        </div>

        {stats.average !== null && (
          <p className="inline-flex items-center gap-1 text-sm text-muted-ink">
            <span className="font-display font-semibold text-ink">
              {stats.average}
            </span>
            · {stats.count} rating{stats.count === 1 ? "" : "s"}
            {stats.mine !== null && (
              <span className="text-emerald-800">(yours: {stats.mine})</span>
            )}
          </p>
        )}
      </div>

      {!user && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-ink">
          <UserRound className="h-3.5 w-3.5" />
          Click a star to sign in and rate — it takes a second.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-900">
          {error}
        </p>
      )}

      {user && loaded && stats.mine === null && !error && (
        <p className="mt-2 text-xs text-muted-ink">
          You haven&apos;t rated this one yet.
        </p>
      )}
    </section>
  );
}
