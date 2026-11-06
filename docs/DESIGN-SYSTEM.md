# Design System — Lunara Tumbler

## Arah visual
Minimalis, profesional, elegan, feminin, dan terasa seperti brand lifestyle. Hindari tampilan template e-commerce generik yang terlalu ramai.

## Palet awal
Warna berikut adalah arah visual, bukan token final yang tidak boleh disesuaikan:
- Ivory/off-white: latar utama.
- Beige/champagne: permukaan sekunder dan aksen lembut.
- Dusty rose/soft pink: aksen brand.
- Sage: aksen pendamping.
- Charcoal/dark brown: teks utama.

Tetapkan nilai HEX final dalam CSS variables setelah mockup disetujui.

## Tipografi
- Gunakan tipografi yang bersih dan mudah dibaca.
- Heading dapat memakai serif elegan jika tetap terbaca.
- Body dan kontrol UI menggunakan sans-serif yang jelas.
- Batasi jumlah keluarga font.

## Layout
- Banyak ruang kosong dan hierarki visual yang jelas.
- Hero/banner kecil hingga sedang, bukan memenuhi hampir seluruh layar.
- Grid produk konsisten.
- Kartu produk sederhana, gambar menjadi fokus.
- Gunakan radius, border, dan shadow secara halus dan konsisten.

## Komponen penting
- Header dan navigasi.
- Hero/banner.
- Product card.
- Badge New/Best Seller.
- Circular color swatch.
- Product gallery.
- Quantity stepper.
- Personalization input.
- Cart item dan order summary.
- Tombol WhatsApp.
- Admin sidebar, tabel, form, dialog konfirmasi, toast, dan status badge.

## Responsif
- Prioritaskan pengalaman mobile.
- Navigasi, swatch, tombol, dan input harus mudah disentuh.
- Grid menyesuaikan lebar layar.
- Hindari horizontal overflow.

## UX dan aksesibilitas
- Semua input memiliki label.
- Status terpilih pada swatch harus terlihat selain hanya perubahan warna.
- Tombol memiliki state hover, focus, disabled, dan loading.
- Gambar memiliki alt text.
- Pesan error menjelaskan cara memperbaiki input.
- Konfirmasi sebelum aksi hapus yang berdampak.

## Konsistensi
Simpan token warna, font, spacing, radius, shadow, dan ukuran komponen sebagai design tokens. Jangan menyebarkan nilai acak di banyak komponen.


## Panel admin responsif
Panel admin wajib mendukung smartphone, tablet, dan desktop dengan seluruh fungsi tetap tersedia. Pada smartphone, sidebar berubah menjadi drawer/hamburger; form menjadi satu kolom; tabel menggunakan scroll di kontainernya atau kartu; dialog menyesuaikan viewport; dan kontrol memiliki area sentuh yang nyaman. Tidak boleh ada aksi penting yang hanya muncul saat hover. Ikuti kriteria rinci pada `RESPONSIVE-ADMIN.md`.
