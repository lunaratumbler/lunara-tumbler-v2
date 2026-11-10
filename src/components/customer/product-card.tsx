import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatRupiah } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.colors[0];

  return <article className="product-card"><Link className="product-art-link" href={`/products/${product.slug}`} aria-label={`Lihat detail ${product.name}`}><div className="product-art-wrap">{cover?.image ? <Image className="product-art" src={cover.image} alt={`${product.name}, warna ${cover.name}`} width={720} height={900} sizes="(max-width: 760px) 46vw, (max-width: 1024px) 31vw, 24vw"/> : <span className="product-placeholder" aria-hidden="true">L</span>}</div></Link><div className="product-card-copy"><h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3><span className="product-price">{formatRupiah(product.price)}</span><div className="product-card-bottom"><span className="color-names" aria-label={`Pilihan warna: ${product.colors.map((color) => color.name).join(", ")}`}>{product.colors.length ? `${product.colors.length} pilihan warna` : "Warna belum tersedia"}</span></div></div></article>;
}
