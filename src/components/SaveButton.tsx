"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, LoaderCircle } from "lucide-react";
import {
  saveToCollection,
  removeFromCollection,
  type SaveBookInput,
} from "@/lib/savedBooks";

type SaveState = "idle" | "saving" | "error";

type SaveButtonProps = {
  book: SaveBookInput;
  /** Server-known saved state; the button owns optimistic updates on top. */
  savedId: string | null;
  isAuthenticated: boolean;
};

export default function SaveButton({
  book,
  savedId: serverSavedId,
  isAuthenticated,
}: SaveButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<SaveState>("idle");
  const [optimisticSavedId, setOptimisticSavedId] = useState<string | null>(
    null,
  );
  const [justStamped, setJustStamped] = useState(false);

  const savedId =
    optimisticSavedId !== null && optimisticSavedId !== undefined
      ? optimisticSavedId
      : serverSavedId;

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/sign-in?next=${encodeURIComponent("/search")}`);
      return;
    }
    if (state === "saving") return;

    setState("saving");

    const result = savedId
      ? await removeFromCollection(savedId)
      : await saveToCollection(book);

    if (!result.ok) {
      setState("error");
      return;
    }

    setState("idle");
    setOptimisticSavedId(result.savedId);
    if (result.savedId) {
      setJustStamped(true);
      setTimeout(() => setJustStamped(false), 400);
    }
  }

  const isSaved = savedId !== null;

  if (isSaved && state === "idle") {
    return (
      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={handleClick}
          aria-pressed="true"
          aria-label={`Remove ${book.title} from collection`}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-dashed border-emerald-800/40 bg-emerald-900/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-900 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            justStamped ? "[animation:stamp_0.3s_ease-out]" : ""
          }`}
          style={{ rotate: "-1.5deg" }}
        >
          <BookmarkCheck className="h-3.5 w-3.5" />
          Saved
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "saving"}
        aria-pressed="false"
        aria-label={`Save ${book.title} to collection`}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-ink/30 px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        {state === "saving" ? (
          <>
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            {isSaved ? "Removing..." : "Saving..."}
          </>
        ) : (
          <>
            <Bookmark className="h-3.5 w-3.5" />
            Save
          </>
        )}
      </button>
      {state === "error" && (
        <p role="alert" className="text-center text-[11px] font-medium text-red-900">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
