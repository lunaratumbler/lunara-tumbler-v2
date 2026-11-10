import { ProductCard } from "@/components/customer/product-card";
import type { Product } from "@/data/products";

export function LatestProductCarousel({ products }: { products: Product[]; personalizationFee: number }) {
  const latestProducts = [...products]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 8);

  if (!latestProducts.length) return null;

  return <section className="latest-products page-width" aria-labelledby="latest-products-title"><div className="section-heading"><div><h2 id="latest-products-title">Produk Terbaru</h2><p>Produk yang baru ditambahkan ke katalog.</p></div></div><div className="product-grid">{latestProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div></section>;
}
