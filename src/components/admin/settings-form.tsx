"use client";

import { useActionState } from "react";
import { saveSettings, type SiteDisplayActionState } from "@/lib/admin-actions";

const initialState: SiteDisplayActionState = { errors: {} };

export function SettingsForm({ storeName, tagline, description, phone, messageTemplate, personalizationFee, instagramUrl }: {
  storeName: string; tagline: string; description: string; phone: string;
  messageTemplate: string; personalizationFee: number; instagramUrl: string;
}) {
  const [state, action, pending] = useActionState(saveSettings, initialState);
  const error = (field: string) => state.errors[field] && <span className="admin-field-error" role="alert">{state.errors[field]}</span>;
  return <form className="admin-form" action={action}>
    <label>Nama toko<input name="store_name" defaultValue={storeName} maxLength={80} required aria-invalid={Boolean(state.errors.store_name)}/>{error("store_name")}</label>
    <label>Tagline<input name="brand_tagline" defaultValue={tagline} maxLength={160} required aria-invalid={Boolean(state.errors.brand_tagline)}/>{error("brand_tagline")}</label>
    <label>Tentang toko<textarea name="brand_description" defaultValue={description} rows={4} maxLength={1000} required aria-invalid={Boolean(state.errors.brand_description)}/>{error("brand_description")}</label>
    <label>Nomor WhatsApp bisnis<input name="whatsapp_number" type="tel" inputMode="tel" autoComplete="tel" defaultValue={phone} required aria-invalid={Boolean(state.errors.whatsapp_number)}/><span className="admin-help">Nomor ini hanya ditampilkan di pengaturan admin dan menjadi tujuan tombol WhatsApp customer.</span>{error("whatsapp_number")}</label>
    <label>Template pesan WhatsApp<textarea name="whatsapp_template" rows={5} defaultValue={messageTemplate}/><span className="admin-help">Gunakan {"{{order_details}}"} dan {"{{total}}"} untuk menyertakan rincian keranjang dan total.</span></label>
    <label>Biaya personalisasi per tumbler (Rp)<input name="personalization_fee" type="text" inputMode="numeric" pattern="[0-9]+" defaultValue={personalizationFee} required aria-invalid={Boolean(state.errors.personalization_fee)}/><span className="admin-help">Masukkan angka tanpa titik atau koma. Nilai awal: Rp15.000 per tumbler.</span>{error("personalization_fee")}</label>
    <label>Instagram URL<input name="instagram_url" type="url" inputMode="url" defaultValue={instagramUrl}/></label>
    {state.formError && <p className="admin-field-error" role="alert">{state.formError}</p>}
    {state.success && <p className="admin-form-success" role="status">{state.success}</p>}
    <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan Pengaturan"}</button>
  </form>;
}
