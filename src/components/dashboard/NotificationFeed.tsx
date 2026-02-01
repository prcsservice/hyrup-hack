"use client";

import { Bell, Info, AlertTriangle, CheckCircle, Megaphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "@/context/NotificationContext";

export function NotificationFeed() {
    const { notifications, loading } = useNotifications();

    if (loading) return <div className="p-4 text-center text-text-muted">Loading...</div>;

    return (
        <div className="bg-bg-secondary border border-stroke-primary p-6 h-full flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6 z-10 relative">
                <div className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-accent-primary" />
                    <h2 className="text-xl font-bold text-white font-display">Updates</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 relative z-10 space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center text-text-muted py-8 bg-bg-tertiary/30 rounded-lg border border-stroke-dim border-dashed">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No updates yet</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div key={n.id} className={`p-4 rounded-lg border border-stroke-dim bg-bg-tertiary/20 hover:bg-bg-tertiary/40 transition-colors ${!n.read ? 'border-l-2 border-l-accent-primary' : ''}`}>
                            <div className="flex gap-3">
                                {n.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                                {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />}
                                {n.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />}
                                {n.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}

                                <div>
                                    <h3 className={`text-sm font-medium ${!n.read ? 'text-white' : 'text-text-secondary'}`}>
                                        {n.title}
                                    </h3>
                                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                                        {n.message}
                                    </p>
                                    <span className="text-[10px] text-text-muted mt-2 block opacity-60">
                                        {n.createdAt ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </div>
    );
}
