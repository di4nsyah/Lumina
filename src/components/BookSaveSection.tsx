"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSavedStateByTitle, type SaveBookInput } from "@/lib/savedBooks";
import SaveButton from "@/components/SaveButton";
import type { SiteHeaderUser } from "@/components/SiteHeader";

type BookSaveSectionProps = {
  user: SiteHeaderUser;
  book: SaveBookInput;
};

export default function BookSaveSection({ user, book }: BookSaveSectionProps) {
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let active = true;
    getSavedStateByTitle(createClient(), [book.title]).then((saved) => {
      if (active) setSavedId(saved.get(book.title) ?? null);
    });
    return () => {
      active = false;
    };
  }, [user, book.title]);

  return (
    <div className="w-full max-w-xs">
      <SaveButton
        book={book}
        savedId={savedId}
        isAuthenticated={user !== null}
      />
    </div>
  );
}
