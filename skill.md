# Lumina — Skill Library (Reusable Prompt Patterns)

> Kumpulan pola prompt yang sering dipakai berulang di project ini. Panggil dengan menyebut nama skill-nya, misal: *"Jalankan skill Code Review untuk `bookService.ts`"*.

## 1. Code Review
**Kapan dipakai:** Sebelum merge/anggap task selesai, atau saat butuh second opinion atas kode yang baru ditulis.
**Prompt:**
```
Review kode di [file/folder] dengan checklist:
- Type safety (no `any`, interface/type jelas)
- Konsistensi dengan pola project (Server vs Client component, lewat bookService.ts bukan query langsung)
- Error handling & edge case (loading, empty, error state)
- Aksesibilitas dasar (alt text, kontras, keyboard nav)
- Potensi bug/race condition
Beri temuan sebagai list, urutkan dari severity tertinggi.
```

## 2. Refactor
**Kapan dipakai:** Kode sudah jalan tapi berantakan/berulang, atau butuh dipecah jadi komponen lebih kecil.
**Prompt:**
```
Refactor [file/komponen] tanpa mengubah behavior/API publik.
Tujuan: [sebutkan tujuan spesifik, mis. "pisah logic fetching dari UI"]
Setelah refactor: jalankan dev server, pastikan tidak ada regression, dan ringkas apa yang berubah.
```

## 3. Testing
**Kapan dipakai:** Setelah fitur baru selesai, sebelum ditandai Done di todo.md.
**Prompt:**
```
Buat test untuk [fitur/fungsi] mencakup:
- Happy path
- Edge case (data kosong, API gagal, user belum login)
- Type checking lolos tanpa `any`
Kalau belum ada testing framework di project, tanya dulu sebelum install dependency baru.
```

## 4. Security Review
**Kapan dipakai:** Sebelum fitur yang menyentuh auth, data user, atau Supabase RLS policy ditandai selesai.
**Prompt:**
```
Review [file/fitur] dari sisi security:
- Apakah query Supabase melewati RLS dengan benar (bukan pakai service role di client)?
- Apakah ada data sensitif ter-expose ke client (env var, service key)?
- Apakah input user divalidasi sebelum masuk ke DB/API?
- Apakah rate limiting/abuse case dipertimbangkan (mis. spam rating)?
Laporkan sebagai list temuan + rekomendasi fix.
```

## 5. Bug Investigation / Debugging
**Kapan dipakai:** Ada error/behavior aneh yang perlu diinvestigasi sebelum di-fix.
**Prompt:**
```
Debug isu berikut: [deskripsi bug + error message/screenshot kalau ada]
Langkah:
1. Reproduce dulu, konfirmasi kondisi munculnya bug
2. Cari root cause (bukan cuma gejala)
3. Usulkan fix minimal, jelaskan trade-off kalau ada
4. Setelah fix, catat root cause + fix di todo.md bagian "Bug/Fix Log"
```

## 6. New Feature Scaffolding
**Kapan dipakai:** Mulai fitur baru dari nol sesuai breakdown di architecture.md.
**Prompt:**
```
Scaffold fitur [nama task, mis. P1-11 Book detail page] sesuai architecture.md:
- Ikuti struktur folder existing (src/app, src/components, src/lib)
- Server Component default, Client Component hanya kalau perlu interaktivitas
- Fully typed, no `any`
- Sertakan loading state, empty state, error state
Setelah selesai, cek Definition of Done task ini di architecture.md sebelum minta ditandai Done.
```

## 7. Database Migration (Supabase)
**Kapan dipakai:** Butuh ubah/tambah tabel atau kolom di Supabase.
**Prompt:**
```
Susun migration untuk: [perubahan yang diinginkan]
- Tulis SQL migration-nya, jangan langsung dieksekusi — tampilkan dulu untuk approval
- Sebutkan dampak ke kode existing (bookService.ts, komponen yang query tabel terkait)
- Sertakan rollback plan kalau memungkinkan
```
*(Catatan: perubahan skema DB masuk kategori "harus minta izin dulu" — lihat workflow.md)*

## 8. UI/UX Consistency Check
**Kapan dipakai:** Setelah bikin komponen/halaman baru, sebelum ditandai Done.
**Prompt:**
```
Cek konsistensi UI [komponen/halaman] terhadap aesthetic project:
- Palet amber/orange, editorial minimalist
- Glassmorphism di navbar/elemen terkait
- Skeleton loading state, empty state, inline feedback (bukan alert())
- Konsisten dengan SiteHeader/SiteFooter/PageShell
Kalau ada penyimpangan, jelaskan alasannya sebelum diterapkan.
```
