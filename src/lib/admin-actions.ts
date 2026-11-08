"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { resolveProductColorHex } from "@/lib/product-colors";

export async function login(form: FormData) {
  const supabase = await createClient(); if (!supabase) redirect("/admin?error=config");
  const email = String(form.get("email") ?? "").trim(), password = String(form.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin?error=login");
  redirect("/admin");
}
export async function logout() { const supabase = await createClient(); await supabase?.auth.signOut(); redirect("/admin"); }
export type ProductFormState = { errors: Record<string, string>; formError?: string };
export async function saveProduct(_previous: ProductFormState, form: FormData): Promise<ProductFormState> {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id") ?? ""), name = String(form.get("name") ?? "").trim();
  const slug = name.toLocaleLowerCase("id-ID").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Nama produk wajib diisi.";
  if (!slug) errors.slug = "Nama produk harus menghasilkan slug yang valid.";
  if (hasPhoneLikeNumber(name)) errors.name = "Nomor telepon tidak boleh ditampilkan pada informasi produk.";
  if (hasPhoneLikeNumber(String(form.get("description") ?? ""))) errors.description = "Nomor telepon tidak boleh ditampilkan pada informasi produk.";
  const parsePrice = (field: string, label: string) => {
    const raw = String(form.get(field) ?? "").trim();
    const normalized = raw.replace(/^Rp\s*/i, "").replace(/[.,\s]/g, "");
    if (!normalized || !/^\d+$/.test(normalized)) { errors[field] = `${label} wajib diisi dengan angka Rupiah bulat saja.`; return null; }
    const value = Number(normalized);
    if (!Number.isSafeInteger(value)) { errors[field] = `${label} terlalu besar.`; return null; }
    return value;
  };
  const sellingPrice = parsePrice("selling_price", "Harga jual");
  const costPrice = parsePrice("cost_price", "Harga modal");
  const colorText = String(form.get("colors") ?? "").trim();
  const colors = colorText ? colorText.split("\n").map((line) => line.trim()).filter(Boolean) : [];
  if (colors.some((colorName) => colorName.length > 60)) errors.colors = "Nama warna maksimal 60 karakter.";
  if (colors.some(hasPhoneLikeNumber)) errors.colors = "Nomor telepon tidak boleh dipakai sebagai nama warna.";
  if (Object.keys(errors).length) return { errors };
  const categoryName = String(form.get("category") ?? "").trim();
  let categoryId: string | null = null;
  if (categoryName) {
    const categorySlug = categoryName.toLocaleLowerCase("id-ID").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const result = await supabase.from("categories").upsert({ name: categoryName, slug: categorySlug, is_active: true }, { onConflict: "slug" }).select("id").single();
    if (result.error) throw new Error(result.error.message); categoryId = result.data.id;
  }
  const values = { name, slug, category_id: categoryId, description: String(form.get("description") ?? "").trim(), selling_price: sellingPrice, cost_price: costPrice };
  const saved = id ? await supabase.from("products").update(values).eq("id", id).select("id").single() : await supabase.from("products").insert(values).select("id").single();
  if (saved.error) {
    if (saved.error.code === "23505") return { errors: { slug: "Slug ini sudah dipakai produk lain. Ubah nama produk agar slug berbeda." } };
    return { errors: {}, formError: `Produk gagal disimpan: ${saved.error.message}` };
  }
  const productId = saved.data.id;
  if (colorText) {
    const { data: previous } = await supabase.from("product_colors").select("id,name").eq("product_id", productId);
    for (const [sort_order, colorName] of colors.entries()) {
      const old = previous?.find((color) => color.name.toLowerCase() === colorName.toLowerCase());
      const values = { product_id: productId, name: colorName, hex_code: resolveProductColorHex(colorName), sort_order, is_active: true };
      const result = old ? await supabase.from("product_colors").update(values).eq("id", old.id) : await supabase.from("product_colors").insert(values);
      if (result.error) throw new Error(result.error.message);
    }
    const retained = colors.map((colorName) => colorName.toLowerCase());
    for (const color of previous ?? []) if (!retained.includes(color.name.toLowerCase())) await supabase.from("product_colors").update({ is_active: false }).eq("id", color.id);
  }
  const photoFiles = form.getAll("photos").filter((file): file is File => file instanceof File && file.size > 0);
  if (photoFiles.reduce((sum, file) => sum + file.size, 0) > 45 * 1024 * 1024) throw new Error("Total ukuran foto dalam satu kali unggah maksimal 45 MB.");
  for (const file of photoFiles) {
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) throw new Error("Foto harus berupa gambar maksimal 10 MB.");
    const path = `${productId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const upload = await supabase.storage.from("product-photos").upload(path, file, { contentType: file.type, upsert: false });
    if (upload.error) throw new Error(upload.error.message);
    const image = await supabase.from("product_images").insert({ product_id: productId, product_color_id: null, storage_path: path, alt_text: name });
    if (image.error) throw new Error(image.error.message);
  }
  revalidatePath("/"); revalidatePath("/catalog"); revalidatePath(`/products/${slug}`); revalidatePath("/admin/products"); redirect("/admin/products");
}
export async function deactivateProduct(form: FormData) {
  const { supabase } = await requireAdmin(); const id = String(form.get("id") ?? "");
  const { error } = await supabase.from("products").update({ is_active: false }).eq("id", id);
  if (error) throw new Error(error.message); revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/admin/products");
}
export async function reactivateProduct(form: FormData) {
  const { supabase } = await requireAdmin(); const id = String(form.get("id") ?? "");
  const { error } = await supabase.from("products").update({ is_active: true }).eq("id", id);
  if (error) throw new Error(error.message); revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/admin/products"); revalidatePath("/admin/products/inactive");
}
export async function createManualOrder(form: FormData) {
  const { supabase } = await requireAdmin();
  let items: unknown;
  try { items = JSON.parse(String(form.get("items") ?? "[]")); } catch { throw new Error("Format item pesanan tidak valid."); }
  const { error } = await supabase.rpc("create_manual_order", { payload: { customer_name: String(form.get("customer_name") ?? "").trim(), customer_whatsapp: String(form.get("customer_whatsapp") ?? "").trim(), notes: String(form.get("notes") ?? ""), items } });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders"); revalidatePath("/admin/reports");
  redirect("/admin/orders?created=1");
}
export async function updateOrderStatus(form: FormData) {
  const { supabase, user } = await requireAdmin(); const id = String(form.get("id") ?? ""), status = String(form.get("status") ?? "");
  if (!["new", "processing", "completed", "cancelled"].includes(status)) throw new Error("Status tidak valid.");
  const { data: current } = await supabase.from("orders").select("status").eq("id", id).single();
  const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  await supabase.from("order_status_history").insert({ order_id: id, old_status: current?.status ?? null, new_status: status, changed_by: user.id });
  revalidatePath("/admin/orders"); revalidatePath("/admin/reports");
}
export async function saveSettings(_previous: SiteDisplayActionState, form: FormData): Promise<SiteDisplayActionState> {
  const { supabase } = await requireAdmin(); const enteredPhone = String(form.get("whatsapp_number") ?? "").replace(/[^\d]/g, "");
  const phone = enteredPhone.startsWith("0") ? `62${enteredPhone.slice(1)}` : enteredPhone;
  const fee = parseRequiredInteger(form.get("personalization_fee"));
  const storeName = String(form.get("store_name") ?? "").trim();
  const errors: Record<string, string> = {};
  if (!/^62\d{8,13}$/.test(phone)) errors.whatsapp_number = "Masukkan nomor WhatsApp Indonesia yang valid.";
  if (fee === null) errors.personalization_fee = "Biaya harus berupa angka Rupiah bulat nol atau lebih.";
  if (!storeName || storeName.length > 80) errors.store_name = "Nama toko wajib diisi dan maksimal 80 karakter.";
  if (hasPhoneLikeNumber(storeName)) errors.store_name = "Nomor telepon tidak boleh tampil sebagai nama toko.";
  if (Object.keys(errors).length || fee === null) return { errors };
  const { error } = await supabase.from("site_settings").update({ store_name: storeName, whatsapp_number: phone, personalization_fee: fee, updated_at: new Date().toISOString() }).eq("id", true);
  if (error) return { errors: {}, formError: "Pengaturan gagal disimpan. Periksa koneksi, lalu coba lagi." };
  revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/cart"); revalidatePath("/products/[slug]", "page"); revalidatePath("/admin/settings"); revalidatePath("/admin/site");
  return { errors: {}, success: "Pengaturan berhasil disimpan." };
}
export type SiteDisplayActionState = { errors: Record<string, string>; formError?: string; success?: string };
const emptySiteDisplayState: SiteDisplayActionState = { errors: {} };

export async function saveBrandInfo(_previous: SiteDisplayActionState, form: FormData): Promise<SiteDisplayActionState> {
  const { supabase } = await requireAdmin();
  const storeName = String(form.get("store_name") ?? "").trim();
  const tagline = String(form.get("brand_tagline") ?? "").trim();
  const description = String(form.get("brand_description") ?? "").trim();
  const errors: Record<string, string> = {};
  if (!storeName || storeName.length > 80) errors.store_name = "Nama brand wajib diisi dan maksimal 80 karakter.";
  if (!tagline || tagline.length > 160) errors.brand_tagline = "Tagline wajib diisi dan maksimal 160 karakter.";
  if (!description || description.length > 1000) errors.brand_description = "Tentang brand wajib diisi dan maksimal 1.000 karakter.";
  if ([storeName, tagline, description].some(hasPhoneLikeNumber)) return { errors: { ...errors, brand_description: "Nomor telepon tidak boleh tampil sebagai teks di situs." } };
  if (Object.keys(errors).length) return { errors };
  const { error } = await supabase.from("site_settings").update({ store_name: storeName, brand_tagline: tagline, brand_description: description, updated_at: new Date().toISOString() }).eq("id", true);
  if (error) return { errors: {}, formError: "Informasi brand gagal disimpan. Periksa koneksi, lalu coba lagi." };
  revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/cart"); revalidatePath("/admin/site");
  return { ...emptySiteDisplayState, success: "Informasi brand berhasil disimpan." };
}

export async function saveBanner(_previous: SiteDisplayActionState, form: FormData): Promise<SiteDisplayActionState> {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const subtitle = String(form.get("subtitle") ?? "").trim();
  const altText = String(form.get("alt_text") ?? "").trim();
  const buttonLabel = String(form.get("button_label") ?? "").trim();
  const buttonUrl = String(form.get("link_url") ?? "").trim();
  const order = parseRequiredInteger(form.get("sort_order"));
  const file = form.get("image");
  const hasFile = file instanceof File && file.size > 0;
  const errors: Record<string, string> = {};
  if (!title || title.length > 100) errors.title = "Judul wajib diisi dan maksimal 100 karakter.";
  if (!subtitle || subtitle.length > 220) errors.subtitle = "Subjudul wajib diisi dan maksimal 220 karakter.";
  if (!altText || altText.length > 180) errors.alt_text = "Deskripsi gambar wajib diisi dan maksimal 180 karakter.";
  if (!buttonLabel || buttonLabel.length > 40) errors.button_label = "Teks tombol wajib diisi dan maksimal 40 karakter.";
  if (order === null) errors.sort_order = "Urutan wajib berupa angka bulat nol atau lebih.";
  if (!buttonUrl || !isSafeBannerUrl(buttonUrl)) errors.link_url = "Tautan harus berupa alamat situs HTTPS atau jalur situs, misalnya /catalog.";
  if (!id && !hasFile) errors.image = "Pilih gambar banner.";
  if (hasFile && (!isAllowedImage(file) || file.size > 10 * 1024 * 1024)) errors.image = "Gunakan gambar JPG, PNG, WebP, atau AVIF maksimal 10 MB.";
  if (hasPhoneLikeNumber(title)) errors.title = "Nomor telepon tidak boleh tampil sebagai teks di situs.";
  if (hasPhoneLikeNumber(subtitle)) errors.subtitle = "Nomor telepon tidak boleh tampil sebagai teks di situs.";
  if (hasPhoneLikeNumber(altText)) errors.alt_text = "Nomor telepon tidak boleh tampil sebagai teks di situs.";
  if (hasPhoneLikeNumber(buttonLabel)) errors.button_label = "Nomor telepon tidak boleh tampil sebagai teks di situs.";
  if (Object.keys(errors).length) return { errors };

  let oldImagePath: string | null = null;
  if (id) {
    const { data, error } = await supabase.from("banners").select("image_path").eq("id", id).maybeSingle();
    if (error || !data) return { errors: {}, formError: "Banner tidak ditemukan. Muat ulang halaman lalu coba lagi." };
    oldImagePath = data.image_path;
  }
  let imagePath = oldImagePath;
  if (hasFile && file instanceof File) {
    const path = `banners/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const uploaded = await supabase.storage.from("product-photos").upload(path, file, { contentType: file.type, upsert: false });
    if (uploaded.error) return { errors: {}, formError: "Gambar gagal diunggah. Periksa format dan ukuran berkas." };
    imagePath = path;
  }
  if (!imagePath || order === null) return { errors: {}, formError: "Banner belum lengkap. Periksa kembali isian." };
  const values = { title, subtitle, alt_text: altText, image_path: imagePath, button_label: buttonLabel, link_url: buttonUrl, sort_order: order, is_active: form.has("is_active") };
  const result = id ? await supabase.from("banners").update(values).eq("id", id) : await supabase.from("banners").insert(values);
  if (result.error) return { errors: {}, formError: "Banner gagal disimpan. Periksa koneksi dan coba lagi." };
  revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/admin/site");
  return { ...emptySiteDisplayState, success: "Banner berhasil disimpan." };
}

export async function saveProductDisplay(_previous: SiteDisplayActionState, form: FormData): Promise<SiteDisplayActionState> {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id") ?? "").trim();
  if (!id) return { errors: {}, formError: "Produk tidak ditemukan. Muat ulang halaman lalu coba lagi." };
  const featuredOrder = parseRequiredInteger(form.get("featured_order"));
  const newestOrder = parseRequiredInteger(form.get("newest_order"));
  const bestSellerOrder = parseRequiredInteger(form.get("best_seller_order"));
  const errors: Record<string, string> = {};
  if (featuredOrder === null) errors.featured_order = "Urutan wajib berupa angka bulat nol atau lebih.";
  if (newestOrder === null) errors.newest_order = "Urutan wajib berupa angka bulat nol atau lebih.";
  if (bestSellerOrder === null) errors.best_seller_order = "Urutan wajib berupa angka bulat nol atau lebih.";
  if (Object.keys(errors).length) return { errors };
  const { data, error } = await supabase.from("products").update({ is_featured: form.has("is_featured"), featured_order: featuredOrder, is_new: form.has("is_new"), newest_order: newestOrder, is_best_seller: form.has("is_best_seller"), best_seller_order: bestSellerOrder }).eq("id", id).eq("is_active", true).select("id").maybeSingle();
  if (error || !data) return { errors: {}, formError: "Pilihan produk gagal disimpan. Muat ulang halaman lalu coba lagi." };
  revalidatePath("/"); revalidatePath("/catalog"); revalidatePath("/admin/site"); revalidatePath("/admin/products");
  return { ...emptySiteDisplayState, success: "Pilihan dan urutan produk berhasil disimpan." };
}

function parseRequiredInteger(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (!/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function isAllowedImage(file: File): boolean {
  return ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type);
}

function isSafeBannerUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

function hasPhoneLikeNumber(value: string): boolean {
  return (value.match(/\+?\d(?:[\s().-]*\d){8,}/g) ?? []).some((candidate) => candidate.replace(/\D/g, "").length >= 9);
}
function integer(value: FormDataEntryValue | null): number | null { const result = Number(value); return Number.isSafeInteger(result) && result >= 0 ? result : null; }
