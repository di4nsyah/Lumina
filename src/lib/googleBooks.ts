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

export async function searchGoogleBooks(query: string): Promise<GoogleBook[]> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        const targetUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;

        const res = await fetch(targetUrl);

        if (!res.ok) {
            console.error('Google Books API error:', res.status, res.statusText);
            return [];
        }

        const data = (await res.json()) as {items?: GoogleVolume[]};

        return (data.items ?? []).map((item) => ({
            google_id: item.id,
            title: item.volumeInfo?.title || 'Unknown Title',
            author: item.volumeInfo?.authors?.join(', ') || 'Unknown Author',
            cover_url: item.volumeInfo?.imageLinks?.thumbnail || '',
            description: item.volumeInfo?.description || '',
            genre: extractPrimaryGenre(item.volumeInfo?.categories),
        }));
    } catch (error) {
        console.error('Error fetching Google Books data:', error);
        return [];
    }
}
