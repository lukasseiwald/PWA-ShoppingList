var dataCacheName = 'superheroShopping-v1';
var cacheName = 'superheroShopping';
var messageEvent = new MessageEvent("worker");

var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/main.css',
    // '/images/clear.png',
    // '/images/cloudy-scattered-showers.png',
    // '/images/cloudy.png',
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
  console.log(event.request.url);
 
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// self.addEventListener('activate', function(e) {
//     console.log('[ServiceWorker] Activate');
//     e.waitUntil(
//         caches.keys().then(function(keyList) {
//         return Promise.all(keyList.map(function(key) {
//             if (key !== cacheName && key !== dataCacheName) {
//             console.log('[ServiceWorker] Removing old cache', key);
//             return caches.delete(key);
//             }
//         }));
//         })
//     );
//     return self.clients.claim();
// });
  
// self.addEventListener("message", function (e) {
//   messageAllClients(e.data)
// })

// function messageAllClients(msg){
//   clients.matchAll().then(clients => {
//       clients.forEach(client => {
//         client.postMessage(msg);
//       })
//   })
// }