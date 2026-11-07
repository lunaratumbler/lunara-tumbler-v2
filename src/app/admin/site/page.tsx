import { BannerForm, BrandInfoForm, ProductDisplayForm, type DisplayProduct, type SiteBanner } from "@/components/admin/site-display-forms";
import { requireAdmin } from "@/lib/admin";

export default async function SitePage() {
  const { supabase } = await requireAdmin();
  const [{ data: settings, error: settingsError }, { data: banners, error: bannersError }, { data: products, error: productsError }] = await Promise.all([
    supabase.from("site_settings").select("store_name,brand_tagline,brand_description").eq("id", true).maybeSingle(),
    supabase.from("banners").select("id,title,subtitle,alt_text,image_path,button_label,link_url,sort_order,is_active").order("sort_order").order("created_at"),
    supabase.from("products").select("id,name,is_featured,featured_order,is_new,newest_order,is_best_seller,best_seller_order").eq("is_active", true).order("name"),
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

    <section className="admin-panel">
      <h2>Produk pilihan</h2>
      <p>Pilih produk unggulan, terbaru, atau terlaris. Urutan lebih kecil tampil lebih dahulu pada beranda dan katalog.</p>
      {productsError && <p role="alert">Daftar produk gagal dimuat: {productsError.message}</p>}
      {!productsError && products?.length ? <div className="site-product-list">{(products as DisplayProduct[]).map((product) => <article className="site-product-row" key={product.id}><h3>{product.name}</h3><ProductDisplayForm product={product}/></article>)}</div> : !productsError ? <p>Belum ada produk aktif untuk dipilih.</p> : null}
    </section>
  </>;
}
