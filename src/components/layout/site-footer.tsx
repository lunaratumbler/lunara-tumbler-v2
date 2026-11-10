import Link from "next/link";
import { WhatsAppIcon } from "@/components/layout/whatsapp-icon";

export function SiteFooter({ storeName, whatsappNumber }: { storeName: string; whatsappNumber: string }) {
  return <footer className="site-footer" id="kontak">
    <div className="footer-inner page-width">
      <div className="footer-brand">
        <Link className="brand-lockup" href="/" aria-label={`${storeName}, beranda`}><span className="brand-mark" aria-hidden="true">L</span><span className="brand-name">{storeName}</span></Link>
        <p className="footer-tagline">Tumbler untuk harian.</p>
      </div>
      <div className="footer-links"><h2>Jelajahi</h2><Link href="/">Beranda</Link><Link href="/catalog">Katalog</Link><Link href="/#tentang">Tentang Kami</Link></div>
      <div className="footer-contact"><h2>Butuh bantuan?</h2>{whatsappNumber && <a className="button button-outline" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><WhatsAppIcon/>Hubungi via WhatsApp</a>}</div>
    </div>
    <div className="footer-bottom page-width"><span>© {new Date().getFullYear()} {storeName}</span></div>
  </footer>;
}
