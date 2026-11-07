import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";
export default async function NewProductPage() { const { supabase } = await requireAdmin(); const { data } = await supabase.from("products").select("id,name").eq("is_active", true); return <><header className="admin-page-heading"><div><p className="eyebrow">KATALOG</p><h1>Tambah Produk</h1></div><Link href="/admin/products">Kembali</Link></header><ProductForm relatedProducts={data ?? []}/></>; }
