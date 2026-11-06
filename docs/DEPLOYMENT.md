# Deployment dan Integrasi Layanan

## Keputusan layanan
- Repository kode: GitHub.
- Hosting/deployment: Netlify.
- Database: Supabase PostgreSQL.
- Autentikasi admin: Supabase Auth.
- Penyimpanan foto: Supabase Storage.

## Alur kerja
1. Kode dikembangkan secara lokal di VS Code dengan bantuan Codex.
2. Perubahan disimpan dan di-push ke repository GitHub.
3. Netlify dihubungkan ke repository GitHub untuk build dan deployment.
4. Environment variables diatur melalui pengaturan environment Netlify, bukan ditulis ke source code.
5. Supabase digunakan oleh aplikasi untuk database, autentikasi, dan penyimpanan media.

## Catatan Next.js di Netlify
Gunakan integrasi Next.js resmi Netlify dan ikuti konfigurasi build yang direkomendasikan oleh dokumentasi Netlify pada saat setup. Jangan mengunci konfigurasi adapter atau versi runtime berdasarkan tutorial lama. Codex harus memeriksa kompatibilitas versi Next.js, Node.js, dan Netlify sebelum mengubah konfigurasi deployment.

## Environment variables
Contoh variabel ada di `.env.example`. Nilai asli dimasukkan ke `.env.local` untuk development dan ke environment variables Netlify untuk deployment.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only, jika benar-benar diperlukan.

Jangan pernah commit `.env.local` atau secret ke GitHub. Jangan pernah mengekspos service-role key ke browser.

## Foto dan media
- Foto katalog yang memang boleh dilihat publik dapat disimpan pada public bucket Supabase Storage.
- Upload, replace, dan delete foto harus dibatasi untuk admin yang terautentikasi.
- Simpan path/storage key dan metadata foto di database; jangan menyimpan file foto sebagai blob di tabel produk.
- Jangan letakkan foto privat atau dokumen internal di public bucket.

## Sebelum produksi
- Pastikan domain dan HTTPS aktif.
- Pastikan redirect URL Supabase Auth sesuai domain produksi.
- Uji route admin, RLS, upload foto, dan akses publik.
- Periksa log build/deployment Netlify.
- Deployment produksi hanya dilakukan setelah persetujuan pemilik.
