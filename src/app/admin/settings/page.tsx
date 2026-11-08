import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/admin";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_settings")
    .select("store_name,whatsapp_number,personalization_fee")
    .eq("id", true).single();
  const phone = data?.whatsapp_number
    ? data.whatsapp_number.replace(/^62/, "0").replace(/^(0\d{3})(\d{4})(\d+)/, "$1-$2-$3")
    : "085772582278";

  return <>
    <header className="admin-page-heading"><div><p className="eyebrow">KONFIGURASI</p><h1>Pengaturan</h1></div></header>
    <section className="admin-panel">
      <h2>Informasi toko dan kontak</h2>
      <p>Perubahan nomor WhatsApp digunakan oleh seluruh tombol WhatsApp pada situs customer.</p>
      {error ? <p role="alert">Pengaturan gagal dimuat. Muat ulang halaman atau periksa koneksi.</p> : <SettingsForm
        storeName={data?.store_name ?? "Lunara Tumbler"}
        phone={phone}
        personalizationFee={data?.personalization_fee ?? 15000}
      />}
    </section>
  </>;
}
