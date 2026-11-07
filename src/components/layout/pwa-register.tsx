"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PwaRegister() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin") || !("serviceWorker" in navigator)) return;
    void (async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        await navigator.serviceWorker.ready;
        await fetch("/api/public/catalog-data", { cache: "no-store" });
      } catch {
        // Customer pages remain usable when service workers are unavailable.
      }
    })();
  }, [pathname]);
  return null;
}
