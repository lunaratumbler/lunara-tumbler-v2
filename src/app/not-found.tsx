import Link from "next/link";

export default function NotFound() {
  return <main className="page-width not-found-page">
    <p className="eyebrow">LUNARA TUMBLER</p>
    <h1>Halaman tidak ditemukan</h1>
    <p>Maaf, halaman yang kamu cari tidak tersedia atau sudah berubah.</p>
    <div className="not-found-actions">
      <Link className="button button-primary" href="/">Kembali ke Beranda</Link>
      <Link className="button button-outline" href="/catalog">Lihat Katalog</Link>
    </div>
  </main>;
}
