const CACHE_VERSION = 'timerhub-v16';
const LOCALE_CACHE_KEY = '/__timerhub_locale__';
const PUSH_COPY = {
    en: { title: 'TimerHub', body: 'Timer reminder' },
    de: { title: 'TimerHub', body: 'Timer-Erinnerung' },
    ru: { title: 'TimerHub', body: 'Напоминание таймера' }
};
const CACHE_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/clockodo-client.js',
    '/exchange.js',
    '/assignment.js',
    '/vendor/qrcode.min.js',
    '/vendor/jsQR.min.js',
    '/manifest.json'
];

function isSupportedLocale(locale) {
    return Object.prototype.hasOwnProperty.call(PUSH_COPY, locale);
}

async function saveLocale(locale) {
    if (!isSupportedLocale(locale)) return;
    const cache = await caches.open(CACHE_VERSION);
    await cache.put(
        new URL(LOCALE_CACHE_KEY, self.location.origin).toString(),
        new Response(locale, { headers: { 'Content-Type': 'text/plain' } })
    );
}

async function getSavedLocale() {
    try {
        const cache = await caches.open(CACHE_VERSION);
        const response = await cache.match(new URL(LOCALE_CACHE_KEY, self.location.origin).toString());
        const locale = response ? await response.text() : 'en';
        return isSupportedLocale(locale) ? locale : 'en';
    } catch (error) {
        return 'en';
    }
}

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            return cache.addAll(CACHE_FILES).catch(err => {
                console.log('Cache add failed:', err);
                // Don't fail install if some files are not found
                return Promise.resolve();
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Network first, fallback to cache
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response.ok) {
                    const cache = caches.open(CACHE_VERSION);
                    cache.then((c) => c.put(event.request, response.clone()));
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(event.request);
            })
    );
});

// Handle messages
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    } else if (event.data && event.data.type === 'SET_LOCALE') {
        event.waitUntil(saveLocale(event.data.locale));
    }
});


self.addEventListener('push', (event) => {
    let data = {};
    let plainTextBody = '';

    try {
        data = event.data ? event.data.json() : {};
        if (typeof data === 'string') {
            plainTextBody = data;
            data = {};
        } else if (!data || typeof data !== 'object' || Array.isArray(data)) {
            data = {};
        }
    } catch (error) {
        plainTextBody = event.data ? event.data.text() : '';
        data = {};
    }

    event.waitUntil(
        (async () => {
            const locale = isSupportedLocale(data.locale) ? data.locale : await getSavedLocale();
            const copy = PUSH_COPY[locale];
            await self.registration.showNotification(
                data.title || copy.title,
                {
                    body: data.body || plainTextBody || copy.body,
                    tag: data.tag || 'timerhub-timer',
                    renotify: true,
                    vibrate: [200, 100, 200],
                    data: { url: '/' }
                }
            );
        })()
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
