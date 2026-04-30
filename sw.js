// Change this line - increase version number
const CACHE = 'tower-defense-v2';  // Changed from v1 to v2!

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE)
                    .map(k => {
                        console.log('Deleting old cache:', k);
                        return caches.delete(k);
                    })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(response => {
                let clone = response.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, clone));
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});