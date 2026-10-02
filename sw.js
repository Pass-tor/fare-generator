const CACHE = "angkas-fare-v3";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  // Tolerant: one missing file must not break the install.
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    if (req.mode === "navigate") {
      // Serve the cached page instantly, refresh it in the background.
      e.respondWith(
        caches.open(CACHE).then(async (c) => {
          const hit = await c.match("./index.html");
          const refresh = fetch(new Request("./index.html", { cache: "no-cache" }))
            .then((r) => { if (r.ok && !r.redirected) c.put("./index.html", r.clone()); return r; })
            .catch(() => null);
          if (hit) { e.waitUntil(refresh); return hit; }
          return (await refresh) || fetch(req);
        })
      );
      return;
    }
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((r) => {
        if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return r;
      }))
    );
    return;
  }

  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(CACHE).then((c) => c.match(req).then((hit) => {
      const net = fetch(req).then((r) => { c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })));
  }
  // Place search, routing and other APIs always go to the network.
});
