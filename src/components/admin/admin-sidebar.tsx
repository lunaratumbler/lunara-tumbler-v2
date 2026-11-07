"use client";
import Link from "next/link";
import { useState } from "react";
import { logout } from "@/lib/admin-actions";
const links = [["/admin", "Ringkasan"], ["/admin/products", "Produk"], ["/admin/orders", "Pesanan"], ["/admin/reports", "Laporan"], ["/admin/site", "Tampilan Website"], ["/admin/settings", "Pengaturan"]] as const;
export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  return <aside className="admin-sidebar"><div className="admin-sidebar-top"><Link href="/admin" className="admin-brand" onClick={() => setOpen(false)}>Lunara <span>Admin</span></Link><button className="admin-mobile-menu" type="button" aria-expanded={open} aria-controls="admin-navigation" onClick={() => setOpen((value) => !value)}>{open ? "Tutup menu" : "Menu admin"}</button></div><nav id="admin-navigation" className={open ? "is-open" : ""} aria-label="Navigasi admin">{links.map(([href, label]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav><form action={logout}><button className="admin-logout" type="submit">Keluar</button></form></aside>;
}
