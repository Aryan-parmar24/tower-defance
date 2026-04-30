// Change version number to force update
const CACHE = 'tower-defense-v3';

self.addEventListener('install', e => {
    console.log('SW v3 installing...');
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    console.log('SW v3 activating...');
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    console.log('Deleting cache:', key);
                    return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// Always fetch from network first (no caching!)
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(response => response)
            .catch(() => caches.match(e.request))
    );
});