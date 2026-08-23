export async function searchGoogleBooks(query: string) {
    try {
        // Kita pakai cara langsung dulu untuk testing
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        const targetUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
        
        // PENTING: Ini akan memunculkan teks di tab Console browser Anda
        console.log("🔥 MENGHUBUNGI URL:", targetUrl);

        const res = await fetch(targetUrl);
        const data = await res.json();

        return data.items?.map((item: any) => ({
            google_id: item.id,
            title: item.volumeInfo.title || 'Unknown Title',
            author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
            cover_url: item.volumeInfo.imageLinks?.thumbnail || '',
            description: item.volumeInfo.description || '',
        })) || [];
    } catch (error) {
        console.error('Error fetching Google Books data:', error);
        return [];
    }
}