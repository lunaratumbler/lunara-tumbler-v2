import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/customer/product-card";
import type { Product } from "@/data/products";
import { LatestProductCarousel } from "@/components/customer/latest-product-carousel";
import { getPublicProducts, getStoreSettings } from "@/lib/store";

export default async function Home() {
  const [products, settings] = await Promise.all([getPublicProducts(), getStoreSettings()]);
  const bannerImage = settings.banners[0];

  return <main>
    <section className="home-banner page-width" aria-labelledby="home-title">
      {bannerImage && <Image className="home-banner-image" src={bannerImage.image_path} alt={bannerImage.alt_text || "Banner Lunara Tumbler"} width={1440} height={520} priority sizes="(max-width: 760px) calc(100vw - 32px), 1240px"/>}
      <div className="home-banner-shade" aria-hidden="true" />
      <div className="home-banner-copy">
        <p className="eyebrow">Lunara Tumbler</p>
        <h1 id="home-title">Lunara</h1>
        <h2>Tumbler untuk dipakai setiap hari.</h2>
        <p>Pilih warna dan tambahkan nama bila diperlukan.</p>
        <Link className="button button-primary" href="/catalog">Lihat Katalog</Link>
      </div>
    </section>

    <LatestProductCarousel products={products} personalizationFee={settings.personalization_fee}/>
    <section className="intro-strip page-width" id="tentang"><p className="eyebrow">TENTANG {settings.store_name.toLocaleUpperCase("id-ID")}</p><h2>Tumbler untuk harian.</h2><p>Pilih produk dan warna, lalu pesan melalui WhatsApp.</p></section>
  </main>;
}

function byOrder(products: Product[], getOrder: (product: Product) => number): Product[] {
  return [...products].sort((left, right) => getOrder(left) - getOrder(right) || left.name.localeCompare(right.name, "id"));
}

function ProductSection({ id, storeName, eyebrow, title, description, items }: { id: string; storeName: string; eyebrow: string; title: string; description: string; items: Product[] }) {
  return <section className="product-section page-width" id={id}><div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{description}</p></div><Link className="text-link" href="/catalog">Lihat katalog <span aria-hidden="true">↗</span></Link></div>{items.length ? <div className="product-grid">{items.map((product) => <ProductCard product={product} key={product.id}/>)}</div> : <p className="catalog-empty">Produk belum tersedia.</p>}</section>;
}
