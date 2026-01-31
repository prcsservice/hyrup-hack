// Firebase Cloud Messaging Service Worker
// Place this file in public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase config - must match your app config
firebase.initializeApp({
    apiKey: "AIzaSyCInQKw-z6CpO9zafRKfPGIWY8rVWiqjp0",
    authDomain: "hyrup-hackthon.firebaseapp.com",
    projectId: "hyrup-hackthon",
    storageBucket: "hyrup-hackthon.firebasestorage.app",
    messagingSenderId: "974152553200",
    appId: "1:974152553200:web:0fe9e0b97b39e8ba86d8fb",
    measurementId: "G-4CXEJL3CVB"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'FixForward Update';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new notification',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: payload.data?.tag || 'default',
        data: payload.data,
        actions: [
            { action: 'open', title: 'Open Dashboard' }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);

    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/dashboard';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there's already a window/tab open
            for (const client of windowClients) {
                if (client.url.includes('/dashboard') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise, open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
