"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, User, Heart, BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import Button from "@/components/ui/Button";
import Botanical from "@/components/decor/Botanical";
import Squiggle from "@/components/decor/Squiggle";
import { createClient } from "@/lib/supabase/client";
import "../app/globals.css";

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

type OnboardingStep = "genres" | "personal" | "complete";

type OnboardingClientProps = {
  initialGenres: string[];
};

export default function OnboardingClient({
  initialGenres,
}: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("genres");
  const [selected, setSelected] = useState<Set<string>>(new Set(initialGenres));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Personal step state
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodOptions] = useState<
    { label: string; value: string }[]
  >([
    { label: "Escape reality", value: "escape" },
    { label: "Learn something new", value: "learn" },
    { label: "Feel seen", value: "feel-seen" },
    { label: "Fall in love", value: "romance" },
    { label: "Solve a mystery", value: "mystery" },
  ]);

  const justStamped = useRef(false);

  function toggle(genre: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
    justStamped.current = true;
    setTimeout(() => (justStamped.current = false), 400);
  }

  async function persist(): Promise<boolean> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/sign-in?next=/onboarding");
      return false;
    }

    const genreArray = Array.from(selected);
    const payload = {
      id: user.id,
      favorite_genres: genreArray,
      name: name.trim() || undefined,
      bio: bio.trim() || undefined,
      reading_mood: selectedMood || undefined,
      onboarded_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from("user_profiles")
      .upsert(payload, { onConflict: "id" });

    if (upsertError) {
      console.error("Error saving onboarding:", upsertError);
      setError("Could not save your profile. Try again.");
      setIsSaving(false);
      return false;
    }
    return true;
  }

  async function handleNext() {
    if (step === "genres") {
      if (selected.size < 3) {
        setError("Please select at least 3 genres.");
        return;
      }
      setStep("personal");
      setError(null);
      return;
    }

    if (step === "personal") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (!bio.trim()) {
        setError("Please write a short bio.");
        return;
      }
      setIsSaving(true);
      if (await persist()) {
        router.replace("/");
        router.refresh();
      }
      setIsSaving(false);
    }
  }

  async function handleSkip() {
    if (step === "genres") {
      const defaultGenres = ["Fantasy", "Sci-Fi", "Romance"];
      setSelected(new Set(defaultGenres));
      setStep("personal");
    } else {
      router.replace("/");
      router.refresh();
    }
  }

  const isDone =
    step === "genres"
      ? selected.size >= 3
      : step === "personal"
      ? name.trim().length > 0 && bio.trim().length > 0
      : true;

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* Paper texture background wrapper */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-10 top-10 h-44 w-32 rotate-12"
          style={{
            background: "radial-gradient(circle at 30% 20%, rgba(246,241,231,0.3) 0%, transparent 50%)",
          }}
        />
        <Botanical
          variant="branch"
          className="absolute -left-10 top-10 h-44 w-32 rotate-12"
        />
      </div>

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
          Stick a stamp on at least three genres and we'll shape your shelves around
          them. You can peel them off anytime.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl rounded-sm border border-hairline bg-surface p-8 shadow-sm sm:p-10">
        {step === "genres" ? (
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
                    justStamped.current && isActive && "[animation:stamp_0.25s_ease-out]",
                  )}
                >
                  {isActive && <Check className="h-3 w-3" strokeWidth={3} />}
                  {genre}
                </button>
              );
            })}
          </div>
        ) : step === "personal" ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full rounded-md border border-ink/25 px-3 py-2 text-sm shadow-sm focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-colors"
                aria-label="Your name"
              />
              {!name.trim() && (
                <p className="mt-1 text-xs text-red-600">Name is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us about your reading taste, favorite books, or anything else..."
                className="w-full rounded-md border border-ink/25 px-3 py-2 text-sm shadow-sm focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-colors resize-none"
                aria-label="Your bio"
              />
              {!bio.trim() && (
                <p className="mt-1 text-xs text-red-600">Bio is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                What kind of reading mood are you in?
              </label>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedMood(option.value)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border border-dashed px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                      selectedMood === option.value
                        ? "border-accent bg-accent/15 text-accent"
                        : "border-hairline bg-paper text-muted-ink hover:border-accent/40 hover:text-accent",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {selectedMood && (
                <p className="mt-2 text-sm text-muted-ink">
                  Selected: {selectedMood === "romance" ? "Romance" : ""}{" "}
                  {selectedMood === "mystery" ? "Mystery" : ""}{" "}
                  {selectedMood === "learn" ? "Learning" : ""}{" "}
                  {selectedMood === "escape" ? "Escape" : ""}
                </p>
              )}
            </div>
          </div>
        ) : null}

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
            onClick={handleNext}
            disabled={!isDone || isSaving}
            className="px-8 py-3.5"
            aria-live="polite"
          >
            {isSaving ? (
              <>
                Saving
                <LoaderCircle className="h-4 w-4 animate-spin" />
              </>
            ) : step === "genres" ? (
              <>
                Continue{selected.size > 0 ? ` (${selected.size}/3)` : ""}
              </>
            ) : step === "personal" ? (
              "Complete onboarding"
            ) : null}
          </Button>
          {!isDone && step === "genres" && (
            <p className="text-xs text-muted-ink">
              Select {3 - selected.size} more genre
              {3 - selected.size === 1 ? "" : "s"} to continue
            </p>
          )}
          {step === "personal" && !isDone && (
            <p className="text-xs text-muted-ink">
              Fill in your name and bio to continue
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
    </div>
  );
}