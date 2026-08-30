# Lumina — TODO / Task Tracker

> File ini adalah "memori" project untuk AI agent maupun manusia. Update status setiap kali ada perubahan. **Jangan hapus baris lama** — tandai selesai/batal, biar histori tetap kebaca.

**Legend:** 🔲 Todo · 🔄 In Progress · ✅ Done · ⛔ Blocked · ❌ Cancelled

## Phase 1 — MVP

| ID | Task | Area | Status | Catatan |
|---|---|---|---|---|
| P1-01 | Setup project Next.js + TS + Tailwind | Setup | ✅ | |
| P1-02 | Setup Supabase + koneksi | Backend | ✅ | |
| P1-03 | `googleBooks.ts` wrapper | Backend | ✅ | |
| P1-04 | `bookService.ts` caching layer | Backend | ✅ | termasuk `getBooksByGenre()` |
| P1-05 | Homepage/Discover | Frontend | ✅ | hero, navbar glassmorphism |
| P1-06 | Genre shelves (horizontal scroll) | Frontend | ✅ | minimal 2 buku/shelf |
| P1-07 | Search page redesign | Frontend | ✅ | RESELESAI 2026-08-25: skeleton loading, empty state (belum cari / no hasil), hasil typed penuh, inline feedback per-card via `SaveButton` (spinner → badge Saved/error) |
| P1-08 | Shared chrome (Header/Footer/Shell) | Frontend | ✅ | DISELESAIKAN 2026-08-25: ekstraksi `SiteHeader`/`SiteFooter`, dipakai Home + Search |
| P1-09 | Auth (sign up/sign in) | Backend | ✅ | @supabase/ssr cookie session + proxy guard (`/onboarding`,`/library`,`/account` → redirect `/sign-in?next=`), `/sign-in`,`/sign-up`,`/auth/callback`; smoke test 200/307 OK; middleware→proxy codemod Next16 |
| P1-10 | Save/bookmark buku ke koleksi | Full-stack | ✅ | tabel `saved_books` + RLS dibuat via SQL editor; service `savedBooks.ts`; batch saved-state detection; tombol save di Search redirect ke login kalau anon. E2E klik manual menyusul verifikasi user |
| P1-11 | Book detail page | Frontend | ✅ | `/book/[id]` dual-source: uuid → Supabase cache, else Google volume API; loading.tsx skeleton; styled not-found panel; SaveButton terintegrasi. Live test: cached-row path 200 markup-ok; google-path dibatasi kuota API harian (429) tapi kode symmetric |
| P1-12 | Rating buku | Full-stack | ✅ | policies+unique index (user_id,book_id) via SQL editor; `RatingSection` bintang 1-5 upsert onConflict, avg+jumlah live, anon → redirect sign-in. Render verified; klik-rate E2E menyusul manual test user |
| P1-13 | Onboarding preference selection | Frontend | ✅ | `/onboarding` (dilindungi proxy): pilih ≥3 dari 18 genre → upsert `user_profiles` (onConflict id), `onboarded_at` terisi saat continue, skippable tanpa menandai selesai, preselect profil lama; anon → redirect sign-in verified |
| P1-14 | Rekomendasi content-based | Backend | ✅ | `getRecommendedBooks()` di bookService (server cookie client → RLS-aware): basis `activity` (saved+rated genre) > `preferences` (onboarding) > `fallback` (recent); shelf "For You" di Home dengan subtitle sesuai basis; exclude buku yang sudah diinteraksi; dedupe by title |
| P1-15 | Deploy ke Vercel | DevOps | 🔲 | |

## Phase 1.5 — Indie Bookshop Redesign (2026-08-25, spec: `redesign.md`)

| ID | Task | Status | Catatan |
|---|---|---|---|
| R-01 | Token layer + Fraunces/Work Sans + text-only Wordmark | ✅ | `globals.css` @theme inline; banned patterns enforced |
| R-02 | Decor primitives (Reveal/Tape/TornEdge/Squiggle/Botanical) | ✅ | semua aria-hidden, transform/opacity only |
| R-03 | UI primitives (Button/StampBadge/SectionHeading/Input/EmptyState/Skeleton) | ✅ | `src/components/ui/` |
| R-04 | Header/footer chrome | ✅ | nav jadi Discover/Library/Dashboard (Community dihapus), torn-seam footer |
| R-05 | Home reskin | ✅ | editorial masthead + taped staff picks + shelf hairlines; hero search → /search?q= wired |
| R-06 | Auth reskin | ✅ | taped cards + botanical sprigs |
| R-07 | Search reskin | ✅ | server-driven via ?q= URL (SearchForm client island); SaveButton stamp-thunk + optimistic state |
| R-08 | Book detail reskin | ✅ | serif reading column, stamp-frame cover, rating thunk |
| R-09 | Onboarding reskin | ✅ | sticker-sheet genre stamps |
| R-10 | Library page (BARU) | ✅ | `listSavedCollection()`, genre shelves incl. single-book, unsave button |
| R-11 | Dashboard page (BARU) | ✅ | ticket-stub stats + taste bars dari aktivitas user |
| R-12 | Legal pages + 404 | ✅ | privacy/terms/contact honest content; torn 404 |

## Bug/Fix Log (histori — sudah selesai)

| Isu | Root Cause | Fix |
|---|---|---|
| Turbopack stale cache crash | Compiled lama pass prop `books`, `HomeClient` expect `shelves` | Clear `.next` + default `shelves = []` |
| `next.config.ts` parse error | Kode ditempel di luar objek config | File config diperbaiki penuh |
| Folder `component` vs `components` | Salah penamaan | Diperbaiki |

## Phase 2 — Backlog

| Task | Status |
|---|---|
| Collaborative filtering | 🔄 |
| Halaman koleksi user (lanjutan) | 🔄 |
| Fitur engagement/validasi | 🔄 |

## Phase 3 — Backlog

| Task | Status |
|---|---|
| Rekomendasi AI lanjutan | 🔄 |
| Fitur sosial | 🔄 |
| Fitur growth | 🔄 |

## Cara Update File Ini
1. Setiap selesai satu task, ubah status jadi ✅ dan isi kolom Catatan singkat (apa yang dibuat/keputusan penting).
2. Kalau task baru muncul di tengah jalan, tambah baris baru dengan ID lanjutan (mis. `P1-16`) — jangan sisipkan di tengah urutan.
3. Kalau ada task ke-block, ubah status jadi ⛔ dan tulis alasannya di Catatan.
