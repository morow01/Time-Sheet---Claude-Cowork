// Import Firebase SDKs for push messaging support
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const CACHE = 'timesheet-v404';
const BASE = self.location.pathname.replace(/sw\.js$/, '');
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'app.html',
  BASE + 'codes.json',
  BASE + 'exchanges.json',
  BASE + 'cabinets.json',
];

// Initialize Firebase in service worker context
firebase.initializeApp({
  apiKey: "AIzaSyBq-AMqqUwGgDZGk6F9TndyZaZZui8gPBY",
  authDomain: "eir-fieldlog.firebaseapp.com",
  projectId: "eir-fieldlog",
  storageBucket: "eir-fieldlog.firebasestorage.app",
  messagingSenderId: "670175047784",
  appId: "1:670175047784:web:b48dc899508a925652cbdd"
});

const fcmMessaging = firebase.messaging();

// Handle background push messages
fcmMessaging.onBackgroundMessage((payload) => {
  console.log('[Rian SW] background message:', payload);
  const data = payload.data || {};
  if (data.type === 'reminder') {
    self.registration.showNotification(data.title || 'Rian Reminder', {
      body: data.body || '',
      icon: BASE + 'icon-192.png',
      tag: 'rian-remind-' + (data.reminderId || Date.now()),
      vibrate: [200, 100, 200],
      requireInteraction: true
    });
  }
});

// Explicit push event handler as fallback (in case onBackgroundMessage misses it)
self.addEventListener('push', (event) => {
  console.log('[Rian SW] push event received:', event);
  // Firebase SDK handles most push events via onBackgroundMessage above.
  // This is a safety net for raw push messages.
  if (event.data) {
    try {
      const payload = event.data.json();
      // Only show notification if Firebase SDK didn't already handle it
      // Firebase wraps data in a specific format
      if (payload.data && payload.data.type === 'reminder' && !payload.notification) {
        event.waitUntil(
          self.registration.showNotification(payload.data.title || 'Rian Reminder', {
            body: payload.data.body || '',
            icon: BASE + 'icon-192.png',
            tag: 'rian-remind-' + (payload.data.reminderId || Date.now()),
            vibrate: [200, 100, 200],
            requireInteraction: true
          })
        );
      }
    } catch (e) {
      console.log('[Rian SW] push parse error:', e);
    }
  }
});

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await Promise.allSettled(ASSETS.map(url => c.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  if (e.request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('app.html') || c.url.endsWith('/')) {
          return c.focus();
        }
      }
      return clients.openWindow(BASE + 'app.html');
    })
  );
});
