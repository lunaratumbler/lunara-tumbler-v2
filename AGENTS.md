# Instruksi untuk Codex

Bertindak sebagai engineer yang mengimplementasikan spesifikasi Lunara Tumbler. Dokumen dalam `docs/` adalah sumber kebutuhan utama.

## Aturan kerja
1. Kerjakan hanya milestone yang diminta. Jangan membangun seluruh website sekaligus.
2. Sebelum coding, ringkas pemahaman, file yang akan dibuat/diubah, asumsi, dan risiko.
3. Jika ada konflik antar dokumen atau requirement yang belum diputuskan, berhenti dan tanyakan. Jangan mengarang keputusan bisnis.
4. Jangan menghapus atau mengubah requirement tanpa persetujuan.
5. Gunakan TypeScript dengan tipe yang jelas; hindari `any` kecuali benar-benar diperlukan dan diberi alasan.
6. Validasi input di server, tangani error, loading, empty state, dan state mobile.
7. Jangan menampilkan tombol/link login admin di halaman customer.
8. Jangan mengekspos harga modal, biaya, atau profit pada halaman publik, payload publik, atau endpoint publik.
9. Jangan menyimpan secret di source code. Gunakan environment variables dan `.env.example` tanpa nilai rahasia.
10. Jangan mengklaim fitur selesai sebelum menjalankan pemeriksaan yang relevan dan melaporkan hasilnya.

## Proses milestone
Untuk setiap milestone:
- Jelaskan rencana singkat.
- Implementasikan hanya ruang lingkup milestone.
- Jalankan lint, typecheck, test/build yang tersedia.
- Laporkan file yang berubah, keputusan teknis, hasil pemeriksaan, kekurangan, dan cara menguji manual.
- Berhenti menunggu review. Jangan otomatis lanjut ke milestone berikutnya.

## Keamanan admin
- `/admin` adalah URL langsung untuk masuk ke area admin; tidak ada tautan admin pada website customer.
- Menyembunyikan tautan bukan mekanisme keamanan. Semua halaman/data/aksi admin wajib membutuhkan sesi dan otorisasi yang valid.
- Gunakan Supabase Auth dan Row Level Security (RLS).
- Operasi yang memakai service-role key hanya boleh berjalan di lingkungan server yang aman.
- Terapkan prinsip least privilege.

## Bahasa dan mata uang
- Antarmuka customer/admin menggunakan Bahasa Indonesia.
- Mata uang Rupiah (IDR), dengan format tampilan `Rp`.
- Zona waktu tampilan dan laporan: Asia/Jakarta, kecuali ditetapkan lain.


## Repository dan deployment
- GitHub adalah repository kode resmi.
- Netlify adalah target hosting/deployment resmi.
- Ikuti `docs/DEPLOYMENT.md`; periksa dokumentasi Netlify terkini sebelum konfigurasi build.
- Jangan deploy ke produksi tanpa persetujuan eksplisit.

## Responsif wajib
- Semua halaman customer dan admin harus responsif pada smartphone, tablet, dan desktop.
- Semua fungsi admin harus dapat digunakan di smartphone.
- Ikuti `docs/RESPONSIVE-ADMIN.md` dan laporkan hasil uji pada lebar layar 320, 375, 768, 1024, dan 1440 CSS px.
