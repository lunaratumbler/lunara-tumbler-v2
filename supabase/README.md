# Supabase lokal

Migration `migrations/202611070001_milestone3.sql` menyiapkan profil admin, kategori, produk/warna/foto/produk terkait, pesanan dan snapshot, laporan, pengaturan situs, banner, Storage, serta RPC publik yang hanya mengembalikan kolom katalog yang aman.

## Keamanan

- Semua tabel memakai RLS. Data HPP, profil, pesanan, dan laporan hanya tersedia bagi profil admin aktif.
- Pengunjung membaca katalog dan pengaturan melalui fungsi RPC yang mengembalikan proyeksi publik. RPC produk tidak menyertakan `cost_price` atau snapshot HPP.
- Pembentukan pesanan manual memeriksa admin di database, membaca harga/HPP/biaya personalisasi yang dipercaya dari tabel, menghitung total di server, menyimpan snapshot, dan menggunakan nomor acak dengan unique constraint serta retry.
- Produk tidak mendapat izin SQL `DELETE`; keluarkan dari katalog dengan `is_active=false` agar histori terlindungi.
- Foto katalog memakai bucket publik khusus. Perubahan Storage membutuhkan sesi admin/RLS.
- Aplikasi memakai publishable key + sesi Auth; tidak menggunakan service-role key.

## Persiapan project oleh owner

1. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` pada `.env.local` dari project Supabase.
2. Tinjau lalu terapkan migration ini secara terpisah pada project yang dipilih owner. Implementasi sesi ini tidak menerapkan migration ke project remote.
3. Buat akun Auth pertama melalui Supabase Dashboard. Setelah mengetahui UUID user itu, owner menambahkan baris profil aktif melalui SQL Editor: `insert into public.profiles(id, display_name) values ('<AUTH_USER_UUID>', 'Admin');`. Jangan memasukkan secret ke repository.
4. Login di `/admin`; Auth dan tabel `profiles` sama-sama harus mengizinkan user tersebut.
5. Isi katalog melalui Admin > Produk. Tidak ada produk contoh hardcoded atau data seed produk.

Storage menerima jpeg/png/webp/avif maksimal 10 MB. Uji RLS, autentikasi, upload, hitungan laporan, dan responsif pada project staging sebelum menggunakan data toko.
