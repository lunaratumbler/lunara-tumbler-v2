# Development Roadmap — Lunara Tumbler

Milestone dikerjakan berurutan. Hentikan pekerjaan setelah setiap milestone untuk review; jangan mulai milestone berikutnya tanpa persetujuan.

| Tahap | Lingkup | Kriteria selesai |
|---|---|---|
| 1. Project initialization | Next.js App Router, TypeScript, Tailwind, ESLint, Netlify build config, design tokens, dokumentasi | Aplikasi lokal berjalan; lint dan build lulus; mockup/dokumen lama terjaga |
| 2. UI customer | Beranda, katalog, detail, navigasi, komponen kartu dan footer dengan data mock | Mengikuti mockup, responsif, tanpa tautan admin, state dasar tersedia |
| 3. Supabase dan katalog admin | Auth admin, skema/RLS/Storage yang direview, kategori, produk, warna, foto, CRUD | Akses admin terlindungi; akses publik tidak dapat membaca data HPP |
| 4. Keranjang dan WhatsApp | Local Storage, kuantitas, personalisasi, harga, pesan WhatsApp | Kuantitas nol menghapus item; perhitungan dan pesan diverifikasi |
| 5. Pesanan admin | Pesanan manual multi-item, nomor unik, snapshot harga, status dan histori | Pesanan aman tersimpan dan dapat dikelola admin |
| 6. Laporan | Penjualan, HPP, laba kotor, transaksi, ringkasan periode | Angka dapat direkonsiliasi dengan aturan PRD |
| 7. Pengelolaan website | Banner, produk unggulan/terbaru, identitas brand, pengaturan WhatsApp/personalisasi | Perubahan admin tampil pada halaman publik |
| 8. QA dan deployment | Uji keamanan, fungsional, mobile, konfigurasi Netlify, checklist produksi | QA lulus; deployment produksi hanya setelah persetujuan pemilik |

Tidak ada pembayaran online pada ruang lingkup yang terdokumentasi. Pengelolaan stok juga tidak termasuk versi awal berdasarkan PRD/README. Periksa `docs/OPEN-DECISIONS.md` sebelum pekerjaan bergantung pada keputusan yang belum final.
