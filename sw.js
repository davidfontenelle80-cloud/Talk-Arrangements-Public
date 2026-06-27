const CACHE_VERSION = 'talk-arrangements-v93-stage-9a-final-polish';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
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
  './js/components/button.js',
  './js/components/modal.js',
  './js/components/card.js',
  './js/components/input.js',
  './js/perf.js',
  './js/push.js',
  './js/app.js',
  './js/firebase/firebase-config.js',
  './js/firebase/cloud-backup.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => {
        self.skipWaiting();
        console.log('[KHub SW] Installed.');
      })
      .catch(err => console.error('[KHub SW] Install failed:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'RELOAD_READY' }));
        });
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match('./'));
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
