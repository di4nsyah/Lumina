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
  savedId: string | null;
  isAuthenticated: boolean;
  onSavedChange: (savedId: string | null) => void;
};

export default function SaveButton({
  book,
  savedId,
  isAuthenticated,
  onSavedChange,
}: SaveButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<SaveState>("idle");

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
    onSavedChange(result.savedId);
  }

  const isSaved = savedId !== null;

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "saving"}
        aria-pressed={isSaved}
        aria-label={isSaved ? `Remove ${book.title} from collection` : `Save ${book.title} to collection`}
        className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 ${
          isSaved
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {state === "saving" ? (
          <>
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            {isSaved ? "Removing..." : "Saving..."}
          </>
        ) : isSaved ? (
          <>
            <BookmarkCheck className="h-3.5 w-3.5" />
            Saved
          </>
        ) : (
          <>
            <Bookmark className="h-3.5 w-3.5" />
            Save
          </>
        )}
      </button>
      {state === "error" && (
        <p role="alert" className="text-center text-[11px] font-medium text-red-500">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
