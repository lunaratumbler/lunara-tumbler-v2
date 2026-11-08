# Design System — Lunara Tumbler

## Arah visual
Minimalis, profesional, elegan, feminin, dan terasa seperti brand lifestyle. Mockup `public/mockup/Kolase E-commerce Tumbler Lunara Pastel.png` menjadi referensi visual utama. Tahap inisialisasi hanya menyiapkan fondasi visual, belum membangun halaman customer lengkap.

## Palet token awal
Token ini menerjemahkan arah mockup dan dapat disempurnakan setelah review desain:

| Token | HEX | Penggunaan |
|---|---|---|
| Ivory | `#FBF7F3` | Latar utama |
| Ivory deep | `#F5ECE7` | Latar sekunder |
| Dusty rose | `#C9827E` | Aksen brand |
| Rose deep | `#9B625F` | Aksen kontras dan teks |
| Beige | `#EAD8CC` | Permukaan sekunder |
| Champagne | `#D8BDA8` | Aksen lembut |
| Sage | `#AAB5A1` | Aksen pendamping |
| Charcoal | `#342A28` | Teks utama |
| Muted | `#796B67` | Teks sekunder |

Token diimplementasikan sebagai CSS variables pada `src/app/globals.css` dan diekspos ke Tailwind v4 melalui `@theme inline`.

## Tipografi
- Heading: serif elegan berbasis Georgia/Times New Roman sebagai fallback sistem.
- Isi dan kontrol: sans-serif berbasis Arial/Helvetica.
- Maksimal dua keluarga font; font eksternal belum ditambahkan.

## Layout dan responsif
- Gunakan ruang kosong, hierarki jelas, dan hero kecil sampai sedang.
- Grid produk konsisten; gambar menjadi fokus kartu.
- Mobile-first; titik acuan CSS: 640px (mobile lebar), 768px (tablet), dan 1024px (desktop).
- Variabel spacing halaman memakai `clamp()`; hindari horizontal overflow.

## Bentuk dan elevation
- Radius kartu awal: 20px; kontrol pill: 999px.
- Shadow lembut dengan opacity rendah, tanpa efek berat.
- Gunakan border tipis bernuansa rose/beige untuk memisahkan permukaan.

## Komponen acuan
Header dan navigasi, hero, kartu produk, badge, swatch warna, galeri, stepper kuantitas, input personalisasi, item keranjang, ringkasan pesanan, tombol WhatsApp, sidebar admin, form, dialog, toast, dan badge status.

## UX dan aksesibilitas
Setiap input perlu label, fokus keyboard harus terlihat, swatch harus memiliki penanda terpilih selain warna, gambar memiliki alt text, serta state hover/focus/disabled/loading/error/empty harus jelas. Ukuran kontrol sentuh harus nyaman.

## Ketentuan tahap berikutnya
Jangan menganggap token ini sebagai persetujuan desain final. Pertahankan bahasa visual mockup dan validasi perubahan desain pada review milestone UI.
