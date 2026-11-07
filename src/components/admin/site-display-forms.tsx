"use client";

import Image from "next/image";
import { useActionState, useId } from "react";
import { saveBanner, saveBrandInfo, saveProductDisplay, type SiteDisplayActionState } from "@/lib/admin-actions";

const initialState: SiteDisplayActionState = { errors: {} };

export type SiteBanner = {
  id: string;
  title: string;
  subtitle: string;
  alt_text: string;
  image_path: string;
  button_label: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
};

export type DisplayProduct = {
  id: string;
  name: string;
  is_featured: boolean;
  featured_order: number;
  is_new: boolean;
  newest_order: number;
  is_best_seller: boolean;
  best_seller_order: number;
};

export function BrandInfoForm({ storeName, tagline, description }: { storeName: string; tagline: string; description: string }) {
  const [state, action, pending] = useActionState(saveBrandInfo, initialState);
  const id = useId();
  return <form className="admin-form" action={action}>
    <label>Nama brand<input name="store_name" defaultValue={storeName} maxLength={80} required aria-invalid={Boolean(state.errors.store_name)}/>{state.errors.store_name && <span className="admin-field-error" role="alert">{state.errors.store_name}</span>}</label>
    <label>Tagline<input name="brand_tagline" defaultValue={tagline} maxLength={160} required aria-invalid={Boolean(state.errors.brand_tagline)}/>{state.errors.brand_tagline && <span className="admin-field-error" role="alert">{state.errors.brand_tagline}</span>}</label>
    <label htmlFor={`${id}-about`}>Tentang brand<textarea id={`${id}-about`} name="brand_description" defaultValue={description} rows={4} maxLength={1000} required aria-invalid={Boolean(state.errors.brand_description)}/>{state.errors.brand_description && <span className="admin-field-error" role="alert">{state.errors.brand_description}</span>}</label>
    <FormFeedback state={state}/>
    <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan informasi brand"}</button>
  </form>;
}

export function BannerForm({ banner, imageUrl }: { banner?: SiteBanner; imageUrl?: string }) {
  const [state, action, pending] = useActionState(saveBanner, initialState);
  const id = useId();
  const fieldError = (field: string) => state.errors[field] && <span className="admin-field-error" role="alert">{state.errors[field]}</span>;
  return <form className="admin-form banner-edit-form" action={action}>
    {banner && <input type="hidden" name="id" value={banner.id}/>}
    {imageUrl && <Image className="banner-preview" src={imageUrl} alt={`Pratinjau banner: ${banner?.title ?? "banner baru"}`} width={1000} height={360} sizes="(max-width: 760px) 100vw, 800px"/>}
    <label>Judul banner<input name="title" defaultValue={banner?.title ?? ""} maxLength={100} required aria-invalid={Boolean(state.errors.title)}/>{fieldError("title")}</label>
    <label>Subjudul<input name="subtitle" defaultValue={banner?.subtitle ?? ""} maxLength={220} required aria-invalid={Boolean(state.errors.subtitle)}/>{fieldError("subtitle")}</label>
    <label>Deskripsi gambar untuk pembaca layar<input name="alt_text" defaultValue={banner?.alt_text ?? ""} maxLength={180} required aria-invalid={Boolean(state.errors.alt_text)}/>{fieldError("alt_text")}</label>
    <label>{banner ? "Ganti gambar (opsional)" : "Gambar banner"}<input id={`${id}-image`} type="file" name="image" accept="image/jpeg,image/png,image/webp,image/avif" required={!banner}/><span className="admin-help">JPG, PNG, WebP, atau AVIF; maksimal 10 MB.</span>{fieldError("image")}</label>
    <div className="admin-form-grid">
      <label>Teks tombol<input name="button_label" defaultValue={banner?.button_label ?? "Jelajahi Katalog"} maxLength={40} required aria-invalid={Boolean(state.errors.button_label)}/>{fieldError("button_label")}</label>
      <label>Tautan tombol<input name="link_url" type="text" inputMode="url" defaultValue={banner?.link_url ?? "/catalog"} required aria-invalid={Boolean(state.errors.link_url)}/><span className="admin-help">Gunakan tautan HTTPS atau jalur halaman situs.</span>{fieldError("link_url")}</label>
    </div>
    <div className="admin-form-grid">
      <label>Urutan banner<input name="sort_order" type="number" inputMode="numeric" min="0" step="1" defaultValue={banner?.sort_order ?? 0} required aria-invalid={Boolean(state.errors.sort_order)}/>{fieldError("sort_order")}</label>
      <label className="admin-inline-check"><input type="checkbox" name="is_active" defaultChecked={banner?.is_active ?? true}/>Tampilkan di beranda</label>
    </div>
    <FormFeedback state={state}/>
    <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Menyimpan…" : banner ? "Simpan perubahan banner" : "Tambah banner"}</button>
  </form>;
}

export function ProductDisplayForm({ product }: { product: DisplayProduct }) {
  const [state, action, pending] = useActionState(saveProductDisplay, initialState);
  return <form className="site-product-form" action={action}>
    <input type="hidden" name="id" value={product.id}/>
    <div className="site-product-selects">
      <label className="admin-inline-check"><input type="checkbox" name="is_featured" defaultChecked={product.is_featured}/>Unggulan</label>
      <label className="admin-inline-check"><input type="checkbox" name="is_new" defaultChecked={product.is_new}/>Terbaru</label>
      <label className="admin-inline-check"><input type="checkbox" name="is_best_seller" defaultChecked={product.is_best_seller}/>Terlaris</label>
    </div>
    <div className="site-product-orders">
      <label>Urutan unggulan<input name="featured_order" type="number" min="0" step="1" inputMode="numeric" defaultValue={product.featured_order} required aria-invalid={Boolean(state.errors.featured_order)}/>{state.errors.featured_order && <span className="admin-field-error" role="alert">{state.errors.featured_order}</span>}</label>
      <label>Urutan terbaru<input name="newest_order" type="number" min="0" step="1" inputMode="numeric" defaultValue={product.newest_order} required aria-invalid={Boolean(state.errors.newest_order)}/>{state.errors.newest_order && <span className="admin-field-error" role="alert">{state.errors.newest_order}</span>}</label>
      <label>Urutan terlaris<input name="best_seller_order" type="number" min="0" step="1" inputMode="numeric" defaultValue={product.best_seller_order} required aria-invalid={Boolean(state.errors.best_seller_order)}/>{state.errors.best_seller_order && <span className="admin-field-error" role="alert">{state.errors.best_seller_order}</span>}</label>
    </div>
    <FormFeedback state={state}/>
    <button className="button button-outline" type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan pilihan"}</button>
  </form>;
}

function FormFeedback({ state }: { state: SiteDisplayActionState }) {
  return <>
    {state.formError && <p className="admin-field-error" role="alert">{state.formError}</p>}
    {state.success && <p className="admin-form-success" role="status">{state.success}</p>}
  </>;
}
