"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Adds a one-time, low-cost reveal to homepage sections and product cards. */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const selector = ".home-banner, .latest-products, .intro-strip, .product-card";
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    elements.forEach((element) => element.classList.add("scroll-reveal"));

    if (!elements.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -28px" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
