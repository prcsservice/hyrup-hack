"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Info, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Notification {
    id: string;
    type: 'info' | 'alert' | 'success';
    message: string;
    createdAt: any;
    read?: boolean;
    link?: string;
}

export function NotificationBell() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch notifications
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "notifications"),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Notification[];

            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (notifId: string) => {
        try {
            await updateDoc(doc(db, "notifications", notifId), { read: true });
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <AlertTriangle size={14} className="text-red-500" />;
            case 'success': return <CheckCircle size={14} className="text-green-500" />;
            default: return <Info size={14} className="text-blue-400" />;
        }
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} className="text-text-secondary hover:text-white transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-bg-secondary border border-stroke-primary rounded-lg shadow-xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-stroke-divider">
                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        {/* List */}
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-8 text-center text-text-muted text-sm">
                                    <Bell size={24} className="mx-auto mb-2 opacity-30" />
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`p-4 border-b border-stroke-divider cursor-pointer hover:bg-bg-tertiary/50 transition-colors ${!notif.read ? 'bg-accent/5' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="shrink-0 mt-0.5">
                                                {getIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white leading-tight">{notif.message}</p>
                                                <p className="text-[10px] text-text-muted font-mono mt-1">
                                                    {notif.createdAt?.seconds
                                                        ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true })
                                                        : 'Just now'}
                                                </p>
                                            </div>
                                            {notif.link && (
                                                <Link href={notif.link} className="shrink-0 text-accent hover:text-accent/80">
                                                    <ExternalLink size={14} />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <Link
                            href="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="block p-3 text-center text-xs text-accent hover:bg-accent/10 transition-colors border-t border-stroke-divider"
                        >
                            View All in Dashboard
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
