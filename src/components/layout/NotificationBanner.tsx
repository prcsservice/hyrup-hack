"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { X, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Notification {
    id: string;
    message: string;
    type: 'info' | 'alert' | 'success';
}

export function NotificationBanner() {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [hiddenIds, setHiddenIds] = useState<string[]>([]); // simplified local session hide

    useEffect(() => {
        // Query active notifications, get most recent
        const q = query(
            collection(db, "notifications"),
            where("active", "==", true),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
            if (!snap.empty) {
                // Just start with the single most recent one for simplicity in UI
                const data = { id: snap.docs[0].id, ...snap.docs[0].data() } as Notification;
                setNotification(data);
            } else {
                setNotification(null);
            }
        });
        return () => unsub();
    }, []);

    if (!notification || hiddenIds.includes(notification.id)) return null;

    const bgColors = {
        info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        alert: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
        success: "bg-green-500/10 border-green-500/20 text-green-400"
    };

    const Icons = {
        info: Info,
        alert: AlertTriangle,
        success: CheckCircle
    };

    const Icon = Icons[notification.type];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`border-b backdrop-blur-md ${bgColors[notification.type]} border-t-0`}
            >
                <div className="container py-3 flex items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <Icon size={16} className="shrink-0" />
                        <span>{notification.message}</span>
                    </div>
                    <button
                        onClick={() => setHiddenIds([...hiddenIds, notification.id])}
                        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
