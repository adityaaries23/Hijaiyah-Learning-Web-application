const CACHE_NAME = 'hijaiyah-app-v4';
const ALL_ASSETS = [
    './',
    './index.html',
    './styles/main.css',
    './scripts/data.js',
    './scripts/app.js',
    './scripts/ui.js',
    './favicon.png',
    './manifest.json'
];

// Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // We use addAll but wrap it in individual error handling or just try catching. 
                // If audio files are missing right now, it shouldn't fail the whole install block.
                console.log('[Service Worker] Caching all assets');
                return Promise.all(
                    ALL_ASSETS.map(url => {
                        return fetch(url).then(response => {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                            console.warn('[Service Worker] Missing asset not cached:', url);
                        }).catch(err => {
                            console.warn('[Service Worker] Failed to cache:', url, err);
                        });
                    })
                );
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch Event - Stale-While-Revalidate pattern or Cache First fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then(response => {
                    // If we got a valid response, cache it dynamically for later
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                });
            })
    );
});
