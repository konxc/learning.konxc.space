const CACHE_NAME = 'naikkelas-v1';
const STATIC_ASSETS = [
	'/',
	'/manifest.json',
	'/favicon.ico',
	'/favicon-16x16.png',
	'/favicon-32x32.png',
	'/favicon-96x96.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
	console.log('[SW] Installing service worker...');
	self.skipWaiting(); // Activate immediately

	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[SW] Caching static assets');
			return cache.addAll(STATIC_ASSETS);
		})
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	console.log('[SW] Activating service worker...');
	
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						console.log('[SW] Deleting old cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	
	// Take control of all pages immediately
	self.clients.claim();
});

// Fetch event - cache-first strategy with network fallback
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Skip cross-origin requests (except when explicitly needed)
	if (url.origin !== self.location.origin) {
		return;
	}

	// For navigation requests (page loads), use network-first strategy
	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					// Clone and cache the response
					const responseClone = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(request, responseClone);
					});
					return response;
				})
				.catch(() => {
					// If network fails, try cache
					return caches.match(request);
				})
		);
		return;
	}

	// For static assets (CSS, JS, images), use cache-first strategy
	event.respondWith(
		caches.match(request).then((cachedResponse) => {
			if (cachedResponse) {
				// Return cached version immediately
				return cachedResponse;
			}

			// Not in cache, fetch from network
			return fetch(request)
				.then((response) => {
					// Clone and cache the response
					const responseClone = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(request, responseClone);
					});
					return response;
				})
				.catch(() => {
					// If both cache and network fail, return offline fallback
					if (request.destination === 'document') {
						return caches.match('/');
					}
					return new Response('Offline', { status: 503 });
				});
		})
	);
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
