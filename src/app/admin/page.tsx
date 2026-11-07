import Link from "next/link";
import { getAdmin } from "@/lib/admin";
import { login } from "@/lib/admin-actions";
export default async function AdminHome({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const admin = await getAdmin();
  if (!admin) { const { error } = await searchParams; return <section className="admin-login"><p className="eyebrow">LUNARA TUMBLER</p><h1>Masuk Admin</h1><p>Kelola produk, pesanan, dan informasi toko.</p>{error === "config" && <p role="alert">Konfigurasi Supabase belum tersedia.</p>}{error === "login" && <p role="alert">Email atau kata sandi tidak sesuai.</p>}<form action={login}><label>Email<input name="email" type="email" autoComplete="username" required/></label><label>Kata sandi<input name="password" type="password" autoComplete="current-password" required/></label><button className="button button-primary" type="submit">Masuk</button></form></section>; }
  const [{ count: products, error: productError }, { count: orders, error: orderError }] = await Promise.all([admin.supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true), admin.supabase.from("orders").select("id", { count: "exact", head: true })]);
  const countError = productError || orderError;
  return <><header className="admin-page-heading"><div><p className="eyebrow">LUNARA TUMBLER</p><h1>Ringkasan</h1></div></header>{countError ? <p role="alert">Ringkasan belum dapat dimuat. Periksa koneksi, lalu coba lagi.</p> : <div className="admin-stat-grid"><article><span>Produk aktif</span><strong>{products ?? 0}</strong></article><article><span>Total pesanan</span><strong>{orders ?? 0}</strong></article></div>}<section className="admin-panel"><h2>Mulai kelola</h2><div className="admin-shortcuts"><Link href="/admin/products/new">Tambah produk</Link><Link href="/admin/orders">Buat pesanan manual</Link><Link href="/admin/settings">Perbarui pengaturan</Link></div></section></>;
}
