import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const { supabase } = await requireAdmin();
  const [{ data: product }, { data: colors }, { data: images }] = await Promise.all([
    supabase.from("products").select("*,categories(name)").eq("id", id).maybeSingle(), supabase.from("product_colors").select("name,hex_code").eq("product_id", id).order("sort_order"), supabase.from("product_images").select("storage_path").eq("product_id", id).order("sort_order"),
  ]);
  if (!product) notFound();
  return <><header className="admin-page-heading"><div><p className="eyebrow">KATALOG</p><h1>Ubah Produk</h1></div></header><ProductForm product={product} colors={colors ?? []} images={images ?? []}/></>;
}
