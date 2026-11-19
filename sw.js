// PWA: cache apenas dos arquivos estáticos do site público.
// Consultas e respostas do Supabase nunca são armazenadas.
const CACHE = "consulta-uniformes-static-v1";
const ASSETS = ["/consulta-uniformes/", "/consulta-uniformes/index.html", "/consulta-uniformes/icon.svg", "/consulta-uniformes/manifest.webmanifest"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("consulta-uniformes-static-") && key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  const url = new URL(req.url);
  if (url.pathname === "/consulta-uniformes/" || url.pathname === "/consulta-uniformes/index.html") {
    event.respondWith(fetch(req).catch(() => caches.match("/consulta-uniformes/index.html")));
    return;
  }
  if (ASSETS.includes(url.pathname)) event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
});
