function extractPrimaryGenre(categories?: string[]): string {
    if (!categories || categories.length === 0) return '';
    const parts = categories[0].split('/').map((part) => part.trim());
    return parts[1] || parts[0] || '';
}

export type GoogleBook = {
    google_id: string;
    title: string;
    author: string;
    cover_url: string;
    description: string;
    genre: string;
};

type GoogleVolumeInfo = {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {thumbnail?: string};
    categories?: string[];
};

type GoogleVolume = {
    id: string;
    volumeInfo?: GoogleVolumeInfo;
};

export type SearchOutcome =
    | {ok: true; books: GoogleBook[]}
    | {ok: false; reason: 'quota' | 'unavailable'};

/**
 * Daily-quota exhaustion (HTTP 429) is an EXPECTED state for a free API key,
 * so it degrades quietly instead of spamming error logs.
 */
export async function searchGoogleBooks(query: string): Promise<SearchOutcome> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        const targetUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;

        const res = await fetch(targetUrl);

        if (!res.ok) {
            if (res.status === 429) {
                return {ok: false, reason: 'quota'};
            }
            console.warn('Google Books API issue:', res.status);
            return {ok: false, reason: 'unavailable'};
        }

        const data = (await res.json()) as {items?: GoogleVolume[]};

        const books = (data.items ?? []).map((item) => ({
            google_id: item.id,
            title: item.volumeInfo?.title || 'Unknown Title',
            author: item.volumeInfo?.authors?.join(', ') || 'Unknown Author',
            cover_url: item.volumeInfo?.imageLinks?.thumbnail || '',
            description: item.volumeInfo?.description || '',
            genre: extractPrimaryGenre(item.volumeInfo?.categories),
        }));
        return {ok: true, books};
    } catch (error) {
        console.warn('Error fetching Google Books data:', error);
        return {ok: false, reason: 'unavailable'};
    }
}

export async function getBookById(googleId: string): Promise<GoogleBook | null> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        const targetUrl = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(googleId)}?key=${apiKey}`;

        const res = await fetch(targetUrl);

        if (!res.ok) {
            // Quota exhaustion and lookup misses are normal states here.
            if (res.status !== 429) {
                console.warn('Google Books API issue:', res.status);
            }
            return null;
        }

        const item = (await res.json()) as GoogleVolume;

        return {
            google_id: item.id,
            title: item.volumeInfo?.title || 'Unknown Title',
            author: item.volumeInfo?.authors?.join(', ') || 'Unknown Author',
            cover_url: item.volumeInfo?.imageLinks?.thumbnail || '',
            description: item.volumeInfo?.description || '',
            genre: extractPrimaryGenre(item.volumeInfo?.categories),
        };
    } catch (error) {
        console.warn('Error fetching Google Books detail:', error);
        return null;
    }
}
