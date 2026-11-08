import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/customer/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { PwaRegister } from "@/components/layout/pwa-register";
import { ScrollReveal } from "@/components/layout/scroll-reveal";
import { getStoreSettings } from "@/lib/store";
import "./globals.css";
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  return { title: settings.store_name, description: settings.brand_tagline, manifest: "/manifest.webmanifest", appleWebApp: { capable: true, title: "Lunara", statusBarStyle: "default" }, icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }], apple: "/icon-192.png" } };
}
export const viewport: Viewport = { themeColor: "#9B625F" };
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getStoreSettings();
  return <html lang="id"><body><CartProvider><PwaRegister/><ScrollReveal/><SiteHeader storeName={settings.store_name}/>{children}<SiteFooter storeName={settings.store_name} whatsappNumber={settings.whatsapp_number}/>{settings.whatsapp_number && <FloatingWhatsApp whatsappNumber={settings.whatsapp_number}/>}</CartProvider></body></html>;
}
