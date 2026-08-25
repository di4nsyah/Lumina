"use client";

import { createClient } from "@/lib/supabase/client";
import { getOrSaveBook } from "@/lib/bookService";
import type { SupabaseClient } from "@supabase/supabase-js";

export type SaveBookInput = {
  title: string;
  author: string;
  cover_url: string;
  genre?: string;
};

/**
 * Returns a Map of result-title -> saved_books.id for books the current
 * user has already saved. Titles that are not cached in `books` yet simply
 * have no entry — they cannot be saved by this user.
 *
 * Accepts any authed Supabase client (browser or server cookie client).
 */
export async function getSavedStateByTitle(
  supabase: SupabaseClient,
  titles: string[],
): Promise<Map<string, string>> {
  if (titles.length === 0) return new Map();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Map();

  const { data: cachedBooks, error: booksError } = await supabase
    .from("books")
    .select("id,title")
    .in("title", titles);

  if (booksError) {
    console.error("Error resolving cached books:", booksError);
    return new Map();
  }

  const idByTitle = new Map<string, string>();
  for (const book of cachedBooks ?? []) {
    idByTitle.set(book.title, String(book.id));
  }

  const bookIds = Array.from(idByTitle.values());
  if (bookIds.length === 0) return new Map();

  const { data: savedRows, error: savedError } = await supabase
    .from("saved_books")
    .select("id,book_id")
    .in("book_id", bookIds);

  if (savedError) {
    console.error("Error fetching saved books:", savedError);
    return new Map();
  }

  const savedIdByBookId = new Map<string, string>();
  for (const row of savedRows ?? []) {
    savedIdByBookId.set(String(row.book_id), String(row.id));
  }

  const savedByTitle = new Map<string, string>();
  for (const [title, bookId] of idByTitle) {
    const savedId = savedIdByBookId.get(bookId);
    if (savedId) savedByTitle.set(title, savedId);
  }
  return savedByTitle;
}

export type ToggleResult =
  | { ok: true; savedId: string | null }
  | { ok: false; error: "not-authenticated" | "failed" };

/** Saves the book (caching it first if needed) and returns its saved_books.id. */
export async function saveToCollection(
  book: SaveBookInput,
): Promise<ToggleResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not-authenticated" };

  const cached = await getOrSaveBook(book);
  if (!cached) return { ok: false, error: "failed" };

  const { data, error } = await supabase
    .from("saved_books")
    .insert({ user_id: user.id, book_id: String(cached.id) })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error saving book:", error);
    return { ok: false, error: "failed" };
  }

  return { ok: true, savedId: String(data.id) };
}

export async function removeFromCollection(
  savedId: string,
): Promise<ToggleResult> {
  const supabase = createClient();
  const { error } = await supabase
    .from("saved_books")
    .delete()
    .eq("id", savedId);

  if (error) {
    console.error("Error removing saved book:", error);
    return { ok: false, error: "failed" };
  }

  return { ok: true, savedId: null };
}
