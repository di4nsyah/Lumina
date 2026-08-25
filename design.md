# Lumina — Design System & UI Guidelines

> Rujukan visual & voice untuk semua UI yang dibangun di Lumina. Tujuannya: setiap komponen baru terasa seperti bagian dari produk yang sama, bukan tempelan gaya yang beda-beda tiap sesi ngoding.

## 1. Filosofi Desain
- **Arah:** editorial minimalist, hangat — bukan flat/generic SaaS look.
- **Signature element:** hero dengan ambient glow yang reaktif ke cursor. Ini elemen paling diingat dari Lumina — jaga dia yang jadi "titik berani", area lain tetap tenang & disiplin.
- **Presisi > dekorasi.** Karena arahnya minimal, kualitas terasa dari detail spacing, konsistensi type, dan kehalusan transisi — bukan dari menambah elemen.

## 2. Design Tokens

### Warna
Base: skala warna Tailwind (`amber` & `orange` sebagai accent, `stone`/`neutral` sebagai base). Kalau `tailwind.config.ts` sudah override scale ini, jadikan config sebagai sumber kebenaran, dan update tabel ini biar tetap akurat.

| Token | Peran | Contoh class |
|---|---|---|
| `amber-500` / `orange-600` | Primary accent — CTA, active state, hero glow | `bg-amber-500`, `text-orange-600` |
| `stone-50` | Background utama (light, terasa seperti kertas) | `bg-stone-50` |
| `stone-900` | Teks utama | `text-stone-900` |
| `emerald-500` | Success (badge "Saved") | `bg-emerald-500` |
| `red-500` | Error / gagal simpan | `text-red-500` |

### Tipografi
> Belum dikunci eksplisit di kode — perlu diverifikasi dari font yang sudah kepakai di `layout.tsx`/`globals.css`. Kalau belum ada keputusan final, arahnya:
- **Display face** (hero, headline): satu typeface berkarakter, dipakai terbatas — bukan default sans yang sama dengan body.
- **Body face**: netral, nyaman dibaca panjang (deskripsi buku, UI copy).
- **Type scale**: definisikan minimal heading 1–3, body, caption secara eksplisit — jangan andalkan default browser scale.

### Spacing & Radius
- Ikuti skala default Tailwind (basis 4px) kecuali ada alasan spesifik.
- Radius card buku & container utama konsisten (mis. `rounded-2xl`); badge/pill pakai `rounded-full`. Jangan campur radius berbeda untuk elemen sejenis.

## 3. Komponen Kunci & Pola

### Navbar (glassmorphism)
`SiteHeader` — backdrop-blur, background semi-transparan, border tipis, posisi sticky. Dipakai identik di semua halaman, tidak ada varian per-page.

### Hero (cursor-reactive ambient glow)
Signature Lumina. Motion di sini disengaja: reveal saat load + micro-interaction ikut cursor. Karena ini sudah jadi "momen berani"-nya halaman, jangan tambah animasi besar lain yang bersaing di halaman yang sama.

### Genre Shelves
Horizontal-scroll per genre. Card berisi cover, judul, penulis (info minimal, jangan padat). Shelf hanya muncul kalau ≥2 buku di genre tsb (lihat `architecture.md`).

### State: Loading / Empty / Error / Success
- **Loading:** skeleton yang mengikuti bentuk card asli, bukan spinner polos di tengah layar.
- **Empty:** bukan sekadar "tidak ada data" — jadikan ajakan bertindak, mis. *"Belum ada buku tersimpan — mulai jelajahi rak di bawah."*
- **Save feedback:** inline per-card (spinner → badge hijau "Tersimpan" / pesan error singkat). Tidak pernah pakai `alert()`/`confirm()`.
- **Error:** jelaskan apa yang terjadi + langkah berikutnya, nada lugas — bukan generic "Something went wrong" dan bukan minta maaf berlebihan.

## 4. Voice & Microcopy
- Pakai kalimat aktif, sebut aksi yang user lakukan: **"Simpan buku"**, bukan "Submit request".
- Konsistensi istilah sepanjang alur — tombol "Simpan" → hasilnya badge **"Tersimpan"** (bukan "Saved" di satu tempat dan "Disimpan" di tempat lain).
- Label, contoh, dan pesan error masing-masing punya satu fungsi — jangan satu elemen teks merangkap dua peran sekaligus.

## 5. Motion & Interaction
- Motion dipakai untuk momen yang berarti (hero glow, hover card, transisi shelf) — bukan hiasan acak di tiap elemen.
- Hormati `prefers-reduced-motion` di semua animasi, terutama hero glow.
- Kalau ragu apakah suatu animasi menambah nilai atau cuma menambah "kesan AI-generated template" — lebih baik dikurangi.

## 6. Aksesibilitas (Quality Floor — wajib, tidak opsional)
- Kontras teks vs background aman, termasuk teks di atas navbar glassmorphism/gradient hero.
- Fokus keyboard terlihat jelas di semua elemen interaktif (link, tombol save, kartu buku).
- Responsif penuh sampai layar mobile kecil.
- `prefers-reduced-motion` dihormati tanpa mematikan fungsi, cuma mengurangi animasinya.

## 7. Cara Pakai File Ini
- Cek file ini dulu sebelum bikin komponen/halaman baru — kalau pola atau token yang dibutuhkan sudah ada di sini, pakai, jangan bikin varian baru.
- Kalau butuh token atau pola baru, tambahkan ke file ini setelah dipakai, supaya dokumen tetap jadi sumber kebenaran tunggal.
- Dipakai berpasangan dengan skill **"UI/UX Consistency Check"** di `skill.md`, dan jadi acuan saat cek Definition of Done di `workflow.md`.
