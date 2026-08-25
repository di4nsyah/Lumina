'use client';

import {useState} from 'react';
import {searchGoogleBooks, type GoogleBook} from '@/lib/googleBooks';
import {getOrSaveBook} from '@/lib/bookService';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<GoogleBook[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        const results = await searchGoogleBooks(query);
        setBooks(results);
        setLoading(false);
    };

    const handleSaveToCache = async (book: GoogleBook) => {
    const saved = await getOrSaveBook({
      title: book.title,
      author: book.author,
      cover_url: book.cover_url,
    });
    if (saved) {
      alert(`Berhasil menyimpan/cache buku "${saved.title}" ke Supabase!`);
    } else {
      alert('Gagal menyimpan buku.');
    }
  };

    return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cari & Cache Buku</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul buku..."
          className="border p-2 rounded flex-grow text-white"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Mencari...' : 'Cari'}
        </button>
      </form>

      <div className="space-y-4">
        {books.map((book, index) => (
          <div key={index} className="border p-4 rounded flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              {book.cover_url && <img src={book.cover_url} alt={book.title} className="w-12 h-16 object-cover" />}
              <div>
                <h2 className="font-semibold">{book.title}</h2>
                <p className="text-sm text-white">{book.author}</p>
              </div>
            </div>
            <button
              onClick={() => handleSaveToCache(book)}
              className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
            >
              Cache ke DB
            </button>
          </div>
        ))}
      </div>
    </main>
    );
}