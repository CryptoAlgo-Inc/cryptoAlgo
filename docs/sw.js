const cacheName = 'CryptoAlgo-V1';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
       'icon_Lid_icon.ico',
       'generic.html',
       'downloads.html',
       'contact.html',
       'index.html',
       'assets/css/main.css',
       'assets/js/jquery.min.js',
       'assets/js/jquery.scrollex.min.js',
       'assets/js/jquery.scrolly.min.js',
       'assets/js/main.js',
       'assets/js/skel.min.js',
       'assets/js/util.js',
       'assets/js/lazysizes.min.js',
       'images/banner.webp',
       'images/bg.webp',
       'images/pic01.webp',
       'images/pic02.webp',
       'images/pic03.webp',
       'images/icon.png',
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});
