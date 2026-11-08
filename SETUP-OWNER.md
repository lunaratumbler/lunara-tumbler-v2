# Setup Owner

1. Di Supabase Dashboard, pilih project yang akan digunakan. Buka **Project Settings → API**. Salin **Project URL** dan **publishable key**. Jangan gunakan `service_role` key.
2. Di VSCode, salin file `.env.example` di root repository menjadi `.env.local`. Buka `.env.local`, lalu ganti nilai placeholder `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` dengan nilai dari dashboard. Simpan secara lokal.
3. Di VSCode, buka `supabase/migrations/202611070001_milestone3.sql`, salin seluruh isinya, lalu buka Supabase Dashboard project yang sama → **SQL Editor** → **New query**. Tempel seluruh SQL dan tekan **Run**.
4. Di Supabase Dashboard, buka **Authentication → Users → Add user**. Buat user admin dengan email dan kata sandi yang owner tentukan. Setelah user dibuat, salin UUID milik user tersebut. Di **SQL Editor**, jalankan query berikut setelah mengganti placeholder dengan UUID tersebut:

```sql
insert into public.profiles (id, display_name)
values ('<UUID_AKUN_AUTH>', 'Admin');
```

5. Jangan commit `.env.local`. Jangan membagikan `service_role` key, kata sandi, atau UUID melalui chat.
