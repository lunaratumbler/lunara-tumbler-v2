# Progress — Lunara Tumbler

## Status terkini
- **Milestone:** 3 — Supabase + Admin, dengan polish Customer UI
- **Status:** Implementasi lokal lulus lint/typecheck/build dan menunggu review serta uji integrasi Supabase. Tidak ada perubahan Supabase remote, commit, push, atau deployment.
- **Tanggal:** 2026-11-07
- **Batas lingkup:** Tugas polish Customer UI, pemasaran, dan Milestone 3 yang disetujui owner; berhenti setelah laporan dan menunggu review.

## Locked Decisions - Owner Approved
1. Hanya satu akun admin aktif yang digunakan saat ini. Skema profil mengizinkan admin tambahan nanti; tidak ada role staf bertingkat.
2. Nomor WhatsApp toko disimpan di Settings, dapat diedit admin, dan menjadi sumber semua tautan WhatsApp. Nomor hanya ditampilkan di kolom edit Settings admin.
3. Tidak ada pengelolaan stok/inventory pada v1.
4. Tidak ada pembayaran online, checkout berbayar, payment gateway, kalkulasi ongkir, pencarian/filter produk, SKU, atau sinkronisasi otomatis WhatsApp ke database.
5. HPP dan laba hanya untuk admin; data ini tidak ada di produk/payload publik, halaman customer, file publik, atau PDF customer.
6. Keranjang customer tetap di Local Storage dan alur customer berakhir dengan pesan WhatsApp berisi rincian pesanan. Customer tidak perlu login.
7. Biaya personalisasi awal Rp15.000 per tumbler dan dapat disesuaikan di Settings. Laporan hanya menghitung laba kotor (penjualan dikurangi HPP).
8. Satu milestone dikerjakan pada satu waktu; berhenti dan menunggu review setelah milestone yang diminta.
9. Satu sesi Codex mengedit repo pada satu waktu.
10. Bahasa UI Bahasa Indonesia; mata uang Rupiah integer; zona waktu tampilan/laporan Asia/Jakarta.
11. Halaman customer dan admin harus responsif dan dapat digunakan pada smartphone, tablet, dan desktop.
12. Copy dan harga mockup bukan data katalog. Tidak menambahkan rating/review, kontak, atau harga yang tidak disetujui. Contoh katalog hanya boleh dibuat di database dan dikelola melalui admin.

## Locked Decisions - Owner Approved (Historical Milestone 2)
1. Tidak ada tombol/tautan login admin di halaman customer, termasuk header, footer, dan menu mobile. Akses admin hanya melalui URL langsung `/admin`.
2. Nomor bisnis awal `085772582278` (`wa.me/6285772582278`) editable di Settings; tampilkan sebagai teks hanya pada input Settings admin. Seluruh tautan memakai nilai Settings.
3. Tidak ada pengelolaan stok/inventory di v1.
4. Tidak ada pembayaran online, checkout berbayar, payment gateway, kalkulasi ongkir, pencarian/filter produk, SKU, atau sinkronisasi otomatis WhatsApp ke database di v1.
5. HPP dan profit hanya untuk admin. Jangan pernah mengeksposnya pada halaman publik, payload API publik, ekspor publik, atau PDF customer.
6. Alur customer: katalog → keranjang (Local Storage) → pesan WhatsApp dengan detail pesanan lengkap. Customer tidak perlu login.
7. Biaya personalisasi awal Rp15.000 per tumbler. Laporan profit adalah laba kotor, bukan laba bersih.
8. Kerja satu milestone pada satu waktu; berhenti dan menunggu review setelah setiap milestone.
9. Hanya satu akun Codex bekerja pada satu waktu; tidak ada sesi Codex paralel yang mengedit repo.
10. Bahasa UI Bahasa Indonesia; mata uang IDR (Rp); zona waktu tampilan Asia/Jakarta.
11. Semua halaman customer/admin responsif dan dapat digunakan pada smartphone, tablet, dan desktop.
12. Jangan mengarang fitur rating/review, data kontak brand, atau harga produk dari mockup. Mockup hanya referensi visual.

## Keadaan sebelum tugas gabungan (riwayat Milestone 1 dan 2)
- Next.js App Router, TypeScript strict, Tailwind CSS v4, ESLint flat config, dan skrip dasar tersedia.
- UI customer mock tersedia pada route beranda, katalog, detail produk, dan keranjang.
- CSS variables dan token visual Lunara tersedia di `src/app/globals.css` dan `docs/DESIGN-SYSTEM.md`.
- Cart memakai Local Storage dan alur pesan WhatsApp berisi ringkasan pesanan.
- Struktur `src` untuk app, komponen, hooks, lib, services, types, dan utils tersedia.
- `.env.example` berisi nama variabel Supabase tanpa kredensial.
- Mockup tersedia di `public/mockup/Kolase E-commerce Tumbler Lunara Pastel.png`.
- Dokumentasi teknis dan roadmap tersedia di `docs/TECHNICAL-ARCHITECTURE.md` dan `docs/DEVELOPMENT-ROADMAP.md`.
- Konfigurasi Netlify tidak mematok adapter. Dokumentasi Netlify terkini menyatakan Next.js memakai OpenNext adapter yang dikelola otomatis; tidak ada deployment yang dilakukan.

## Perubahan pada sesi pemulihan
- `package.json`: menambahkan skrip `typecheck` (`tsc --noEmit`).
- `package-lock.json`: disinkronkan melalui npm setelah `npm ci` melaporkan daftar paket yang hilang dari lock file. `npm ci --dry-run --ignore-scripts --no-audit --no-fund` kemudian keluar dengan kode 0.
- `.gitignore`: menambahkan `*.tsbuildinfo` agar artefak incremental TypeScript tidak masuk perubahan proyek.
- `docs/PROGRESS.md`: mencatat audit, error, status verifikasi, dan langkah pemulihan berikutnya.

## Audit dependency dan error
- Node.js lokal: `v24.22.1`; npm: `11.19.1`.
- `node_modules` ada saat audit awal, tetapi `npm ls --depth=0` menandai banyak dependency inti `invalid`; berkas paket/deklarasi juga hilang atau terpotong.
- Error yang tercatat dari terminal:
  - ESLint: tidak dapat menemukan `@eslint/eslintrc/dist/eslintrc-universal.cjs`.
  - TypeScript: `TS1010: '*/' expected` pada `node_modules/@types/node/child_process.d.ts` dan `node_modules/csstype/index.d.ts`.
  - Next build: React tidak ditemukan dan binary `@next/swc-win32-x64-msvc` bukan aplikasi Win32 yang valid.
  - Dev server: `'next' is not recognized as an internal or external command`.
  - `npm ci` awal: `EUSAGE` karena paket seperti `@babel/core`, `es-abstract`, dan paket platform `sharp` tidak ada di lock file.
  - `npm ci --offline`: `ENOTCACHED` untuk `es-abstract@1.24.2`; cleanup juga melaporkan `EPERM` pada folder `@typescript-eslint/typescript-estree`.
- Dugaan berbasis bukti: instalasi `node_modules` parsial/rusak, ditambah lock file yang semula tidak sinkron. Instalasi npm bersih di Windows/registry berjalan sangat lambat dan belum menyelesaikan reify; log berisi fetch HTTP 200 yang memakan puluhan detik, bukan bukti kegagalan kompatibilitas Next.
- Peringatan `eslint@9.39.1` menyebut versi tersebut deprecated/tidak lagi didukung. Belum ada bukti bahwa peringatan itu penyebab error di atas; evaluasi upgrade setelah instalasi dapat diuji.

## Hasil pemeriksaan terakhir
- `npm ci --dry-run --ignore-scripts --no-audit --no-fund`: exit 0 setelah lock file diperbarui; dry-run tidak memasang dependency.
- `npm ci` bersih: belum selesai. Percobaan online dihentikan setelah lama tertahan; percobaan offline gagal karena cache tidak lengkap; percobaan online berikutnya juga dihentikan saat tidak ada kemajuan yang dapat dipastikan.
- `npm run lint`: gagal pada instalasi lama karena berkas ESLint hilang.
- `npm run typecheck`: gagal pada instalasi lama karena file deklarasi dependency terpotong.
- `npm run build`: gagal pada instalasi lama karena React/SWC tidak valid.
- `npm run dev`: gagal karena executable lokal `next` belum ada.
- Belum ada hasil pemeriksaan yang lulus; milestone belum boleh dinyatakan selesai.

## Keputusan teknis dan keamanan
- Stack tetap Next.js App Router, TypeScript strict, Tailwind CSS v4, ESLint, dan npm.
- Netlify menggunakan deteksi framework/OpenNext otomatis sesuai dokumentasi saat audit; tidak memasang adapter secara manual.
- Supabase SDK belum dipasang; belum ada migration atau perubahan database.
- Tidak ada secret yang ditambahkan. Tidak ada perubahan remote Git, commit, push, pengaturan Netlify, atau deployment.

## Langkah berikutnya
1. Tunggu review Milestone 2. Jangan mulai Milestone 3 sebelum persetujuan.

## Pemulihan lanjutan (2026-11-07)
- Versi terverifikasi: Node.js `v24.22.1`, npm `11.19.1`. PowerShell memblokir shim `npm.ps1`; pemeriksaan npm dilakukan memakai `npm.cmd`.
- `package.json` dan header `package-lock.json` sama-sama menyatakan Next.js `16.4.5`, React/React DOM `19.2.5`, lockfile v3. `node_modules` awal tidak lengkap: `next/package.json` tidak ditemukan, sedangkan React/ESLint/TypeScript ada sebelum instalasi bersih dicoba. `node_modules` juga berisi SWC Windows sekitar 110 MB dari instalasi sebelumnya.
- Probe file sementara pada `node_modules` berhasil, tanpa mendeteksi lock langsung. Pemeriksaan awal menemukan proses Node/npm; akses command line memerlukan pemeriksaan proses read-only dengan izin lebih tinggi.
- Percobaan `npm ci` pertama berhenti dengan error `ENOTEMPTY` pada `node_modules/caniuse-lite/data/features`. Pemeriksaan proses kemudian mengidentifikasi PID `11636` sebagai `npm ci` lama yang masih berjalan untuk repo ini. Proses Codex lain di PID `12504` tidak terkait dengan instalasi.
- Proses npm lama yang sudah teridentifikasi dihentikan. Instalasi bersih berikutnya selesai dengan exit code 0 (`info ok` pada log npm). Fetch registry lambat, tetapi berhasil; lockfile tidak diubah saat pemulihan ini.

## Hasil verifikasi Milestone 1 (2026-11-07)
- Node.js `v24.22.1`, npm `11.19.1`; Next.js `16.4.5`, React dan React DOM `19.2.5` sesuai manifest dan lockfile.
- `npm ci --no-audit --no-fund --fetch-retries=0 --fetch-timeout=60000`: berhasil, exit code 0.
- `npm ls --depth=0`: berhasil; seluruh dependency langsung terpasang pada versi yang dideklarasikan.
- `npm run lint`: verifikasi ulang awal gagal dengan `TypeError: Converting circular structure to JSON` di `@eslint/eslintrc` `config-validator.js`. Catatan sesi sebelumnya yang menyatakan lint berhasil adalah keliru.
- Akar penyebab lint: `eslint.config.mjs` mengirim config flat bawaan Next.js 16 melalui `FlatCompat.extends()`. Adaptasi legacy eslintrc memvalidasi ulang objek plugin flat yang mengandung referensi melingkar.
- Perbaikan lint: gunakan impor flat resmi `eslint-config-next/core-web-vitals` dan `eslint-config-next/typescript` langsung melalui `defineConfig` dan `globalIgnores` dari `eslint/config`. Tidak ada versi dependency yang diubah.
- `npm run lint`: berhasil setelah perbaikan, exit code 0.
- `npm run typecheck`: berhasil setelah perbaikan, exit code 0 (`tsc --noEmit` tanpa error).
- `npm run build`: berhasil setelah perbaikan, exit code 0 dengan Next.js 16.4.5/Turbopack; menghasilkan `.next/BUILD_ID`.
- `npm run dev -- --port 3123`: server siap, halaman `/` merespons HTTP 200. Kompilasi awal memerlukan sekitar 18 detik. Proses server yang dibuat untuk smoke test sudah dihentikan setelah pengujian.
- Mockup `public/mockup/Kolase E-commerce Tumbler Lunara Pastel.png` tetap ada. Dev server Next.js menambahkan aturan sementara ke `AGENTS.md`; tambahan itu dibuang setelah smoke test, sehingga tidak menjadi perubahan proyek.
- Penyebab gangguan dependency yang terkonfirmasi: `node_modules` awal parsial dan satu proses `npm ci` lama yang masih berjalan bersamaan sehingga pembersihan folder mengalami `ENOTEMPTY`. Penyebab lint terpisah adalah penggunaan `FlatCompat` pada flat config Next.js. Tidak ada bukti masalah versi Node/Next atau lockfile pada instalasi yang berhasil.
- Tidak ada fitur Milestone 2 yang dikerjakan, tidak ada migrasi Supabase, perubahan remote, commit, push, atau deployment.

## Implementasi dan verifikasi Milestone 2 (2026-11-07)
- Beranda, katalog, detail produk, keranjang, navigasi customer, dan footer diimplementasikan dengan mock data lokal. Tidak ada Supabase/backend atau fitur admin.
- Kartu dan galeri produk memakai ilustrasi SVG buatan untuk demo. Fixture produk, harga, deskripsi, kapasitas, material, dan dimensi diberi penanda mock; harga maupun informasi produk tidak disalin dari mockup dan bukan data toko yang disetujui.
- Hanya kontak WhatsApp owner-approved `0857-7258-2278`/`wa.me/6285772582278` yang ditampilkan. Email, alamat, dan sosial media tidak ditambahkan karena datanya belum disetujui.
- Keranjang menggunakan Local Storage, memvalidasi ulang ID produk/warna dan harga mock saat dibaca, memisahkan baris berdasarkan produk/warna/status/nama personalisasi, memperbarui kuantitas dan total, serta menghapus baris saat minus dari satu. Pesan WhatsApp memuat nama produk, warna, personalisasi, jumlah, harga per unit, subtotal, dan total sementara. Nama personalisasi dinyatakan berlaku untuk semua unit pada baris; nama berbeda dapat ditambahkan sebagai baris terpisah.
- HPP/profit, pencarian/filter, stok, pembayaran, ongkir, SKU, rating/review, login customer, dan sinkronisasi WhatsApp/database tidak dibuat.
- `npm run lint`: exit code 0.
- `npm run typecheck`: exit code 0.
- `npm run build`: exit code 0; route `/`, `/catalog`, `/cart`, dan empat route detail produk terprerender.
- Uji browser pada `/`, `/catalog`, `/products/tumbler-aurora`, dan `/cart`, untuk lebar 320, 375, 768, 1024, 1440 CSS px: 20 kombinasi diuji; `document.documentElement.scrollWidth` dan `document.body.scrollWidth` tidak melebihi `window.innerWidth` pada semua kombinasi. Tidak ditemukan tautan admin/login.
- Smoke test keranjang: dua nama personalisasi berbeda tersimpan sebagai dua baris (qty 2 dan 1); target tautan checkout memakai nomor WhatsApp yang disetujui; minus mengurangi qty dan menghapus baris pada qty nol; setelah item terakhir dihapus, state kosong, Local Storage `[]`, dan badge `0`.
- Next dev dijalankan dengan `agentRules: false`; `AGENTS.md` tidak berubah. Dev server dan Chrome headless yang dipakai untuk uji dihentikan.
- Belum ada data produk/harga, spesifikasi, atau aset foto final yang disetujui. Fixture perlu diganti sebelum informasi demo dianggap sebagai katalog toko. Tidak ada migrasi, commit, push, deployment, atau pekerjaan Milestone 3.

### Cara uji manual Milestone 2
1. Jalankan `npm run dev`, lalu buka `http://localhost:3000/`.
2. Buka katalog, masuk ke detail produk, pilih warna, ubah jumlah, aktifkan personalisasi, isi nama, lalu tambahkan ke keranjang.
3. Tambahkan produk/warna/nama yang berbeda; pastikan baris tetap terpisah. Muat ulang halaman dan pastikan keranjang tetap ada.
4. Uji tombol plus/minus; minus dari jumlah satu harus menghapus baris. Pastikan badge, subtotal, total, dan empty state ikut berubah.
5. Pilih lanjut via WhatsApp dan periksa pesan berisi seluruh rincian keranjang serta target nomor `0857-7258-2278`. Tidak ada order yang tersimpan otomatis.
6. Ulangi pemeriksaan layout pada 320, 375, 768, 1024, dan 1440 CSS px; pastikan tidak ada scroll horizontal atau tautan admin/login.

## Polish customer, marketing, dan Milestone 3 lokal (2026-11-07)
- Sumber produk customer beralih dari fixture lokal ke RPC katalog publik Supabase. Tidak ada produk contoh hardcoded atau seeded; katalog menunjukkan empty state sampai produk dimasukkan melalui admin. Ilustrasi SVG fixture lama di `public/products/` dihapus; mockup visual `public/mockup/` dipertahankan.
- Detail produk menampilkan nama warna, mengganti foto sesuai warna jika tersedia, memperlihatkan pratinjau nama personalisasi, pesan keberhasilan tambah keranjang, produk terkait pilihan admin, dan tombol berbagi tautan produk lewat WhatsApp.
- Keranjang menyimpan snapshot item pada Local Storage, memisahkan item menurut produk/warna/nama personalisasi, menghitung badge dan total langsung, menampilkan pratinjau dan tombol salin pesan, meminta konfirmasi hapus, serta menyiapkan pesan dari template Settings.
- Tombol WhatsApp customer memakai nomor dari Settings dan hanya menampilkan label tombol. Pencarian source serta body text halaman customer/login admin di uji browser tidak menemukan nomor sebagai teks. Nomor ditampilkan sebagai input edit di Admin > Settings.
- Menambahkan Admin Auth, profil admin aktif yang dapat ditambah, navigasi admin responsif, produk CRUD dengan nonaktifkan alih-alih hard-delete, upload multi-foto, warna/foto spesifik warna, related products, pesanan manual, snapshot harga/HPP, status/histori pesanan, laporan laba kotor, banner, dan pengaturan brand/kontak.
- Migration lokal `supabase/migrations/202611070001_milestone3.sql` mengaktifkan RLS pada tabel data, membatasi tabel admin, memberi payload publik melalui RPC tanpa HPP, melindungi upload Storage, menghitung ulang total dari data database, serta menghasilkan order number acak dengan unique constraint dan retry. Tidak ada service-role key dalam aplikasi.
- `npm ls --depth=0`: exit 0 setelah menambahkan `@supabase/ssr`, `@supabase/supabase-js`, dan `zod`.
- `npm run lint`: exit 0 pada verifikasi final.
- `npm run typecheck`: exit 0 pada verifikasi final.
- `npm run build`: exit 0 pada verifikasi final dengan Next.js 16.4.5; route customer dan admin terdeteksi sebagai server-rendered dinamis.
- Smoke test browser produksi untuk `/`, `/catalog`, `/cart`, dan `/admin` (form login) pada 320, 375, 768, 1024, dan 1440 CSS px: 20 kombinasi, tanpa horizontal overflow. Teks body tidak memuat nomor bisnis. Route `/admin` diuji sebagai halaman login tanpa sesi.
- Belum ada `.env.local`, URL/key project Supabase, Auth user, atau database lokal. Karena itu migration belum diterapkan atau divalidasi terhadap PostgreSQL; route admin setelah login, CRUD, upload, pembuatan pesanan, kalkulasi laporan, perubahan nomor Settings, detail produk dengan data, dan halaman admin terautentikasi belum dapat diuji end-to-end. Tidak ada project Supabase remote yang diubah.
- Untuk membuka admin pertama kali, owner perlu meninjau dan menerapkan migration pada project yang dipilih, mengisi environment publishable key, membuat user Auth, lalu menambahkan profil admin aktif sesuai instruksi di `supabase/README.md`.
- Tidak ada commit, push, deployment, migration remote, atau perubahan `AGENTS.md`. Status: implementasi lokal menunggu review dan uji integrasi Supabase.

## Verifikasi setup Supabase owner (2026-11-07)
- Owner mengisi `.env.local`; pemeriksaan hanya memastikan kedua variabel wajib ada dan tidak mencetak nilainya.
- `npm run lint`, `npm run typecheck`, dan `npm run build`: seluruhnya exit 0 dengan environment lokal terdeteksi.
- Panggilan baca-saja ke RPC `get_public_settings` dan `get_public_catalog`: berhasil. Pengaturan publik menyertakan nomor WhatsApp yang dikonfigurasi; katalog saat ini mengembalikan 0 produk. Pemeriksaan payload katalog tidak menemukan field `cost_price`.
- Owner mengonfirmasi login admin berhasil. Sesi browser owner tidak tersedia bagi proses pemeriksaan, jadi halaman admin setelah autentikasi dan operasi tulis belum dapat diamati langsung.
- Query anon langsung ke tabel `products` (kolom HPP), `orders`, dan `profiles` semuanya ditolak dengan PostgreSQL/PostgREST code `42501`. RPC katalog publik lulus dan tidak menyertakan field `cost_price`; katalog saat ini kosong.
- Project Supabase yang dipilih owner adalah live. Pemeriksaan sesi ini hanya membaca; tidak membuat produk/pesanan uji atau mengubah Settings. CRUD, upload foto, pesanan/laporan, dan perubahan nomor masih menunggu uji memakai data toko yang disetujui atau project staging.

## Handoff Milestone 5 — Site Display (2026-11-07)
- Implementasi kode Milestone 5 selesai secara lokal. Admin > Tampilan Website dapat mengubah nama brand, slogan, tentang brand, banner beranda (gambar, judul, subjudul, tombol, status, urutan), serta pilihan dan urutan produk unggulan, terbaru, dan terlaris. Perubahan brand, banner, dan urutan produk ditautkan ke beranda/katalog publik.
- File yang diubah: `supabase/migrations/202611070002_milestone5.sql`; `src/app/admin/site/page.tsx`, `src/app/admin/settings/page.tsx`, `src/app/admin/admin.css`, `src/app/page.tsx`, `src/app/catalog/page.tsx`, `src/app/products/[slug]/page.tsx`, `src/app/cart/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`; `src/components/admin/admin-sidebar.tsx`, `src/components/admin/product-form.tsx`, `src/components/admin/site-display-forms.tsx`, `src/components/customer/product-card.tsx`, `src/components/customer/product-detail.tsx`, `src/components/customer/cart-content.tsx`, `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`, `src/components/layout/floating-whatsapp.tsx`; `src/lib/admin-actions.ts`, `src/lib/store.ts`, `src/data/products.ts`.
- `supabase/migrations/202611070002_milestone5.sql` berstatus LOCAL ONLY dan BELUM diterapkan ke Supabase remote. Owner harus menerapkannya sendiri melalui Supabase SQL Editor. Tidak ada remote migration yang dijalankan oleh Codex.
- Verifikasi sesi ini: `npm run lint` exit 0; `npm run typecheck` exit 0; `npm run build` exit 0. Headless Chrome memeriksa beranda, katalog, dan halaman login admin pada 320, 375, 768, 1024, dan 1440 CSS px; tidak ditemukan horizontal overflow. Tidak ada nomor telepon pada teks customer yang diperiksa. Pemindaian source tidak menemukan `Lorem ipsum`, `Demo`, atau `Contoh`. `AGENTS.md` tidak berubah.
- Belum diverifikasi live: perubahan di Admin > Tampilan Website yang memerlukan sesi admin; penyimpanan produk uji dengan warna `Dusty Pink` nama saja dan pembersihan katalog setelahnya. Kedua pemeriksaan memerlukan migration diterapkan dan sesi owner. Jangan meminta password, key, atau UUID owner. Produk mengikuti kebijakan arsip melalui nonaktifkan, bukan hard-delete.
- Aturan tetap: login Supabase melalui GitHub; Netlify melalui GitHub; GitHub terhubung ke proyek ini. Warna produk adalah NAMA SAJA, tanpa input hex. Nomor telepon tidak boleh tampil sebagai teks customer; kontak hanya lewat tombol `Hubungi via WhatsApp` yang menaut ke wa.me.
- Keputusan owner: PAUSE proyek di sini. Jangan deploy. Jangan mulai Milestone 6. Tunggu owner mengatakan `lanjut` sebelum melanjutkan pekerjaan.
