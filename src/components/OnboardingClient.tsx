"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import Button from "@/components/ui/Button";
import Squiggle from "@/components/decor/Squiggle";
import Botanical from "@/components/decor/Botanical";
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
  const [justStamped, setJustStamped] = useState(false);

  function toggle(genre: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
    setJustStamped(true);
    setTimeout(() => setJustStamped(false), 400);
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
    <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Botanical
        variant="branch"
        className="absolute -left-10 top-10 h-44 w-32 rotate-12"
      />

      <div className="text-center">
        <p className="font-display text-sm italic text-muted-ink">
          welcome to Lumina
        </p>
        <h1 className="mt-3 max-w-xl text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          What do you love{" "}
          <span className="relative inline-block">
            reading?
            <Squiggle className="absolute -bottom-2 left-0" />
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-ink">
          Stick a stamp on at least three genres and we&apos;ll shape your
          shelves around them. You can peel them off anytime.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl rounded-sm border border-hairline bg-surface p-8 shadow-sm sm:p-10">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-4">
          {GENRE_OPTIONS.map((genre, index) => {
            const isActive = selected.has(genre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggle(genre)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-dashed px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  isActive
                    ? "border-accent bg-accent/15 text-accent hover:bg-accent/20"
                    : "border-hairline bg-paper text-muted-ink hover:border-accent/40 hover:text-accent",
                  justStamped && isActive && "[animation:stamp_0.25s_ease-out]",
                )}
                style={{ rotate: `${((index % 5) - 2) * (isActive ? 1.2 : 0.8)}deg` }}
              >
                {isActive && <Check className="h-3 w-3" strokeWidth={3} />}
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mx-auto mt-6 max-w-md border border-dashed border-red-800/30 bg-red-900/5 px-4 py-3 text-center text-sm text-red-900"
        >
          {error}
        </p>
      )}

      <div className="mt-10 flex flex-col items-center gap-4">
        <Button
          onClick={handleContinue}
          disabled={!isDone || isSaving}
          className="px-8 py-3.5"
          aria-live="polite"
        >
          {isSaving ? (
            <>
              Saving
              <LoaderCircle className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>Continue{selected.size > 0 ? ` (${selected.size}/3)` : ""}</>
          )}
        </Button>
        {!isDone && (
          <p className="text-xs text-muted-ink">
            Select {3 - selected.size} more genre
            {3 - selected.size === 1 ? "" : "s"} to continue
          </p>
        )}
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSaving}
          className="text-sm font-medium text-muted-ink underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
