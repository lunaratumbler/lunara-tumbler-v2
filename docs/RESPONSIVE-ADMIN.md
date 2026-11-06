# Persyaratan Responsif Panel Admin

## Ketentuan wajib
Seluruh website customer dan seluruh panel admin harus responsif pada:
- Smartphone.
- Tablet.
- Desktop/laptop.

Panel admin harus dapat digunakan untuk pekerjaan nyata melalui smartphone, bukan sekadar tampil mengecil.

## Perilaku layout
### Desktop
- Sidebar admin tampil permanen di sisi kiri.
- Area konten menggunakan ruang layar secara efisien.
- Tabel dapat tampil dalam format tabel penuh.

### Tablet
- Sidebar dapat diciutkan atau diubah menjadi navigasi ringkas.
- Form dan kartu menyesuaikan lebar layar.
- Tabel tetap terbaca dan tidak menyebabkan seluruh halaman overflow.

### Smartphone
- Sidebar berubah menjadi drawer/menu hamburger.
- Header admin ringkas dan mudah digunakan.
- Kartu ringkasan tersusun satu atau dua kolom sesuai lebar layar.
- Tabel panjang dapat menggunakan horizontal scroll pada kontainer tabel atau tampilan kartu per record. Jangan membuat seluruh halaman bergeser horizontal.
- Form tambah/edit produk dan pesanan menggunakan layout satu kolom.
- Tombol, input, swatch warna, dan kontrol jumlah memiliki area sentuh yang nyaman.
- Dialog/modal tidak boleh terpotong; gunakan layar penuh atau bottom sheet bila lebih baik.
- Aksi penting tidak boleh hanya tersedia saat hover.
- Grafik laporan harus terbaca pada layar kecil.
- Upload foto harus mendukung pemilihan file dari galeri/file picker smartphone; kamera dapat digunakan jika browser/perangkat mendukung.
- Berikan loading, error, success, dan empty state yang jelas.

## Fungsi admin yang harus tersedia di smartphone
- Login dan logout.
- Melihat dashboard.
- Melihat, menambah, mengedit, menonaktifkan/menghapus produk.
- Upload dan mengatur foto produk.
- Mengelola kategori dan warna.
- Membuat pesanan manual dengan beberapa item.
- Melihat detail pesanan dan mengubah status.
- Melihat laporan penjualan dan laba kotor.
- Mengatur banner dan produk unggulan.
- Mengubah informasi toko, nomor WhatsApp, dan biaya personalisasi.

## Aksesibilitas dan usability
- Semua input memiliki label.
- Fokus keyboard terlihat.
- Kontras teks dan kontrol memadai.
- Jangan mengandalkan warna saja untuk menunjukkan status.
- Kontrol sentuh memiliki ukuran dan jarak yang memadai.
- Pastikan halaman tidak mengalami horizontal overflow pada lebar 320 CSS px.
- Uji minimal pada lebar 320, 375, 768, 1024, dan 1440 CSS px.

## Kriteria penerimaan
Milestone UI dan QA belum dapat dinyatakan selesai jika:
1. Ada fitur admin penting yang tidak dapat digunakan di smartphone.
2. Form utama sulit diisi atau tombol sulit disentuh.
3. Konten terpotong atau seluruh halaman overflow horizontal.
4. Upload foto tidak dapat dilakukan dari perangkat mobile yang didukung.
5. Navigasi admin mobile tidak dapat dibuka/ditutup dengan benar.
