/* Öğretmen Yardımcısı · uygulama (ana ekrandan açılınca) için önbellek.
   Önce internetten en yenisini alır; internet yoksa son kaydedileni açar. Program şifreli olduğundan önbellekteki de şifrelidir. */
var AD = "oy-onbellek-1";
var DOSYALAR = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(AD).then(function (c) { return c.addAll(DOSYALAR); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== AD; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request; if (r.method !== "GET") return;
  if (new URL(r.url).origin !== self.location.origin) return; // dış adresler (pdf.js vb.) tarayıcıya kalır
  e.respondWith(fetch(r).then(function (y) {
    if (y && y.ok) { var k = y.clone(); caches.open(AD).then(function (c) { c.put(r, k); }); }
    return y;
  }).catch(function () {
    return caches.match(r).then(function (x) { return x || (r.mode === "navigate" ? caches.match("./index.html") : undefined); });
  }));
});
