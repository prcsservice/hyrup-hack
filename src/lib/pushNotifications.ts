import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, app } from './firebase';

let messagingInstance: ReturnType<typeof getMessaging> | null = null;

/**
 * Initialize Firebase Cloud Messaging
 * Returns the messaging instance or null if not supported
 */
export async function initializeMessaging() {
    if (typeof window === 'undefined') return null;

    const supported = await isSupported();
    if (!supported) {
        console.log('FCM not supported in this browser');
        return null;
    }

    if (!messagingInstance) {
        messagingInstance = getMessaging(app);
    }

    return messagingInstance;
}

/**
 * Request notification permission and get FCM token
 */
export async function requestNotificationPermission(userId: string): Promise<string | null> {
    try {
        const messaging = await initializeMessaging();
        if (!messaging) return null;

        // Check current permission
        if (Notification.permission === 'denied') {
            console.log('Notification permission denied');
            return null;
        }

        // Request permission if not granted
        if (Notification.permission !== 'granted') {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('Notification permission not granted');
                return null;
            }
        }

        // Get VAPID key from environment
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.warn('VAPID key not configured');
            return null;
        }

        // Validate required environment variables
        const config = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        if (Object.values(config).some(val => !val)) {
            console.error('Missing Firebase configuration environment variables');
            return null;
        }

        // Register service worker with config params
        const swUrl = `/firebase-messaging-sw.js?apiKey=${config.apiKey}&authDomain=${config.authDomain}&projectId=${config.projectId}&storageBucket=${config.storageBucket}&messagingSenderId=${config.messagingSenderId}&appId=${config.appId}`;

        const registration = await navigator.serviceWorker.register(swUrl);
        console.log('Service worker registered:', registration);

        // Get FCM token
        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration
        });

        if (token) {
            console.log('FCM Token obtained');

            // Save token to user document
            await updateDoc(doc(db, 'users', userId), {
                fcmToken: token,
                fcmTokenUpdatedAt: serverTimestamp(),
                notificationsEnabled: true
            });

            return token;
        }

        return null;
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
}

/**
 * Listen for foreground messages
 */
export function onForegroundMessage(callback: (payload: any) => void): () => void {
    if (typeof window === 'undefined') return () => { };

    initializeMessaging().then((messaging) => {
        if (!messaging) return;

        onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);
            callback(payload);
        });
    });

    return () => { }; // Return cleanup function
}

/**
 * Check if notifications are supported
 */
export async function isNotificationsSupported(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (!('Notification' in window)) return false;
    return await isSupported();
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined') return 'unsupported';
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
}
