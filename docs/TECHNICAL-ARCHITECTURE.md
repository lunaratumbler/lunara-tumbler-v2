# Technical Architecture — Lunara Tumbler

## Status dan batasan
Dokumen ini mencatat keputusan fondasi project initialization. Belum ada integrasi database, autentikasi, penyimpanan gambar, fitur customer, atau operasi admin yang dibuat.

## Stack aplikasi
- Next.js App Router dengan React dan TypeScript strict.
- Tailwind CSS v4 diproses melalui `@tailwindcss/postcss`.
- ESLint flat configuration dengan preset Next.js Core Web Vitals dan TypeScript.
- npm sebagai package manager; lockfile `package-lock.json` menjadi sumber versi transitive setelah instalasi.
- Netlify sebagai target hosting. Konfigurasi build menjalankan `npm run build`; integrasi Next.js Netlify autodetect digunakan tanpa adapter yang dipin.

## Struktur kode yang dituju
`src/app` untuk route/layout dan global styles; `src/components/layout`, `ui`, `customer`, `admin` untuk UI; `src/hooks` untuk hooks; `src/lib` untuk integrasi lintas fitur; `src/services` untuk akses domain/data; `src/types` untuk tipe bersama; `src/utils` untuk helper murni. `public/images` dan `public/mockup` berisi aset publik. `supabase/migrations` menampung migration berurutan setelah desain database direview.

## Batas client/server
Utamakan Server Components untuk route dan data baca. Tambahkan Client Components hanya untuk interaksi browser seperti keranjang/local storage. Validasi input dan harga di server; secret service-role tidak boleh masuk ke bundle client. Publik tidak boleh menerima harga modal, profit, atau data order/admin.

## Integrasi Supabase (tahap mendatang)
Gunakan Supabase PostgreSQL, Auth, dan Storage sesuai dokumen `docs/DATABASE.md` serta `docs/DEPLOYMENT.md`. Aktifkan RLS untuk seluruh tabel API. Pisahkan konfigurasi public anon key dari server-only service-role key. Jangan membuat atau menerapkan schema sampai rancangan dan kebijakan akses direview.

## Deployment
Netlify mendukung App Router dan otomatis menyiapkan OpenNext adapter untuk Next.js modern. Repository hanya memiliki `netlify.toml` dengan build command; tidak mengubah pengaturan site Netlify/GitHub. Environment variables dikelola di Netlify UI atau `.env.local` lokal, bukan disimpan di source.

## Environment
Gunakan `.env.example` sebagai daftar variabel tanpa nilai rahasia. Kredensial Supabase asli belum tersedia di repository dan tidak diisi. Jangan pernah memakai prefix `NEXT_PUBLIC_` untuk service-role key.

## Pemeriksaan awal
Perintah milestone: `npm run lint`, `npm run build`, dan `npm run dev`. Tanggal serta hasil aktual dicatat di `docs/PROGRESS.md`.
