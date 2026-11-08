import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatRupiah } from "@/lib/format";

export function ProductCard({ product, storeName = "Lunara Tumbler" }: { product: Product; storeName?: string }) {
  const cover = product.colors[0];

  return (
    <article className="product-card">
      <Link className="product-art-link" href={`/products/${product.slug}`} aria-label={`Lihat detail ${product.name}`}>
        <div className="product-art-wrap">
          {cover?.image ? <Image
            className="product-art"
            src={cover.image}
            alt={`${product.name}, warna ${cover.name}`}
            width={720}
            height={720}
            sizes="(max-width: 640px) 84vw, (max-width: 1024px) 42vw, 24vw"
          /> : <span className="product-placeholder" aria-hidden="true">L</span>}
        </div>
      </Link>
      <div className="product-card-copy">
        <div className="product-title-row">
          <div>
            <p className="product-kicker">{storeName}</p>
            <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3>
          </div>
          <span className="product-price">{formatRupiah(product.price)}</span>
        </div>
        <div className="product-card-bottom">
          <span className="color-names" aria-label={`Pilihan warna: ${product.colors.map((color) => color.name).join(", ")}`}>
            {product.colors.slice(0, 2).map((color) => color.name).join(" · ")}{product.colors.length > 2 ? ` +${product.colors.length - 2}` : ""}
          </span>
          <Link className="text-link" href={`/products/${product.slug}`}>Detail <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </article>
  );
}
