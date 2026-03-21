// Firebase Messaging Service Worker
// This file MUST be named firebase-messaging-sw.js for FCM default registration
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBq-AMqqUwGgDZGk6F9TndyZaZZui8gPBY",
  authDomain: "eir-fieldlog.firebaseapp.com",
  projectId: "eir-fieldlog",
  storageBucket: "eir-fieldlog.firebasestorage.app",
  messagingSenderId: "670175047784",
  appId: "1:670175047784:web:b48dc899508a925652cbdd"
});

const messaging = firebase.messaging();
const BASE = self.location.pathname.replace(/firebase-messaging-sw\.js$/, '');

messaging.onBackgroundMessage((payload) => {
  console.log('[Rian FCM SW] background message:', payload);
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

// Handle notification click
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
