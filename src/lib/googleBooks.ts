function extractPrimaryGenre(categories?: string[]): string {
    if (!categories || categories.length === 0) return '';
    const parts = categories[0].split('/').map((part) => part.trim());
    return parts[1] || parts[0] || '';
}

export async function searchGoogleBooks(query: string) {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        const targetUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
        
        console.log("MENGHUBUNGI URL:", targetUrl);

        const res = await fetch(targetUrl);
        const data = await res.json();

        return data.items?.map((item: any) => ({
            google_id: item.id,
            title: item.volumeInfo.title || 'Unknown Title',
            author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
            cover_url: item.volumeInfo.imageLinks?.thumbnail || '',
            description: item.volumeInfo.description || '',
            genre: extractPrimaryGenre(item.volumeInfo.categories),
        })) || [];
    } catch (error) {
        console.error('Error fetching Google Books data:', error);
        return [];
    }
}