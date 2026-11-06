# Product Requirements Document — Lunara Tumbler

**Status:** Draft kerja berdasarkan diskusi.  
**Nama brand:** Lunara Tumbler (nama sementara).

## 1. Ringkasan produk
Website katalog tumbler yang menampilkan produk dan detailnya. Pelanggan memilih produk, warna, jumlah, dan opsi personalisasi, lalu mengirim ringkasan pesanan melalui WhatsApp bisnis. Website tidak memproses pembayaran.

## 2. Tujuan
- Menampilkan katalog produk dengan visual elegan dan profesional.
- Memudahkan pelanggan memilih varian dan personalisasi.
- Menghasilkan pesan WhatsApp berisi rincian pesanan yang jelas.
- Menyediakan panel admin untuk mengelola produk, pesanan manual, tampilan website, dan laporan.

## 3. Batasan versi awal
Tidak termasuk:
- Pembayaran online atau checkout pembayaran.
- Pengelolaan stok/inventory.
- Perhitungan ongkos kirim.
- Fitur pencarian produk.
- SKU.
- Sinkronisasi otomatis pesan masuk WhatsApp ke database.
- Penghitungan laba bersih dari biaya operasional, sebelum fitur biaya tambahan diputuskan.

## 4. Pengalaman pelanggan

### 4.1 Navigasi
- Logo/brand.
- Beranda.
- Katalog.
- Tentang Kami.
- Kontak.
- Tidak boleh ada tombol atau tautan login/admin pada halaman customer, termasuk footer.

### 4.2 Beranda
- Hero/banner ukuran kecil sampai sedang; jangan mendominasi layar.
- Intro singkat brand.
- Produk unggulan.
- Produk terbaru.
- Produk best seller yang dipilih/ditandai admin.
- Footer berisi informasi kontak dan sosial media.

### 4.3 Katalog
- Grid produk.
- Kartu menampilkan foto, nama, harga jual, badge opsional (New/Best Seller), preview warna, dan tombol detail.
- Tidak ada search bar atau filter pada versi awal.

### 4.4 Detail produk
- Galeri foto.
- Nama, harga jual, deskripsi, spesifikasi.
- Spesifikasi dapat mencakup kapasitas, material, dimensi, dan informasi relevan lain.
- Pilihan warna menggunakan swatch berbentuk lingkaran.
- Foto produk dapat berubah mengikuti warna jika foto khusus warna tersedia.
- Pilihan jumlah.
- Opsi personalisasi nama: tambahan Rp15.000 per tumbler.
- Jika personalisasi aktif, tampilkan input nama.
- Tambahkan ke keranjang.

### 4.5 Keranjang
- Dapat berisi beberapa produk.
- Tampilkan produk, warna, nama personalisasi, jumlah, harga, subtotal, dan total.
- Tombol tambah menaikkan jumlah satu per satu.
- Tombol kurang menurunkan jumlah satu per satu. Ketika jumlah mencapai nol, baris produk otomatis dihapus. Jumlah tidak boleh negatif.
- Total dan badge jumlah keranjang diperbarui otomatis.
- Tampilkan empty state jika keranjang kosong.
- Simpan keranjang di Local Storage.
- Baris dengan produk/warna/nama personalisasi berbeda harus dapat dibedakan. Jangan menggabungkan item yang memiliki detail personalisasi berbeda.
- Tombol pesan menghasilkan pesan WhatsApp yang memuat semua item, pilihan warna, personalisasi, jumlah, harga, dan total.

**Catatan yang perlu dipastikan sebelum implementasi final:** jika pelanggan membeli beberapa tumbler dalam satu baris dengan nama personalisasi yang berbeda-beda, perlu UI input nama per unit atau pemisahan menjadi beberapa baris. Jangan mengasumsikan satu nama berlaku untuk semua unit tanpa penjelasan yang terlihat.

### 4.6 WhatsApp
- Gunakan nomor WhatsApp bisnis dari pengaturan admin.
- Pesan dibuat dengan format yang mudah dibaca.
- Encode pesan untuk URL WhatsApp.
- Tidak ada klaim bahwa pesanan otomatis tersimpan ke database dari percakapan WhatsApp.
- Integrasi WhatsApp Business API untuk membaca pesan masuk dan menyimpannya otomatis adalah pekerjaan terpisah.

## 5. Panel admin

### 5.1 Akses
- Admin masuk melalui URL langsung `/admin`.
- Tidak ada link admin pada antarmuka customer.
- `/admin` menampilkan login jika belum terautentikasi dan dashboard jika sesi valid.
- Semua route, data, dan aksi admin harus dilindungi server-side serta oleh Supabase Auth/RLS. Menyembunyikan link saja tidak cukup.

### 5.2 Navigasi admin
- Dashboard.
- Produk.
- Pesanan.
- Laporan.
- Tampilan Website.
- Pengaturan.
- Logout.

### 5.3 Produk
Admin dapat:
- Melihat, menambah, mengubah, dan menghapus produk.
- Mengunggah beberapa foto.
- Mengatur nama, deskripsi, spesifikasi, kategori, harga jual, dan harga modal/HPP.
- Mengatur warna/varian dan foto khusus warna.
- Memberi label New/Best Seller.
- Menentukan produk unggulan dan urutannya.

**Harga modal:** satu harga modal per produk, berlaku untuk semua warna. Harga modal tidak boleh tersedia untuk pengunjung publik.

### 5.4 Pesanan
- Admin dapat membuat pesanan manual melalui tombol `+ Tambah Pesanan`.
- Data pelanggan: nama dan nomor WhatsApp.
- Pilih produk dari database, warna, jumlah, dan personalisasi opsional.
- Catatan pesanan.
- Mendukung beberapa item dalam satu pesanan.
- Sistem membuat nomor pesanan unik saat disimpan, misalnya `ORD-261106-A8K92`.
- Nomor dibuat dengan sumber acak yang aman, dilindungi unique constraint database, dan retry jika terjadi tabrakan.
- Status: Pesanan Baru, Diproses, Selesai, Dibatalkan.
- Simpan detail item, harga, jumlah, personalisasi, total, waktu, dan status.
- Simpan snapshot harga jual dan harga modal saat transaksi agar perubahan harga produk tidak mengubah histori.
- Pesanan dari chat WhatsApp tidak otomatis masuk ke database pada versi awal; admin dapat memasukkannya secara manual.

### 5.5 Laporan
Laporan awal dapat mencakup:
- Total penjualan.
- Total HPP produk.
- Laba kotor.
- Jumlah pesanan.
- Produk terlaris.
- Ringkasan harian dan bulanan.
- Riwayat transaksi.

Laba pada versi awal berarti **laba kotor**, bukan laba bersih. Biaya operasional tambahan belum diputuskan. Jangan mengarang biaya personalisasi/kemasan sebagai biaya aktual.

### 5.6 Tampilan website
Admin dapat mengelola banner, produk unggulan/terbaru/best seller, dan informasi brand.

### 5.7 Pengaturan
Admin dapat mengatur informasi toko, nomor WhatsApp, template pesan, dan biaya personalisasi. Nilai awal biaya personalisasi: Rp15.000 per tumbler.

## 6. Aturan harga dan perhitungan
- Harga jual produk ditetapkan per produk.
- Harga modal ditetapkan satu kali per produk, sama untuk semua warna.
- Personalisasi menambahkan Rp15.000 per tumbler.
- Total item = (harga jual + biaya personalisasi jika dipilih) × jumlah, dengan aturan per unit yang harus konsisten.
- Simpan snapshot harga jual, HPP, biaya personalisasi, dan jumlah pada item pesanan.
- Rumus laporan laba kotor harus dijelaskan dan konsisten. Jangan menyebut laba bersih jika biaya lain belum dicatat.

## 7. Kualitas dan keamanan
- Mobile-first dan responsif.
- Aksesibilitas dasar: label input, fokus keyboard, kontras memadai, alt text.
- Validasi server-side untuk data dan harga.
- Jangan percaya total harga dari browser; hitung ulang di server dari data tepercaya.
- RLS untuk seluruh tabel yang relevan.
- Harga modal dan profit hanya untuk admin.
- Secret tidak boleh masuk Git atau bundle browser.

## 8. Keputusan yang masih terbuka
1. Apakah hanya satu akun owner atau perlu beberapa akun pegawai?
2. Apakah laporan akan mencatat biaya tambahan seperti kemasan, cetak nama, atau biaya operasional?
3. Untuk kuantitas lebih dari satu dengan nama personalisasi berbeda, apakah nama dimasukkan per unit?
4. Detail final identitas brand: nama, logo, alamat, kontak, dan sosial media.
5. Nomor WhatsApp bisnis yang akan dipakai.
