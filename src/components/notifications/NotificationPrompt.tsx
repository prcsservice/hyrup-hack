"use client";

import { motion } from "framer-motion";
import { Bell, BellOff, Loader2, Check } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Button } from "@/components/ui/Button";

export function NotificationPrompt() {
    const { isSupported, permission, enableNotifications, isEnabling } = usePushNotifications();

    // Don't show while loading
    if (permission === 'loading') return null;

    // Don't show if not supported
    if (!isSupported || permission === 'unsupported') return null;

    // Don't show if already granted
    if (permission === 'granted') return null;

    // Show blocked message if denied
    if (permission === 'denied') {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-tertiary/50 border border-stroke-primary p-4 mb-4"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                        <BellOff size={18} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium">Notifications Blocked</p>
                        <p className="text-text-muted text-xs">Enable in browser settings to receive updates</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Show enable prompt for 'default' permission
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent/5 border border-accent/20 p-4 mb-4"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                    <Bell size={18} className="text-accent" />
                </div>
                <div className="flex-1">
                    <p className="text-white text-sm font-medium">Stay Updated</p>
                    <p className="text-text-muted text-xs">Get notified about deadlines, team activity & results</p>
                </div>
                <Button
                    size="sm"
                    onClick={enableNotifications}
                    disabled={isEnabling}
                    className="shrink-0"
                >
                    {isEnabling ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <>Enable</>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}

export function NotificationToggle() {
    const { isSupported, permission, enableNotifications, isEnabling } = usePushNotifications();

    if (!isSupported) return null;

    const isEnabled = permission === 'granted';

    return (
        <button
            onClick={enableNotifications}
            disabled={isEnabling || isEnabled}
            className={`
                flex items-center gap-2 px-3 py-2 text-sm transition-colors
                ${isEnabled
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400 cursor-default'
                    : 'bg-bg-tertiary border border-stroke-primary text-text-muted hover:text-white hover:border-accent'
                }
            `}
        >
            {isEnabling ? (
                <Loader2 size={14} className="animate-spin" />
            ) : isEnabled ? (
                <Check size={14} />
            ) : (
                <Bell size={14} />
            )}
            {isEnabled ? 'Notifications On' : 'Enable Notifications'}
        </button>
    );
}
