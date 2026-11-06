# Roadmap Pengembangan

Setiap milestone harus selesai, diuji, dan direview sebelum milestone berikutnya dimulai.

| Milestone | Ruang lingkup | Kriteria selesai |
|---|---|---|
| 1. Setup | Next.js, TypeScript, Tailwind, struktur folder, Git, dokumen, konfigurasi dasar | App berjalan lokal; lint/typecheck/build berhasil; `.env.example` tersedia |
| 2. UI customer | Header, beranda, banner, katalog, kartu, detail, swatch, personalisasi, keranjang, footer dengan mock data | Responsif; sesuai design system; tidak ada link admin; state loading/empty/error yang relevan |
| 3. Database & produk | Supabase schema, RLS, storage, kategori, produk, warna, foto, CRUD admin | CRUD berfungsi; akses publik tidak dapat membaca HPP; kebijakan RLS diuji |
| 4. Keranjang & WhatsApp | Persistensi Local Storage, kuantitas, personalisasi, kalkulasi, pesan WhatsApp | Perhitungan tervalidasi; item qty nol terhapus; pesan WhatsApp lengkap dan ter-encode |
| 5. Pesanan admin | Input pesanan manual, multi-item, nomor unik, status, histori | Pesanan tersimpan; snapshot harga/HPP benar; status dapat dikelola |
| 6. Laporan | Penjualan, HPP, laba kotor, transaksi, ringkasan harian/bulanan | Angka dapat direkonsiliasi dengan pesanan selesai sesuai aturan laporan |
| 7. Pengelolaan website | Banner, produk unggulan/terbaru, informasi brand, pengaturan WhatsApp/personalisasi | Perubahan admin tampil di website publik |
| 8. QA & deployment Netlify | Pengujian fungsional, mobile, keamanan, database, deployment Netlify | Checklist QA lulus; backup dan env produksi siap; deployment Netlify hanya setelah persetujuan pemilik |

## Aturan review
- Codex tidak boleh mengerjakan milestone berikutnya tanpa persetujuan.
- Setiap laporan milestone harus menyertakan file berubah, perintah test yang dijalankan, hasilnya, dan keterbatasan yang diketahui.
- Deployment produksi membutuhkan persetujuan eksplisit.

Panel customer dan admin wajib diuji pada smartphone, tablet, dan desktop. Seluruh fungsi admin harus dapat digunakan melalui smartphone.
