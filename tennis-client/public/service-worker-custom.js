console.log('My custom service worker');

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('tennis-dynamic').then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      }).catch(err => console.log(err));
    })
  );
});
