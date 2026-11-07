import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/customer/product-detail";
import { getPublicProduct, getStoreSettings } from "@/lib/store";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const [product, settings] = await Promise.all([getPublicProduct(slug), getStoreSettings()]);
  return product ? { title: `${product.name} | ${settings.store_name}`, description: product.description } : {};
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const [product, settings] = await Promise.all([getPublicProduct(slug), getStoreSettings()]);
  if (!product) notFound();
  return <ProductDetail product={product} storeName={settings.store_name} personalizationFee={settings.personalization_fee} whatsappHref={settings.whatsapp_number ? `https://wa.me/${settings.whatsapp_number}` : undefined} />;
}
