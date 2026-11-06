# Supabase

Letakkan migration SQL berurutan di folder `migrations/`.

Sebelum migration diterapkan:
1. Tinjau rancangan `../docs/DATABASE.md`.
2. Pastikan constraint, indeks, foreign key, dan kebijakan RLS terdokumentasi.
3. Uji bahwa role publik tidak dapat membaca HPP, pesanan, atau data admin.
4. Jangan menaruh service-role key di client/browser.
