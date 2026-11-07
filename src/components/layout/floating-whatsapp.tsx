"use client";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/layout/whatsapp-icon";

export function FloatingWhatsApp({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <a className="floating-whatsapp" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><WhatsAppIcon/>Hubungi via WhatsApp</a>;
}
