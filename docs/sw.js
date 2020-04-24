importScripts('cache-polyfill.js');

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('airhorner').then(function(cache) {
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
       'assets/js/install.js',
       'assets/fonts/FontAwesome.otf',
       'assets/fonts/fontawesome-webfont.eot',
       'assets/fonts/fontawesome-webfont.svg',
       'assets/fonts/fontawesome-webfont.ttf',
       'assets/fonts/fontawesome-webfont.woff',
       'assets/fonts/fontawesome-webfont.woff2',
       'images/banner.jpg',
       'images/banner.mp4',
       'images/banner.ogv',
       'images/banner.webm',
       'images/bg.jpg',
       'images/pic01.webp',
       'images/pic02.png',
       'images/pic03.png',
       'images/icon.png'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
 console.log(event.request.url);

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});