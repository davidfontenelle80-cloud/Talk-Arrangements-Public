const CACHE_VERSION = 'talk-arrangements-v112-iphone-black-screen';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/main.css?v=stage9a-v99',
  './css/dark-mode.css',
  './css/components.css',
  './css/responsive.css',
  './js/config.js',
  './js/i18n.js',
  './js/theme.js',
  './js/error-boundary.js',
  './js/a11y.js',
  './js/dashboard-notes.js',
  './js/fixed-preview.js',
  './js/fixed-manager-ux.js',
  './js/planning-conflicts.js',
  './js/rollover-preview.js',
  './js/toolbar-i18n.js',
  './js/planning-clear-row.js',
  './js/unified-note-modal.js',
  './js/mobile-toolbar.js',
  './js/duplicate-congregation-guardrail.js',
  './js/cloud-account-ui.js',
  './js/components/button.js',
  './js/components/modal.js',
  './js/components/card.js',
  './js/components/input.js',
  './js/perf.js',
  './js/push-config.js',
  './js/push.js',
  './js/app.js?v=stage9a-v97',
  './js/firebase/firebase-config.js',
  './js/firebase/cloud-backup.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => Promise.all(
        PRECACHE_URLS.map(url =>
          cache.add(url).catch(err => console.warn('[Talks SW] Optional precache failed:', url, err))
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('talk-arrangements-') && key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(client => client.postMessage({ type: 'RELOAD_READY' })))
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isLocalAsset = url.origin === self.location.origin && url.pathname.includes('/Talk-Arrangements-Public/');
  if (!isLocalAsset) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then(cached => cached || caches.match('./')))
    );
    return;
  }

  const isCriticalRuntimeAsset =
    event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    url.pathname.endsWith('/manifest.json');

  if (isCriticalRuntimeAsset) {
    event.respondWith(
      fetch(event.request, { cache: 'reload' })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || Response.error()))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(event.request, copy));
          }
          return response;
        });
      return cached || network;
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification && event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : '/Talk-Arrangements-Public/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client && client.url.indexOf('/Talk-Arrangements-Public/') !== -1) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = { title: 'Talk Arrangements', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'Talk Arrangements';
  const options = {
    body: data.body || data.message || '',
    icon: data.icon || './icons/icon-192.png',
    badge: data.badge || './icons/icon-192.png',
    tag: data.tag || data.sourceId || 'talk-arrangements-reminder',
    data: {
      url: data.url || '/Talk-Arrangements-Public/',
      sourceType: data.sourceType || 'talk-reminder',
      sourceId: data.sourceId || ''
    },
    requireInteraction: !!data.requireInteraction
  };
  event.waitUntil(self.registration.showNotification(title, options));
});