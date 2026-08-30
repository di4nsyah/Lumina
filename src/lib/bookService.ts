import {createClient, type SupabaseClient} from '@supabase/supabase-js';

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

export type RecommendationBasis = 'preferences' | 'activity' | 'collaborative' | 'fallback';

export type RecommendationResult = {
    books: CachedBook[];
    basis: RecommendationBasis;
};

type RecommendationContext = {
    userId: string;
    favoriteGenres: string[];
};

/**
 * Content-based recommendation. Requires an AUTHENTICATED Supabase client
 * (server cookie client) — RLS scopes saved_books/ratings to the caller.
 *
 * Basis precedence:
 * - 'activity'     : genres harvested from books the user saved or rated
 * - 'preferences'  : genres chosen during onboarding
 * - 'fallback'     : newest cached books when neither yields enough
 */
export async function getRecommendedBooks(
    supabase: SupabaseClient,
    context: RecommendationContext,
    limit: number = 8
): Promise<RecommendationResult> {
    const {userId, favoriteGenres} = context;

    // Books the user interacted with (saved + rated), and their genres.
    const [{data: savedRows}, {data: ratedRows}] = await Promise.all([
        supabase.from('saved_books').select('book_id').eq('user_id', userId),
        supabase.from('ratings').select('book_id,rating').eq('user_id', userId)
    ]);

    const interactedIds = new Set<string>();
    for (const row of (savedRows as {book_id: string}[] | null) ?? []) {
        interactedIds.add(String(row.book_id));
    }
    for (const row of (ratedRows as {book_id: string; rating: number}[] | null) ?? []) {
        interactedIds.add(String(row.book_id));
    }

    let activityGenres: string[] = [];
    if (interactedIds.size > 0) {
        const {data: interactedBooks} = await supabase
            .from('books')
            .select('genre')
            .in('id', Array.from(interactedIds));
        activityGenres = ((interactedBooks as {genre: string | null}[] | null) ?? [])
            .map((row) => row.genre?.trim())
            .filter((genre): genre is string => Boolean(genre));
    }

    const preferredGenres = favoriteGenres
        .map((genre) => genre.trim())
        .filter(Boolean);

    const candidateGenres = Array.from(
        new Set([...preferredGenres, ...activityGenres])
    );

    // --- Collaborative filtering: find users with similar tastes ---
    let collaborativeIds: string[] = [];
    if (interactedIds.size > 0) {
        // Find users who saved/rated books in the candidate genres
        const {data: similarUsers} = await supabase
            .from('saved_books')
            .select('user_id, book_id')
            .in('book_id', Array.from(interactedIds))
            .neq('user_id', userId)
            .limit(20);

        if (similarUsers && similarUsers.length > 0) {
            const similarUserIds = new Set(similarUsers.map((r) => r.user_id));
            // Get books those similar users saved (that the current user hasn't seen)
            const {data: similarSaved} = await supabase
                .from('saved_books')
                .select('book_id')
                .in('user_id', Array.from(similarUserIds));

            if (similarSaved && similarSaved.length > 0) {
                const similarBookIds: Set<string> = new Set();
                for (const r of similarSaved) {
                    similarBookIds.add(r.book_id);
                }
                collaborativeIds = [];
                for (const id of similarBookIds) {
                    if (!interactedIds.has(id)) {
                        collaborativeIds.push(id);
                    }
                }
            }
        }
    }

    // --- Combine content-based + collaborative ---
    const {data: matches, error} = await supabase
        .from('books')
        .select('*')
        .in('genre', candidateGenres)
        .order('created_at', {ascending: false})
        .limit(limit * 4);

    if (error) {
        console.error('Error fetching recommendations:', error);
        return {books: await getRecentBooks(limit), basis: 'fallback'};
    }

    const seenTitles = new Set<string>();
    const allSeenIds = new Set([
        ...interactedIds,
        ...(collaborativeIds.length > 0 ? collaborativeIds : []),
    ]);

    const recommendations = ((matches as CachedBook[] | null) ?? [])
        .filter((book) => {
            const id = String(book.id);
            if (allSeenIds.has(id)) return false;
            if (seenTitles.has(book.title)) return false;
            seenTitles.add(book.title);
            return true;
        })
        .slice(0, limit * 2); // pull extra to allow collaborative blend

    // Blend: give slight boost to books also in collaborative set
    const collaborativeSet = new Set(collaborativeIds);

    const blended = recommendations.map((book): CachedBook & {_boost: number} => {
        const bookId = String(book.id);
        const boost = collaborativeSet.has(bookId) ? 1.2 : 1.0;
        return {...book, _boost: boost};
    });

    blended.sort((a, b) => (b._boost ?? 1.0) - (a._boost ?? 1.0));

    const finalRecommendations = blended.slice(0, limit);

    if (finalRecommendations.length < Math.min(2, limit)) {
        return {books: await getRecentBooks(limit), basis: 'fallback'};
    }

    const basis = activityGenres.length > 0 || collaborativeIds.length > 0
        ? collaborativeIds.length > activityGenres.length
            ? 'collaborative'
            : 'activity'
        : 'preferences';

    return {
        books: finalRecommendations,
        basis,
    };
}

export async function getFavoriteGenres(
    supabase: SupabaseClient,
    userId: string
): Promise<string[]> {
    const {data: profile} = await supabase
        .from('user_profiles')
        .select('favorite_genres')
        .eq('id', userId)
        .maybeSingle();

    return (
        ((profile as {favorite_genres?: unknown} | null)?.favorite_genres as
            | string[]
            | undefined) ?? []
    ).filter((genre): genre is string => typeof genre === 'string');
}

/**
 * The user's personal collection as genre shelves. Unlike getBooksByGenre,
 * single-book shelves are kept — a collection of one is still a shelf.
 * Requires an AUTHENTICATED client (RLS scopes saved_books to the caller).
 */
export async function listSavedCollection(
    supabase: SupabaseClient,
    userId: string
): Promise<{shelves: GenreShelf[]; total: number; savedIdByTitle: Record<string, string>}> {
    const {data: savedRows, error: savedError} = await supabase
        .from('saved_books')
        .select('id,book_id,created_at')
        .eq('user_id', userId)
        .order('created_at', {ascending: false});

    if (savedError) {
        console.error('Error fetching saved books:', savedError);
        return {shelves: [], total: 0, savedIdByTitle: {}};
    }

    const rows = (savedRows as {id: string; book_id: string; created_at: string}[] | null) ?? [];
    if (rows.length === 0) return {shelves: [], total: 0, savedIdByTitle: {}};

    const {data: bookRows, error: booksError} = await supabase
        .from('books')
        .select('*')
        .in('id', rows.map((row) => row.book_id));

    if (booksError) {
        console.error('Error fetching collection books:', booksError);
        return {shelves: [], total: 0, savedIdByTitle: {}};
    }

    const bookById = new Map<string, CachedBook>();
    for (const book of (bookRows as CachedBook[] | null) ?? []) {
        bookById.set(String(book.id), book);
    }

    // Preserve save order (newest first) while grouping by genre.
    const grouped = new Map<string, CachedBook[]>();
    let total = 0;
    const savedIdByTitle: Record<string, string> = {};
    for (const row of rows) {
        const book = bookById.get(String(row.book_id));
        if (!book) continue;
        total += 1;
        savedIdByTitle[book.title] = String(row.id);
        const genre = book.genre?.trim() || 'Unsorted';
        const existing = grouped.get(genre) ?? [];
        existing.push(book);
        grouped.set(genre, existing);
    }

    const shelves = Array.from(grouped.entries())
        .sort((a, b) => b[1].length - a[1].length)
        .map(([genre, books]) => ({genre, books}));

    return {shelves, total, savedIdByTitle};
}

export type ReadingStats = {
    savedCount: number;
    ratedCount: number;
    avgGiven: number | null;
    topGenres: {genre: string; count: number}[];
};

/** Aggregates the user's own activity. Requires an AUTHENTICATED client. */
export async function getReadingStats(
    supabase: SupabaseClient,
    userId: string
): Promise<ReadingStats> {
    const [{data: savedRows}, {data: ratedRows}] = await Promise.all([
        supabase.from('saved_books').select('book_id').eq('user_id', userId),
        supabase.from('ratings').select('book_id,rating').eq('user_id', userId)
    ]);

    const saved = (savedRows as {book_id: string}[] | null) ?? [];
    const rated = (ratedRows as {book_id: string; rating: number}[] | null) ?? [];

    const interactedIds = new Set<string>();
    for (const row of saved) interactedIds.add(String(row.book_id));
    for (const row of rated) interactedIds.add(String(row.book_id));

    let topGenres: {genre: string; count: number}[] = [];
    if (interactedIds.size > 0) {
        const {data: books} = await supabase
            .from('books')
            .select('genre')
            .in('id', Array.from(interactedIds));

        const counts = new Map<string, number>();
        for (const row of (books as {genre: string | null}[] | null) ?? []) {
            const genre = row.genre?.trim();
            if (!genre) continue;
            counts.set(genre, (counts.get(genre) ?? 0) + 1);
        }
        topGenres = Array.from(counts.entries())
            .map(([genre, count]) => ({genre, count}))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }

    return {
        savedCount: saved.length,
        ratedCount: rated.length,
        avgGiven:
            rated.length > 0
                ? Math.round(
                      (rated.reduce((total, row) => total + row.rating, 0) /
                          rated.length) *
                          10,
                  ) / 10
                : null,
        topGenres,
    };
}