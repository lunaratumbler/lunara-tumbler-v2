import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { deactivateProduct } from "@/lib/admin-actions";
import { formatRupiah } from "@/lib/format";
export default async function ProductsPage() {
  const { supabase } = await requireAdmin();
  const { data: products, error } = await supabase.from("products").select("id,name,slug,selling_price,cost_price,is_active,is_new,is_best_seller").order("created_at", { ascending: false });
  return <><header className="admin-page-heading"><div><p className="eyebrow">KATALOG</p><h1>Produk</h1></div><Link className="button button-primary" href="/admin/products/new">Tambah Produk</Link></header>{error && <p role="alert">{error.message}</p>}<div className="admin-card-list">{products?.map((product) => <article className="admin-card" key={product.id}><div className="admin-card-main"><h2>{product.name}</h2><p>{formatRupiah(product.selling_price)} · HPP {formatRupiah(product.cost_price)}</p><span className={product.is_active ? "admin-status active" : "admin-status"}>{product.is_active ? "Aktif" : "Nonaktif"}</span></div><div className="admin-card-actions"><Link href={`/admin/products/${product.id}`}>Ubah</Link>{product.is_active && <form action={deactivateProduct}><input type="hidden" name="id" value={product.id}/><button type="submit">Nonaktifkan</button></form>}</div></article>)}</div>{!products?.length && <p>Belum ada produk. Tambahkan produk untuk mulai mengisi katalog.</p>}</>;
}
