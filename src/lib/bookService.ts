import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getOrSaveBook(bookdata: {
    title: string;
    author: string;
    cover_url: string;
    genre?: string;
}) {
    const {data: existingBook} = await supabase
    .from('books')
    .select('*')
    .eq('title', bookdata.title)
    .single();

    if (existingBook) {
        if (!existingBook.genre && bookdata.genre) {
            const {data: updatedBook} = await supabase
            .from('books')
            .update({genre: bookdata.genre})
            .eq('id', existingBook.id)
            .select()
            .single();

            return updatedBook ?? existingBook;
        }

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


export type CachedBook = {
    id: string | number;
    title: string;
    author: string;
    cover_url: string;
    genre?: string;
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

export type GenreShelf = {
    genre: string;
    books: CachedBook[];
};

/**
 * @param pool      
 * @param booksPerShelf 
 * @param maxShelves 
 */
export async function getBooksByGenre(
    pool: number = 40,
    booksPerShelf: number = 6,
    maxShelves: number = 5
): Promise<GenreShelf[]> {
    const {data, error} = await supabase
    .from('books')
    .select('*')
    .order('created_at', {ascending: false})
    .limit(pool);

    if (error) {
        console.error('Error fetching books for genre grouping:', error);
        return [];
    }

    const books = (data as CachedBook[]) ?? [];
    const grouped = new Map<string, CachedBook[]>();

    for (const book of books) {
        const genre = book.genre?.trim();
        if (!genre) continue;
        const existing = grouped.get(genre) ?? [];
        existing.push(book);
        grouped.set(genre, existing);
    }

    return Array.from(grouped.entries())
        .filter(([, shelfBooks]) => shelfBooks.length >= 2) // no single-book shelves
        .map(([genre, shelfBooks]) => ({genre, books: shelfBooks.slice(0, booksPerShelf)}))
        .slice(0, maxShelves);
}