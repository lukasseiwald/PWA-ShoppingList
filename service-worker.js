var dataCacheName = 'superheroShopping-v1';
var cacheName = 'superheroShopping';
var messageEvent = new MessageEvent("worker");

var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/main.css',
    '/images/clear.png',
    '/images/ironMan.png',
    '/images/ironManHover.png',
    '/audio/iron_man_repulsor.mp3',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(cacheName).then(function(cache) {
        return cache.addAll(filesToCache);
      }).then(function() {
        return self.skipWaiting;
      })
    );
});

self.addEventListener('fetch', function(event) { 
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (key !== cacheName && key !== dataCacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
            }
        }));
        })
    );
    return self.clients.claim();
});