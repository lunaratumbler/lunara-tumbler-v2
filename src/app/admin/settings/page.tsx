import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/admin";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("site_settings")
    .select("store_name,brand_tagline,brand_description,whatsapp_number,whatsapp_template,personalization_fee,instagram_url")
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
        tagline={data?.brand_tagline ?? "Warna lembut, cerita personal."}
        description={data?.brand_description ?? "Temukan warna yang terasa paling dekat dengan dirimu. Setiap tumbler Lunara hadir untuk menemani rutinitas dan momen kecil yang berarti."}
        phone={phone}
        messageTemplate={data?.whatsapp_template ?? "Halo Lunara, saya ingin bertanya tentang pesanan berikut:\n\n{{order_details}}\n\nTotal sementara: {{total}}"}
        personalizationFee={data?.personalization_fee ?? 15000}
        instagramUrl={data?.instagram_url ?? ""}
      />}
    </section>
    <section className="admin-panel"><h2>Akun admin</h2><p>Akses saat ini dikelola melalui akun Supabase Auth dengan profil admin aktif.</p></section>
  </>;
}
