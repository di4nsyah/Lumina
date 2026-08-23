import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getOrSaveBook(bookdata: {
    title: string;
    author: string;
    cover_url: string;
}) {
    const {data: existingBook} = await supabase
    .from('books')
    .select('*')
    .eq('title', bookdata.title)
    .single();

    if (existingBook) {
        return existingBook;
    }

    const {data: newBook, error} = await supabase
    .from('books')
    .insert([bookdata])
    .select()
    .single();

    if (error) {
        console.error('Error caching book:', error);
        return null;
    }

    return newBook;
}

// ---------------------------------------------------------------------------
// Added for the homepage Gallery — reads back whatever's already cached in
// Supabase instead of hitting Google Books on every homepage load.
//
// Assumes your `books` table has a `created_at` column (Supabase adds this
// by default when a table is created via the dashboard). If yours doesn't,
// this query will error and simply return an empty array — drop the
// `.order(...)` line below if that happens.
// ---------------------------------------------------------------------------

export type CachedBook = {
    id: string | number;
    title: string;
    author: string;
    cover_url: string;
    created_at?: string;
};

export async function getRecentBooks(limit: number = 8): Promise<CachedBook[]> {
    const {data, error} = await supabase
    .from('books')
    .select('*')
    .order('created_at', {ascending: false})
    .limit(limit);

    if (error) {
        console.error('Error fetching recent books:', error);
        return [];
    }

    return (data as CachedBook[]) ?? [];
}
