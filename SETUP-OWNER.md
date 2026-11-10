# Setup Owner

1. Di Supabase Dashboard, pilih project yang akan digunakan. Buka **Project Settings → API**. Salin **Project URL** dan **publishable key**. Jangan gunakan `service_role` key.
2. Di VSCode, salin file `.env.example` di root repository menjadi `.env.local`. Buka `.env.local`, lalu ganti nilai placeholder `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` dengan nilai dari dashboard. Simpan secara lokal.
3. Untuk project Supabase baru, jalankan seluruh migration berikut **berurutan** melalui **SQL Editor → New query**. Salin satu file penuh, tekan **Run**, pastikan berhasil, lalu lanjut ke file berikutnya:

   1. `supabase/migrations/202611070001_milestone3.sql`
   2. `supabase/migrations/202611070002_milestone5.sql`
   3. `supabase/migrations/202611080001_latest_products.sql`

   Jangan menjalankan ulang migration pertama pada project yang sudah memilikinya tanpa meninjau schema terlebih dahulu. Migration kedua dan ketiga memperbarui fungsi/payload publik yang dipakai tampilan website dan carousel produk terbaru.
4. Di Supabase Dashboard, buka **Authentication → Users → Add user**. Buat user admin dengan email dan kata sandi yang owner tentukan. Setelah user dibuat, salin UUID milik user tersebut. Di **SQL Editor**, jalankan query berikut setelah mengganti placeholder dengan UUID tersebut:

```sql
insert into public.profiles (id, display_name)
values ('<UUID_AKUN_AUTH>', 'Admin');
```

5. Jangan commit `.env.local`. Jangan membagikan `service_role` key, kata sandi, atau UUID melalui chat.
6. Setelah setup, login di `/admin` dan uji satu produk, satu warna, dan satu foto pada project staging atau data yang sudah disetujui. Jangan menguji dengan data dummy pada project produksi tanpa persetujuan owner.
