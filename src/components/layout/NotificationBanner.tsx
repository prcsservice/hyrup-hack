"use client";

import { useState, useEffect } from "react";
import { X, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";

export function NotificationBanner() {
    const { notifications } = useNotifications();
    const [visible, setVisible] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<any>(null);

    useEffect(() => {
        // Find latest unread warning/error/success
        const urgent = notifications.find(n => !n.read && ['warning', 'error', 'success'].includes(n.type));
        if (urgent) {
            setCurrentNotification(urgent);
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [notifications]);

    if (!visible || !currentNotification) return null;

    const bgColors: { [key: string]: string } = {
        info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        alert: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
        warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
        error: "bg-red-500/10 border-red-500/20 text-red-400",
        success: "bg-green-500/10 border-green-500/20 text-green-400",
    };

    const icons: { [key: string]: any } = {
        info: Info,
        alert: AlertTriangle,
        warning: AlertTriangle,
        error: AlertTriangle,
        success: CheckCircle,
    };

    const type = currentNotification.type || 'info';
    const Icon = icons[type] || Info;
    const colorClass = bgColors[type] || bgColors.info;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`w-full border-b backdrop-blur-md ${colorClass}`}
                >
                    <div className="container-custom py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-sm font-medium">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{currentNotification.message}</span>
                        </div>
                        <button
                            onClick={() => setVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
