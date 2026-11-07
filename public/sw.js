const CACHE_PREFIX = "lunara-pwa-";
const CACHE_VERSION = "v1";
const SHELL_CACHE = `${CACHE_PREFIX}shell-${CACHE_VERSION}`;
const DATA_CACHE = `${CACHE_PREFIX}catalog-${CACHE_VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}images-${CACHE_VERSION}`;
const CATALOG_URL = "/api/public/catalog-data";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(["/offline.html", "/icon.svg", "/icon-192.png", "/icon-512.png", "/manifest.webmanifest"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && ![SHELL_CACHE, DATA_CACHE, IMAGE_CACHE].includes(key)).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(routeRequest(event, request, url));
});

async function routeRequest(event, request, url) {
  const client = event.clientId ? await self.clients.get(event.clientId) : null;
  const clientPath = client ? new URL(client.url).pathname : url.pathname;
  if (clientPath.startsWith("/admin") || url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) return fetch(request);

  if (url.pathname === CATALOG_URL) return staleWhileRevalidate(request, DATA_CACHE);
  if (request.mode === "navigate") {
    try {
      return await fetch(request);
    } catch {
      return (await caches.open(SHELL_CACHE)).match("/offline.html");
    }
  }
  if (url.pathname.startsWith("/_next/image")) return staleWhileRevalidate(request, IMAGE_CACHE);
  if (url.pathname.startsWith("/_next/static/")) return cacheFirst(request, SHELL_CACHE);
  return fetch(request);
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const refresh = fetch(request).then((response) => {
    if (response.ok && !response.headers.has("Set-Cookie")) void cache.put(request, response.clone());
    return response;
  });
  if (cached) {
    void refresh.catch(() => undefined);
    return cached;
  }
  return refresh;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) void cache.put(request, response.clone());
  return response;
}
