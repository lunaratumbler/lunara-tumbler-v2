"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/customer/cart-provider";
import { formatRupiah } from "@/lib/format";
import { WhatsAppIcon } from "@/components/layout/whatsapp-icon";

export function ProductDetail({ product, storeName, personalizationFee, whatsappHref }: { product: Product; storeName: string; personalizationFee: number; whatsappHref?: string }) {
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [image, setImage] = useState(product.colors[0]?.image || product.gallery[0] || "");
  const [quantity, setQuantity] = useState(1), [personalized, setPersonalized] = useState(false), [name, setName] = useState(""), [error, setError] = useState(false), [toast, setToast] = useState(false), [loading, setLoading] = useState(false);
  const { addLine } = useCart();
  const color = product.colors.find((option) => option.id === colorId) ?? product.colors[0];
  const gallery = useMemo(() => [...new Set([color?.image, ...product.gallery].filter((src): src is string => !!src))], [color?.image, product.gallery]);
  const unitPrice = product.price + (personalized ? personalizationFee : 0);
  function changeColor(id: string) { const next = product.colors.find((item) => item.id === id); if (next) { setColorId(id); if (next.image) setImage(next.image); } }
  function addToCart() {
    if (personalized && !name.trim()) { setError(true); return; }
    setLoading(true);
    addLine({ product, colorId, personalized, personalizationName: name, quantity, fee: personalizationFee });
    setError(false); setToast(true); window.setTimeout(() => setToast(false), 2500); window.setTimeout(() => setLoading(false), 250);
  }
  return <main className="page-width product-detail-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Beranda</Link><span aria-hidden="true">/</span><Link href="/catalog">Katalog</Link><span aria-hidden="true">/</span><span>{product.name}</span></nav>
    <div className="detail-layout"><div className="detail-gallery"><div className="detail-main-image">{image ? <Image src={image} alt={`${product.name}${color ? ` warna ${color.name}` : ""}`} width={720} height={720} priority sizes="(max-width: 760px) 100vw, 54vw"/> : <div className="product-placeholder large" aria-label="Foto produk akan segera hadir">L</div>}{personalized && name.trim() && <span className="personalization-preview" aria-label={`Pratinjau nama ${name}`}>{name.trim().slice(0, 24)}</span>}</div><div className="gallery-thumbnails" aria-label="Galeri produk">{gallery.map((src, index) => <button className={`gallery-thumb${image === src ? " is-selected" : ""}`} key={src} type="button" aria-label={`Lihat foto ${index + 1} ${product.name}`} aria-pressed={image === src} onClick={() => setImage(src)}><Image src={src} alt="" width={120} height={120} sizes="(max-width: 760px) 28vw, 12vw"/></button>)}</div></div>
    <section className="detail-copy" aria-labelledby="product-name"><p className="eyebrow">{storeName}</p><h1 id="product-name">{product.name}</h1><p className="detail-price">{formatRupiah(product.price)}</p><p className="detail-description">{product.description || "Tumbler pilihan untuk menemani rutinitas dan momen kecil yang berarti."}</p>
        {color && <fieldset className="color-selector"><legend>Warna: <span>{color.name}</span></legend><div className="color-name-options">{product.colors.map((option) => <button className={`color-name-option${colorId === option.id ? " is-selected" : ""}`} key={option.id} type="button" aria-pressed={colorId === option.id} onClick={() => changeColor(option.id)}>{option.name}</button>)}</div></fieldset>}
        <div className="personalization-option"><label className="check-row"><input type="checkbox" checked={personalized} onChange={(event) => { setPersonalized(event.target.checked); setError(false); }}/><span className="custom-check" aria-hidden="true">✓</span><span>Bikin jadi hadiah spesial - Tambah nama kamu / nama dia, cuma +{formatRupiah(personalizationFee)}</span></label>{personalized && <div className="name-field"><label htmlFor="personalization-name">Nama untuk personalisasi</label><input id="personalization-name" autoComplete="off" maxLength={24} value={name} onChange={(event) => { setName(event.target.value); setError(false); }} placeholder="Tulis nama di sini" aria-invalid={error}/>{error && <p className="field-error" role="alert">Isi nama personalisasi terlebih dahulu.</p>}</div>}</div>
        <div className="detail-purchase-row"><div className="quantity-control" aria-label="Jumlah produk"><button type="button" aria-label="Kurangi jumlah" disabled={quantity <= 1} onClick={() => setQuantity((v) => Math.max(1, v - 1))}>−</button><output aria-live="polite">{quantity}</output><button type="button" aria-label="Tambah jumlah" onClick={() => setQuantity((v) => v + 1)}>+</button></div><button className="button button-primary add-cart-button" type="button" onClick={addToCart} disabled={loading}>{loading ? "Menambahkan…" : "Tambah ke Keranjang"}</button></div>
        <p className="detail-estimate">Total pilihan ini: <strong>{formatRupiah(unitPrice * quantity)}</strong></p>{toast && <p className="success-message" role="status">Ditambahkan ke Keranjang · <Link href="/cart">Lihat keranjang</Link></p>}
        <div className="specifications"><h2>Detail produk</h2><dl><div><dt>Kapasitas</dt><dd>{product.capacity || "—"}</dd></div><div><dt>Material</dt><dd>{product.material || "—"}</dd></div><div><dt>Dimensi</dt><dd>{product.dimensions || "—"}</dd></div></dl></div>
        {product.related?.length ? <section className="related-products"><h2>Sering dibeli bareng</h2><div className="related-list">{product.related.slice(0, 3).map((item) => <Link key={item.id} href={`/products/${item.slug}`}>{item.name} · {formatRupiah(item.price)}</Link>)}</div></section> : null}
        {whatsappHref && <div className="detail-marketing"><a className="button button-outline" href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon/>Hubungi via WhatsApp</a><p className="trust-line">Tim {storeName} siap membantu menjawab pertanyaanmu.</p></div>}
    </section></div></main>;
}
