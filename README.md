# Lunara Tumbler — Project Starter

Dokumen awal dan struktur kerja untuk website katalog tumbler Lunara. Nama **Lunara Tumbler** masih dianggap nama kerja dan dapat diganti.

## Tujuan
Website katalog produk tumbler dengan pemesanan melalui WhatsApp. Tidak ada pembayaran online, pengelolaan stok, ongkir, SKU, maupun pencarian produk pada versi awal.

## Mulai
1. Baca `docs/PRD.md` untuk kebutuhan produk.
2. Baca `docs/ROADMAP.md` untuk urutan milestone.
3. Baca `docs/DESIGN-SYSTEM.md` untuk arah visual.
4. Baca `docs/DATABASE.md` sebelum membuat skema database.
5. Baca `AGENTS.md` sebelum meminta Codex mengubah kode.
6. Kerjakan satu milestone pada satu waktu. Jangan lanjut sebelum hasil milestone diperiksa dan disetujui.

## Stack yang direkomendasikan
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- Git/GitHub
- Netlify untuk deployment

Stack ini merupakan rekomendasi awal, bukan keputusan teknis yang tidak bisa diubah. Codex harus menjelaskan alasan jika mengusulkan perubahan.

## Keamanan
- Jangan pernah memasukkan secret/API key ke Git.
- Jangan pernah mengekspos Supabase service-role key di browser.
- Harga modal dan data profit hanya boleh tersedia untuk admin terautentikasi.
- Semua akses admin dan operasi sensitif harus divalidasi di server dan dilindungi RLS.


## Hosting dan repository
- GitHub menjadi repository resmi untuk source code dan riwayat perubahan.
- Netlify menjadi platform hosting/deployment yang terhubung ke repository GitHub.
- Supabase menyediakan PostgreSQL, Auth, dan Storage.
- Sebelum deployment produksi, periksa kompatibilitas versi Next.js dan konfigurasi Netlify terbaru.

Baca juga `docs/DEPLOYMENT.md` untuk GitHub, Netlify, Supabase, dan Storage, serta `docs/RESPONSIVE-ADMIN.md` untuk persyaratan admin mobile.
