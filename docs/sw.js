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
                'documentation/CryptoAlgo%20Documentation%20V0.5.pdf'
            ])
            .then(() => self.skipWaiting());
        })
    );
});

//Deletion should only occur at the activate event
self.addEventListener('activate', event => {
    var cacheKeeplist = [cacheName];
    event.waitUntil(
        caches.keys().then( keyList => {
            return Promise.all(keyList.map( key => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    .then(self.clients.claim())); //this line is important in some contexts
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
