"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Info, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (notifId: string) => {
        await markAsRead(notifId);
    };

    if (!user) return null;

    return (
        <div className="relative font-sans" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-text-secondary hover:text-white transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-primary rounded-full ring-2 ring-bg-primary" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-bg-secondary border border-stroke-primary rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-stroke-dim flex justify-between items-center bg-bg-tertiary/50 backdrop-blur-sm">
                            <h3 className="font-semibold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-accent-primary/10 text-accent-primary text-xs px-2 py-0.5 rounded-full font-medium">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-text-muted">
                                    <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-stroke-dim">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-4 hover:bg-stroke-dim/10 transition-colors relative group ${!notif.read ? 'bg-accent-primary/5' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.read ? 'bg-accent-primary' : 'bg-transparent'}`} />

                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h4 className={`text-sm font-medium ${!notif.read ? 'text-white' : 'text-text-secondary'}`}>
                                                            {notif.title}
                                                        </h4>
                                                        <span className="text-[10px] text-text-muted whitespace-nowrap">
                                                            {notif.createdAt ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-text-muted leading-relaxed">
                                                        {notif.message}
                                                    </p>

                                                    <div className="flex items-center gap-3 pt-2">
                                                        {notif.link && (
                                                            <Link
                                                                href={notif.link}
                                                                onClick={() => setIsOpen(false)}
                                                                className="text-xs text-accent-primary hover:text-accent-primary/80 flex items-center gap-1 font-medium"
                                                            >
                                                                View details <ExternalLink className="w-3 h-3" />
                                                            </Link>
                                                        )}

                                                        {!notif.read && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notif.id)}
                                                                className="text-xs text-text-muted hover:text-white transition-colors ml-auto"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
