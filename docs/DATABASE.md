# Rancangan Database — Supabase

Ini rancangan awal untuk didiskusikan dan divalidasi sebelum migration dibuat. Codex harus menjelaskan relasi, constraint, indeks, dan kebijakan RLS sebelum implementasi.

## Entitas yang direncanakan

### `profiles`
- `id` (UUID, relasi ke `auth.users`)
- `display_name`
- `role` (misalnya `owner`; perlu keputusan apakah role pegawai dibutuhkan)
- `created_at`, `updated_at`

### `categories`
- `id`
- `name`
- `slug`
- `sort_order`
- `is_active`
- timestamps

### `products`
- `id`
- `category_id`
- `name`
- `slug`
- `description`
- `specifications` (struktur JSON yang tervalidasi atau tabel terpisah)
- `selling_price`
- `cost_price` — satu HPP untuk seluruh warna produk; admin-only
- `is_new`
- `is_best_seller`
- `is_featured`
- `featured_order`
- `is_active`
- timestamps

### `product_images`
- `id`
- `product_id`
- `storage_path`
- `alt_text`
- `sort_order`
- optional `product_color_id` untuk foto spesifik warna
- timestamps

### `product_colors`
- `id`
- `product_id`
- `name`
- `hex_code`
- `sort_order`
- `is_active`
- timestamps

### `orders`
- `id`
- `order_number` (unique)
- `customer_name`
- `customer_whatsapp`
- `notes`
- `status` (`new`, `processing`, `completed`, `cancelled`)
- `subtotal`
- `personalization_total`
- `grand_total`
- `created_at`, `updated_at`

### `order_items`
- `id`
- `order_id`
- `product_id` (nullable jika kebijakan penghapusan produk memerlukan histori tetap)
- snapshot nama produk
- snapshot warna
- quantity
- personalization flag/name
- snapshot selling price
- snapshot cost price
- personalization fee snapshot
- line total
- timestamps

### `order_status_history`
- `id`
- `order_id`
- `old_status`
- `new_status`
- `changed_by`
- `created_at`

### `site_settings`
- key/value atau kolom terstruktur untuk nama toko, WhatsApp, template, biaya personalisasi, kontak, dan brand info.
- Lindungi nilai sensitif dan batasi siapa yang boleh mengubah.

### `banners`
- `id`
- title/alt text
- image path
- link opsional
- sort order
- active flag
- timestamps

## Aturan penting
1. Aktifkan RLS pada semua tabel yang dapat diakses melalui Supabase API.
2. Pengunjung publik hanya boleh membaca data produk aktif, kategori aktif, foto, warna, dan pengaturan publik yang diperlukan.
3. Pengunjung publik tidak boleh membaca `cost_price`, HPP snapshot, data profit, pesanan, atau profil admin.
4. Admin terautentikasi dengan role yang sah dapat mengakses data admin sesuai kebijakan.
5. Jangan mengandalkan penyembunyian field di UI. Lindungi data di database/API.
6. Hitung harga dan total di server. Jangan menerima total dari browser sebagai sumber kebenaran.
7. Gunakan integer untuk nominal Rupiah (bukan floating point).
8. Simpan snapshot harga dan HPP pada saat pesanan dibuat.
9. `order_number` harus memiliki unique constraint; gunakan generator acak yang aman dan penanganan collision.
10. Tentukan kebijakan delete/archive agar histori pesanan tidak rusak ketika produk dihapus.
11. Foto publik dapat memakai bucket public jika memang hanya berisi foto katalog. Jangan simpan dokumen privat admin di bucket publik.

## Hal yang harus diputuskan sebelum migration
- Apakah admin tunggal atau multi-user?
- Apakah biaya tambahan/operasional dicatat?
- Apakah histori status wajib sejak versi pertama?
- Apakah spesifikasi produk disimpan sebagai JSON atau tabel terstruktur?
- Apakah produk dihapus permanen atau dinonaktifkan (disarankan nonaktifkan agar histori terjaga)?
