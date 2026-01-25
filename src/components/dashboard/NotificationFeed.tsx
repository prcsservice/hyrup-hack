"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bell, Info, AlertTriangle, CheckCircle, Megaphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
    id: string;
    type: 'info' | 'alert' | 'success';
    message: string;
    createdAt: any;
}

export function NotificationFeed() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-bg-secondary border border-stroke-primary p-6 h-full flex flex-col relative overflow-hidden group">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0 relative z-10">
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                    <Megaphone size={20} className="text-accent" />
                    Live Feed
                </h3>
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar relative z-10">
                {loading ? (
                    <div className="space-y-3 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-bg-tertiary rounded-sm" />
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted text-xs text-center">
                        <Bell size={24} className="mb-2 opacity-20" />
                        No announcements yet.
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className="bg-bg-tertiary/50 border border-stroke-divider p-3 rounded-sm flex gap-3 items-start group/item hover:bg-bg-tertiary transition-colors">
                            <div className="mt-0.5 text-text-secondary shrink-0">
                                {notif.type === 'alert' && <AlertTriangle size={14} className="text-red-500" />}
                                {notif.type === 'success' && <CheckCircle size={14} className="text-green-500" />}
                                {notif.type === 'info' && <Info size={14} className="text-blue-400" />}
                            </div>
                            <div>
                                <p className="text-sm text-white leading-tight mb-1">{notif.message}</p>
                                <p className="text-[10px] text-text-muted font-mono">
                                    {notif.createdAt?.seconds ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Ambient Effect */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/10 transition-colors" />
        </div>
    );
}
