"use client";
import { useActionState, useState } from "react";
import { saveProduct, type ProductFormState } from "@/lib/admin-actions";
type ProductInput = { id: string; name: string; slug: string; description: string; selling_price: number; cost_price: number; specifications: Record<string,string>; is_new: boolean; is_best_seller: boolean; is_featured: boolean; featured_order: number; is_active: boolean; categories?: { name: string } | null };
const initialState: ProductFormState = { errors: {} };
function makeSlug(value: string) { return value.toLocaleLowerCase("id-ID").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
function digits(value: string) { return value.replace(/\D/g, ""); }
export function ProductForm({ product, colors = [], images = [], relatedProducts = [], selectedRelated = [] }: { product?: ProductInput; colors?: { name: string; hex_code: string }[]; images?: { storage_path: string }[]; relatedProducts?: { id: string; name: string }[]; selectedRelated?: string[] }) {
  const [state, action, pending] = useActionState(saveProduct, initialState);
  const [name, setName] = useState(product?.name ?? "");
  const slug = makeSlug(name);
  const [selling, setSelling] = useState(product?.selling_price == null ? "" : String(product.selling_price));
  const [cost, setCost] = useState(product?.cost_price == null ? "" : String(product.cost_price));
  const error = (field: string) => state.errors[field] ? <span className="admin-field-error" role="alert">{state.errors[field]}</span> : null;
  return <form className="admin-form" action={action}>
    <input type="hidden" name="id" value={product?.id ?? ""}/>
    <label>Nama produk<input required name="name" value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(state.errors.name)}/>{error("name")}</label>
    <label>Slug URL<input required readOnly name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} placeholder="otomatis-dari-nama" aria-invalid={Boolean(state.errors.slug)}/><span className="admin-help">Dibuat otomatis dari nama produk; huruf kecil dan kata dipisahkan tanda -.</span>{error("slug")}</label>
    <label>Kategori<input name="category" defaultValue={product?.categories?.name} placeholder="Tumbler"/></label>
    <label>Deskripsi<textarea name="description" rows={4} defaultValue={product?.description}/></label>
    <div className="admin-form-grid">
      <label>Harga jual (Rp)<input required type="text" inputMode="numeric" name="selling_price" value={selling} onChange={(event) => setSelling(digits(event.target.value))} placeholder="125000" aria-invalid={Boolean(state.errors.selling_price)}/><span className="admin-help">Masukkan angka Rupiah tanpa titik, koma, atau simbol.</span>{error("selling_price")}</label>
      <label>HPP (Rp) · hanya admin<input required type="text" inputMode="numeric" name="cost_price" value={cost} onChange={(event) => setCost(digits(event.target.value))} placeholder="75000" aria-invalid={Boolean(state.errors.cost_price)}/><span className="admin-help">Wajib diisi sebagai angka Rupiah tanpa titik, koma, atau simbol.</span>{error("cost_price")}</label>
    </div>
    <div className="admin-form-grid"><label>Kapasitas<input name="capacity" defaultValue={product?.specifications?.capacity}/></label><label>Material<input name="material" defaultValue={product?.specifications?.material}/></label><label>Dimensi<input name="dimensions" defaultValue={product?.specifications?.dimensions}/></label><label>Urutan unggulan<input type="number" min="0" name="featured_order" defaultValue={product?.featured_order ?? 0}/></label></div>
    <label>Nama warna (satu nama per baris)<textarea name="colors" rows={4} defaultValue={colors.map((c) => c.name).join("\n")} placeholder={'Dusty Pink\nIvory\nPutih'} /><span className="admin-help">Cukup ketik nama warna. Warna umum akan dicocokkan otomatis; nama lain tetap bisa disimpan.</span>{error("colors")}</label>
    <fieldset><legend>Sering dibeli bareng (maksimal 3)</legend><div className="admin-related-options">{relatedProducts.map((item) => <label key={item.id}><input type="checkbox" name="related_product" value={item.id} defaultChecked={selectedRelated.includes(item.id)}/>{item.name}</label>)}</div></fieldset>
    <label>Foto produk (bisa pilih beberapa foto dari perangkat)<input type="file" name="photos" accept="image/jpeg,image/png,image/webp,image/avif" multiple/></label>
    <label>Warna untuk foto di atas (opsional)<input name="photo_color_name" list="product-color-names" placeholder="Nama harus sama persis dengan warna"/><datalist id="product-color-names">{colors.map((color) => <option key={color.name} value={color.name}/>)}</datalist></label>
    {images.length > 0 && <p>{images.length} foto tersimpan</p>}
    <div className="admin-checks"><label><input type="checkbox" name="is_new" defaultChecked={product?.is_new}/> Terbaru</label><label><input type="checkbox" name="is_best_seller" defaultChecked={product?.is_best_seller}/> Terlaris</label><label><input type="checkbox" name="is_featured" defaultChecked={product?.is_featured}/> Unggulan</label><label><input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true}/> Aktif</label></div>
    <p className="admin-help">Produk tidak dihapus permanen. Nonaktifkan produk untuk mengeluarkannya dari katalog sambil menjaga histori pesanan.</p>
    {state.formError && <p className="admin-field-error" role="alert">{state.formError}</p>}
    <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan Produk"}</button>
  </form>;
}
