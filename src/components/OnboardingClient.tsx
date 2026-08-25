"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const GENRE_OPTIONS: string[] = [
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Mystery",
  "Thriller",
  "Horror",
  "Classics",
  "Historical Fiction",
  "Biography",
  "History",
  "Science",
  "Philosophy",
  "Poetry",
  "Self-Help",
  "Business",
  "Adventure",
  "Young Adult",
  "Comics",
];

type OnboardingClientProps = {
  initialGenres: string[];
};

export default function OnboardingClient({
  initialGenres,
}: OnboardingClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set(initialGenres));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(genre: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
  }

  async function persist(onboardedAt: string | null): Promise<boolean> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/sign-in?next=/onboarding");
      return false;
    }

    const { error: upsertError } = await supabase
      .from("user_profiles")
      .upsert(
        {
          id: user.id,
          favorite_genres: Array.from(selected),
          onboarded_at: onboardedAt,
        },
        { onConflict: "id" },
      );

    if (upsertError) {
      console.error("Error saving preferences:", upsertError);
      setError("Could not save your preferences. Try again.");
      setIsSaving(false);
      return false;
    }
    return true;
  }

  async function handleContinue() {
    if (selected.size < 3 || isSaving) return;
    setIsSaving(true);
    if (await persist(new Date().toISOString())) {
      router.replace("/");
      router.refresh();
    }
  }

  async function handleSkip() {
    if (isSaving) return;
    setIsSaving(true);
    // Skipped onboarding — profile keeps existing genres but stays unmarked.
    router.replace("/");
    router.refresh();
  }

  const isDone = selected.size >= 3;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
          Welcome to Lumina
        </span>
        <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          What do you love{" "}
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            reading?
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-slate-500">
          Pick at least three genres and we&apos;ll shape your shelves around
          them. You can change these anytime.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        {GENRE_OPTIONS.map((genre) => {
          const isActive = selected.has(genre);
          return (
            <button
              key={genre}
              type="button"
              onClick={() => toggle(genre)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
                isActive
                  ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                  : "border-slate-200 bg-white/70 text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {isActive && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              {genre}
            </button>
          );
        })}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600"
        >
          {error}
        </p>
      )}

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!isDone || isSaving}
          aria-live="polite"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <>
              Saving
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Continue{selected.size > 0 ? ` (${selected.size}/3)` : ""}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
        {!isDone && (
          <p className="text-xs text-slate-400">
            Select {3 - selected.size} more genre
            {3 - selected.size === 1 ? "" : "s"} to continue
          </p>
        )}
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSaving}
          className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-600"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
