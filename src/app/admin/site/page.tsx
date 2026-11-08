import { BannerForm, BrandInfoForm, type SiteBanner } from "@/components/admin/site-display-forms";
import { requireAdmin } from "@/lib/admin";

export default async function SitePage() {
  const { supabase } = await requireAdmin();
  const [{ data: settings, error: settingsError }, { data: banners, error: bannersError }] = await Promise.all([
    supabase.from("site_settings").select("store_name,brand_tagline,brand_description").eq("id", true).maybeSingle(),
    supabase.from("banners").select("id,title,subtitle,alt_text,image_path,button_label,link_url,sort_order,is_active").order("sort_order").order("created_at"),
  ]);
  const publicBase = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return <>
    <header className="admin-page-heading"><div><p className="eyebrow">KONTEN TOKO</p><h1>Tampilan Website</h1></div></header>

    <section className="admin-panel">
      <h2>Informasi brand</h2>
      <p>Informasi ini tampil pada beranda, katalog, navigasi, dan footer situs.</p>
      {settingsError ? <p role="alert">Informasi brand gagal dimuat: {settingsError.message}</p> : <BrandInfoForm storeName={settings?.store_name ?? "Lunara Tumbler"} tagline={settings?.brand_tagline ?? "Warna lembut, cerita personal."} description={settings?.brand_description ?? "Temukan warna yang terasa paling dekat dengan dirimu. Setiap tumbler Lunara hadir untuk menemani rutinitas dan momen kecil yang berarti."}/>}
    </section>

    <section className="admin-panel">
      <h2>Banner beranda</h2>
      <p>Atur gambar, judul, subjudul, tombol, dan urutan tampil banner.</p>
      <BannerForm/>
      <div className="admin-card-list site-banner-list">
        {banners?.map((banner) => {
          const imageUrl = banner.image_path.startsWith("http") ? banner.image_path : `${publicBase}/storage/v1/object/public/product-photos/${banner.image_path}`;
          const item: SiteBanner = { ...banner, subtitle: banner.subtitle ?? "", button_label: banner.button_label || "Jelajahi Katalog", link_url: banner.link_url ?? "/catalog" };
          return <article className="admin-card site-banner-card" key={banner.id}>
            <div className="admin-card-main"><h3>{banner.title}</h3><span className={`admin-status${banner.is_active ? " active" : ""}`}>{banner.is_active ? "Tampil" : "Disembunyikan"}</span></div>
            <BannerForm banner={item} imageUrl={imageUrl}/>
          </article>;
        })}
        {bannersError && <p role="alert">Daftar banner gagal dimuat: {bannersError.message}</p>}
        {!bannersError && !banners?.length && <p>Belum ada banner. Tambahkan banner untuk ditampilkan di beranda.</p>}
      </div>
    </section>
  </>;
}
