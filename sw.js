const CACHE_NAME = 'tower-defense-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install - cache files
self.addEventListener('install', e => {
    console.log('SW: Installing...');
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate - delete old caches (AUTO UPDATE!)
self.addEventListener('activate', e => {
    console.log('SW: Activating...');
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('SW: Deleting old cache:', key);
                        return caches.delete(key);
                    })
            );
        })
    );
    self.clients.claim();
});

// Fetch - serve from cache, update in background
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            // Get fresh version from network
            const fetchPromise = fetch(e.request).then(response => {
                // Update cache with fresh version
                if(response && response.status === 200){
                    const cloned = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(e.request, cloned);
                    });
                }
                return response;
            }).catch(() => cached);
            
            // Return cached version immediately (fast!)
            // Background update happens silently
            return cached || fetchPromise;
        })
    );
});

// Listen for update message
self.addEventListener('message', e => {
    if(e.data === 'skipWaiting'){
        self.skipWaiting();
    }
});