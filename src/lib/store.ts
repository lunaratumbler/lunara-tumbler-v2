import type { Product, ProductColor } from "@/data/products";
import { createClient } from "@/lib/supabase/server";

type ProductRow = { id: string; slug: string; name: string; description: string; selling_price: number; specifications: Record<string, string> | null; is_featured: boolean; is_new: boolean; is_best_seller: boolean; featured_order: number; newest_order: number; best_seller_order: number; product_colors: { id: string; name: string; hex_code: string; product_images: { storage_path: string; sort_order: number }[] }[]; product_images: { storage_path: string; sort_order: number }[]; related_products?: ProductRow[] };
export type StoreSettings = { store_name: string; brand_tagline: string; whatsapp_number: string; whatsapp_template: string; personalization_fee: number; brand_description: string; instagram_url: string | null; banners: { title: string; subtitle: string; alt_text: string; image_path: string; button_label: string; link_url: string | null }[] };

export async function getPublicProducts(): Promise<Product[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase.rpc("get_public_catalog");
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function getPublicProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.rpc("get_public_product", { product_slug: slug });
  const row = (data as ProductRow[] | null)?.[0];
  return row ? mapProduct(row) : null;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const fallback: StoreSettings = { store_name: "Lunara Tumbler", brand_tagline: "Warna lembut, cerita personal.", whatsapp_number: "", whatsapp_template: "", personalization_fee: 15000, brand_description: "Temukan warna yang terasa paling dekat dengan dirimu. Setiap tumbler Lunara hadir untuk menemani rutinitas dan momen kecil yang berarti.", instagram_url: null, banners: [] };
  const supabase = await createClient();
  if (!supabase) return fallback;
  const { data } = await supabase.rpc("get_public_settings");
  const settings = { ...fallback, ...((data as Partial<StoreSettings> | null) ?? {}) };
  return { ...settings, banners: (settings.banners ?? []).map((banner) => ({ ...banner, subtitle: banner.subtitle ?? "", button_label: banner.button_label || "Jelajahi Katalog", image_path: publicImage(banner.image_path) })) };
}

function mapProduct(row: ProductRow): Product {
  const colors: ProductColor[] = (row.product_colors ?? []).map((color) => ({
    id: color.id, name: color.name,
    image: publicImage(color.product_images?.[0]?.storage_path ?? row.product_images?.[0]?.storage_path ?? ""),
  }));
  const gallery = (row.product_images ?? []).map((image) => publicImage(image.storage_path));
  return {
    id: row.id, slug: row.slug, name: row.name, price: row.selling_price, description: row.description,
    capacity: row.specifications?.capacity ?? "", material: row.specifications?.material ?? "",
    dimensions: row.specifications?.dimensions ?? "", featured: row.is_featured,
    featuredOrder: row.featured_order ?? 0, isNew: row.is_new, newestOrder: row.newest_order ?? 0,
    isBestSeller: row.is_best_seller, bestSellerOrder: row.best_seller_order ?? 0, colors, gallery,
    related: (row.related_products ?? []).map((item) => mapProduct({ ...item, related_products: [] })),
  };
}

function publicImage(path: string): string {
  if (!path || path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base ? `${base}/storage/v1/object/public/product-photos/${path}` : "";
}
