import { CartContent } from "@/components/customer/cart-content";
import { getStoreSettings } from "@/lib/store";
export async function generateMetadata() { const settings = await getStoreSettings(); return { title: `Keranjang | ${settings.store_name}` }; }
export default async function CartPage() { const settings = await getStoreSettings(); return <CartContent storeName={settings.store_name} whatsappNumber={settings.whatsapp_number} personalizationFee={settings.personalization_fee}/>; }
