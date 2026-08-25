# Lumina — Product Requirements Document (PRD)

## 1. Ringkasan
Lumina (LuminaBooks) adalah aplikasi discovery & rekomendasi buku untuk pembaca umum lintas genre. Solo side project dengan target MVP cepat, fokus kuat di UI/UX, dan rekomendasi yang nantinya digerakkan algoritma/AI.

## 2. Masalah yang Diselesaikan
- Terlalu banyak pilihan buku, susah menemukan yang relevan dengan selera personal.
- Bestseller list / rak toko buku itu generic, tidak personal.
- Pengalaman discovery buku di kebanyakan app terasa membosankan (list flat, tanpa konteks).
- Pembaca belum punya satu tempat untuk: cari buku → simpan yang menarik → dapat rekomendasi lanjutan berdasarkan itu.

## 3. Target Pengguna
- General readers, semua genre (bukan niche satu genre tertentu).
- Orang yang suka menjelajah ("discover") buku baru, bukan cuma cari judul spesifik.
- Belum tentu power-user teknologi — UX harus intuitif sejak awal (onboarding, empty state, feedback yang jelas).

## 4. Kenapa Dibangun (Why)
- Personal/side project — validasi ide sekaligus latihan membangun product end-to-end.
- UI/UX jadi pembeda utama dibanding "app buku generic".
- Jangka panjang: rekomendasi berbasis AI/algoritma jadi nilai jual utama, bukan sekadar katalog.

## 5. Fitur Inti (MVP — Phase 1)
1. **Discover/Home** — homepage dengan genre shelves horizontal-scroll, hero section.
2. **Search** — cari buku via Google Books API, ada loading & empty state.
3. **Simpan buku** — user bisa save buku ke koleksi pribadi (butuh auth).
4. **Auth** — sign up / sign in (Supabase Auth).
5. **Book detail page** — info lengkap + rating dari user.
6. **Onboarding preference** — user pilih genre favorit saat pertama kali pakai app.
7. **Rekomendasi dasar (content-based)** — berbasis genre/preferensi yang disimpan user.

## 6. Di Luar Scope (Non-Goals untuk MVP)
- Social features: follow user lain, comment, share ke feed.
- Collaborative filtering & rekomendasi AI lanjutan (masuk Phase 3).
- Book club / reading challenge / gamifikasi.
- Native mobile app (mobile web cukup untuk MVP).
- E-book reading / integrasi pembelian buku.
- Multi-bahasa konten (UI boleh ID, konten buku ikut apa adanya dari Google Books).
- Review panjang/threaded discussion (rating angka dulu untuk MVP).

## 7. Roadmap Level Tinggi
- **Phase 1 (MVP):** setup DB, core pages, content-based filtering — *in progress*.
- **Phase 2:** collaborative filtering, koleksi user lanjutan, fitur engagement/validasi.
- **Phase 3:** rekomendasi AI lanjutan, fitur sosial, growth.

## 8. Definisi "MVP Selesai"
MVP dianggap selesai kalau alur ini jalan end-to-end tanpa error:
**user mendaftar → pilih preferensi genre → cari/discover buku → simpan buku → beri rating → lihat rekomendasi dasar berdasarkan aktivitasnya.**
