import type { Metadata } from "next";
import { ProductCard } from "@/components/customer/product-card";
import type { Product } from "@/data/products";
import { getPublicProducts, getStoreSettings } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  return { title: `Katalog | ${settings.store_name}`, description: settings.brand_tagline };
}

export default async function CatalogPage() {
  const [products, settings] = await Promise.all([getPublicProducts(), getStoreSettings()]);
  const featured = byOrder(products.filter((product) => product.featured), (product) => product.featuredOrder);
  const newest = byOrder(products.filter((product) => product.isNew), (product) => product.newestOrder);
  const bestSellers = byOrder(products.filter((product) => product.isBestSeller), (product) => product.bestSellerOrder);
  const priorityProducts = [...featured, ...newest, ...bestSellers];
  const orderedCatalog = [...new Map([...priorityProducts, ...products].map((product) => [product.id, product])).values()];

  return <main className="page-width catalog-page">
    <div className="page-intro"><p className="eyebrow">LUNARA TUMBLER</p><h1>Katalog</h1><p>Pilih tumbler sesuai warna dan kebutuhan kamu. Tambahkan nama untuk hadiah yang lebih personal, lalu pesan langsung lewat WhatsApp.</p></div>
    {orderedCatalog.length ? <div className="catalog-grid">{orderedCatalog.map((product) => <ProductCard product={product} storeName={settings.store_name} key={product.id}/>)}</div> : <section className="empty-cart catalog-empty-state"><span className="empty-cart-icon" aria-hidden="true">♡</span><h2>Koleksi sedang disiapkan</h2><p>Pilihan {settings.store_name} akan segera hadir di sini.</p></section>}
  </main>;
}

function byOrder(products: Product[], getOrder: (product: Product) => number): Product[] {
  return [...products].sort((left, right) => getOrder(left) - getOrder(right) || left.name.localeCompare(right.name, "id"));
}
