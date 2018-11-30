console.log('My custom service worker');

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.open('tennis-dynamic').then(function(cache) {
//       return fetch(event.request).then(function(response) {
//         cache.put(event.request, response.clone());
//         return response;
//       });
//     })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });


// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  //if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open('tennis-dynamic').then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  //}
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('tennis-dynamic').then(cache => {
      return fetch(event.request).then(response => {
        return cache.put(event.request, response.clone()).then(() => {
          return response;
        })
      })
    }).catch(() => {
      return caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
      })
    })
  )
})
