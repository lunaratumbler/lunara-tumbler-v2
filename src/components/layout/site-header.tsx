"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/customer/cart-provider";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/catalog", label: "Katalog" },
  { href: "/#tentang", label: "Tentang Kami" },
  { href: "/#kontak", label: "Kontak" },
];

export function SiteHeader({ storeName }: { storeName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner page-width">
        <Link className="brand-lockup" href="/" aria-label={`${storeName}, beranda`} onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">L</span>
          <span className="brand-name">{storeName}</span>
        </Link>

        <nav className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Navigasi utama">
          {navItems.map((item) => (
            <Link className={pathname === item.href ? "is-active" : undefined} aria-current={pathname === item.href ? "page" : undefined} href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>{item.label}</Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="cart-link" href="/cart" aria-label={`Keranjang, ${hydrated ? itemCount : 0} item`}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 1.9-1.4L21 8H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20" r="1.3" fill="currentColor" /><circle cx="18" cy="20" r="1.3" fill="currentColor" />
            </svg>
            <span className="cart-label">Keranjang</span>
            <span className="cart-badge" aria-live="polite">{hydrated ? itemCount : 0}</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      <nav id="primary-navigation" className="mobile-nav page-width" aria-label="Navigasi seluler" hidden={!menuOpen}>
        {navItems.map((item) => (
          <Link className={pathname === item.href ? "is-active" : undefined} aria-current={pathname === item.href ? "page" : undefined} href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>{item.label}</Link>
        ))}
      </nav>
    </header>
  );
}
