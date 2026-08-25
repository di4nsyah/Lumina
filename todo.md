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
| P1-12 | Rating buku | Full-stack | 🔲 | butuh P1-09, P1-11 |
| P1-13 | Onboarding preference selection | Frontend | 🔲 | butuh P1-09 |
| P1-14 | Rekomendasi content-based | Backend | 🔲 | butuh P1-10, P1-13 |
| P1-15 | Deploy ke Vercel | DevOps | 🔲 | |

## Bug/Fix Log (histori — sudah selesai)

| Isu | Root Cause | Fix |
|---|---|---|
| Turbopack stale cache crash | Compiled lama pass prop `books`, `HomeClient` expect `shelves` | Clear `.next` + default `shelves = []` |
| `next.config.ts` parse error | Kode ditempel di luar objek config | File config diperbaiki penuh |
| Folder `component` vs `components` | Salah penamaan | Diperbaiki |

## Phase 2 — Backlog

| Task | Status |
|---|---|
| Collaborative filtering | 🔲 |
| Halaman koleksi user (lanjutan) | 🔲 |
| Fitur engagement/validasi | 🔲 |

## Phase 3 — Backlog

| Task | Status |
|---|---|
| Rekomendasi AI lanjutan | 🔲 |
| Fitur sosial | 🔲 |
| Fitur growth | 🔲 |

## Cara Update File Ini
1. Setiap selesai satu task, ubah status jadi ✅ dan isi kolom Catatan singkat (apa yang dibuat/keputusan penting).
2. Kalau task baru muncul di tengah jalan, tambah baris baru dengan ID lanjutan (mis. `P1-16`) — jangan sisipkan di tengah urutan.
3. Kalau ada task ke-block, ubah status jadi ⛔ dan tulis alasannya di Catatan.
