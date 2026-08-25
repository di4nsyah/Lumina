# Lumina — Architecture & Implementation Plan

## 1. Tech Stack
| Layer | Pilihan |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS |
| Backend/DB | Supabase (Postgres + Auth) |
| Sumber data buku | Google Books API |
| Hosting | Vercel |
| Icon | lucide-react |

## 2. Struktur Proyek (saat ini)
```
src/
  app/
    page.tsx              # Home/Discover (Server Component)
    search/
      page.tsx             # Search page
  components/
    SiteHeader.tsx
    SiteFooter.tsx
    PageShell.tsx
    HomeClient.tsx          # Client component untuk Home (hero interaktif, genre shelves)
    ...
  lib/
    bookService.ts          # Caching layer ke Supabase
    googleBooks.ts           # Wrapper Google Books API
next.config.ts
```

## 3. Prinsip Arsitektur
- Default ke **Server Component**; Client Component (`"use client"`) hanya untuk bagian yang butuh interaktivitas (hero cursor glow, save button state, dst).
- `export const dynamic = "force-dynamic"` di route Home — **wajib**, supaya Next.js tidak cache fetch Supabase.
- `bookService.ts` adalah satu-satunya pintu ke Supabase untuk data buku — komponen tidak query Supabase langsung.
- `googleBooks.ts` adalah satu-satunya pintu ke Google Books API.
- Semua kode **fully-typed** — no `any`.
- `next.config.ts` butuh `images.remotePatterns` untuk `books.google.com` supaya cover buku bisa dirender `next/image`.

## 4. Skema Database (Supabase) — usulan, perlu diverifikasi
> Sebagian tabel di bawah sudah ada (`books` dengan kolom `genre`), sebagian usulan untuk fitur yang belum dibangun. Sesuaikan dengan schema aktual sebelum eksekusi migration apa pun.

- `books` — cache dari Google Books API. Kolom: `id`, `google_books_id`, `title`, `authors`, `genre`, `thumbnail_url`, `created_at`.
- `user_profiles` — data tambahan user (preferensi genre dari onboarding), relasi 1-1 ke `auth.users`.
- `saved_books` — relasi many-to-many user ↔ books (koleksi tersimpan). Kolom: `user_id`, `book_id`, `created_at`.
- `ratings` — rating user per buku. Kolom: `user_id`, `book_id`, `rating` (1-5), `created_at`.

## 5. Pemecahan Kerja — Phase 1 (MVP)
Setiap task punya kriteria selesai (Definition of Done) yang harus dipenuhi sebelum ditandai ✅ di `todo.md`.

### P1-01 — Setup project
**DoD:** Next.js + TS + Tailwind jalan lokal, ESLint tanpa error, konvensi folder `src/app`, `src/components`, `src/lib` konsisten.

### P1-02 — Setup Supabase
**DoD:** Project Supabase aktif, env var (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) terpasang di `.env.local` dan Vercel, koneksi berhasil di-test dari server component.

### P1-03 — `googleBooks.ts`
**DoD:** Fungsi search & fetch-by-id terpisah, response ter-type, error handling untuk request gagal/rate limit. *(Selesai)*

### P1-04 — `bookService.ts`
**DoD:** Fungsi caching read-through ke Supabase, termasuk `getBooksByGenre()`. *(Selesai)*

### P1-05 — Homepage/Discover
**DoD:** Server/Client split rapi, hero dengan ambient glow cursor-reactive, navbar glassmorphism, tidak ada layout shift signifikan. *(Selesai)*

### P1-06 — Genre shelves
**DoD:** Shelf horizontal-scroll per genre, shelf hanya muncul kalau ≥2 buku di genre tsb, kolom `genre` tersedia di Supabase. *(Selesai)*

### P1-07 — Search page
**DoD:** Skeleton loading, empty state, hasil ter-type penuh (no `any[]`), simpan buku pakai inline feedback (bukan `alert()`), per-card saving state (spinner → badge "Saved" hijau / pesan error). *(Selesai)*

### P1-08 — Shared chrome
**DoD:** `SiteHeader`, `SiteFooter`, `PageShell` dipakai konsisten di semua route, tidak ada duplikasi markup header/footer. *(Selesai)*

### P1-09 — Auth (sign up/sign in)
**DoD:** User bisa daftar & login via Supabase Auth (email/password minimal), session persist, halaman protected redirect ke login kalau belum auth.

### P1-10 — Save/bookmark buku
**DoD:** User login bisa simpan/hapus buku dari koleksi, state tersimpan di tabel `saved_books`, UI reflect status tersimpan secara real-time (bukan cuma optimistic tanpa sync).

### P1-11 — Book detail page
**DoD:** Route dinamis `/book/[id]`, tampilkan info lengkap (cover, deskripsi, penulis, genre), tombol save, rata-rata rating, loading & not-found state.

### P1-12 — Rating buku
**DoD:** User login bisa kasih rating 1-5 di detail page, tersimpan di `ratings`, rata-rata ter-update, satu user hanya bisa 1 rating aktif per buku (upsert).

### P1-13 — Onboarding preference
**DoD:** Flow setelah sign-up pertama kali: pilih ≥3 genre favorit, tersimpan ke `user_profiles`, user diarahkan ke Home setelah selesai, bisa di-skip tapi ditandai belum lengkap.

### P1-14 — Rekomendasi content-based
**DoD:** Fungsi rekomendasi berbasis genre favorit (onboarding) + histori save/rating, tampil sebagai shelf "Untuk Kamu" di Home, fallback ke populer/random kalau data user belum cukup.

### P1-15 — Deploy ke Vercel
**DoD:** Deploy production sukses, semua env var terpasang di Vercel, custom domain (kalau ada) aktif, build tanpa warning kritis.

## 6. Phase 2 & 3 (ringkas — detail menyusul saat mulai dikerjakan)
- **Phase 2:** collaborative filtering, halaman koleksi user lengkap, fitur engagement (mis. "sedang dibaca", progress tracking).
- **Phase 3:** rekomendasi AI lanjutan (embedding-based), fitur sosial (follow, share), growth (referral, notifikasi).

## 7. Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # hanya operasi server-side privileged, jangan expose ke client
GOOGLE_BOOKS_API_KEY=            # kalau dipakai untuk quota lebih tinggi
```

## 8. Known Gotchas (dari histori project)
- Home route wajib `force-dynamic`, kalau tidak Supabase fetch ke-cache dan data jadi basi.
- `next.config.ts` — pastikan `remotePatterns` untuk `books.google.com` ada **di dalam** objek config, jangan ditempel di luar (pernah bikin parse error).
- Cache `.next`/Turbopack bisa nyangkut prop lama (mis. komponen expect `shelves` tapi versi lama masih pass `books`) — kalau ada crash aneh setelah refactor, coba clear `.next` dulu.
- Genre shelf minimal 2 buku, jangan render shelf isi 1 buku.
- `isRecentlyAdded()` badge "New" harus dari `created_at` asli, jangan fabricate flag.
- Perhatikan penamaan folder `components` (bukan `component`) — pernah salah ketik.
