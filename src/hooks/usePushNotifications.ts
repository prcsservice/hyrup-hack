"use client";

import { useState, useEffect, useCallback } from "react";
import {
    requestNotificationPermission,
    onForegroundMessage,
    isNotificationsSupported,
    getNotificationPermission
} from "@/lib/pushNotifications";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

interface UsePushNotificationsReturn {
    isSupported: boolean;
    permission: NotificationPermission | 'unsupported' | 'loading';
    token: string | null;
    enableNotifications: () => Promise<boolean>;
    isEnabling: boolean;
}

export function usePushNotifications(): UsePushNotificationsReturn {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [isSupported, setIsSupported] = useState(true); // Assume supported initially
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported' | 'loading'>('loading');
    const [token, setToken] = useState<string | null>(null);
    const [isEnabling, setIsEnabling] = useState(false);

    // Check support on mount
    useEffect(() => {
        const checkSupport = async () => {
            const supported = await isNotificationsSupported();
            setIsSupported(supported);

            if (supported) {
                setPermission(getNotificationPermission());
            } else {
                setPermission('unsupported');
            }
        };

        checkSupport();
    }, []);

    // Listen for foreground messages
    useEffect(() => {
        if (!isSupported) return;

        const cleanup = onForegroundMessage((payload) => {
            // Show in-app toast for foreground notifications
            showToast(
                payload.notification?.title || 'New Notification',
                'info'
            );
        });

        return cleanup;
    }, [isSupported, showToast]);

    const enableNotifications = useCallback(async (): Promise<boolean> => {
        if (!user) {
            showToast('Please sign in first', 'error');
            return false;
        }

        if (!isSupported) {
            showToast('Push notifications not supported', 'error');
            return false;
        }

        setIsEnabling(true);

        try {
            const fcmToken = await requestNotificationPermission(user.uid);

            if (fcmToken) {
                setToken(fcmToken);
                setPermission('granted');
                showToast('Notifications enabled!', 'success');
                return true;
            } else {
                setPermission(getNotificationPermission());
                if (Notification.permission === 'denied') {
                    showToast('Please enable notifications in browser settings', 'error');
                }
                return false;
            }
        } catch (error) {
            console.error('Failed to enable notifications:', error);
            showToast('Failed to enable notifications', 'error');
            return false;
        } finally {
            setIsEnabling(false);
        }
    }, [user, isSupported, showToast]);

    return {
        isSupported,
        permission,
        token,
        enableNotifications,
        isEnabling
    };
}
