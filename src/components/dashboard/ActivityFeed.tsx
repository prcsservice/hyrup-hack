"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, subscribeToActivities, subscribeToStats } from "@/lib/activityService";
import { Zap, Users, Rocket, Lightbulb, Trophy, TrendingUp } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
    team_created: <Users size={14} />,
    idea_submitted: <Lightbulb size={14} />,
    user_joined: <Zap size={14} />,
    prototype_submitted: <Rocket size={14} />,
    milestone_unlocked: <Trophy size={14} />,
};

const colorMap: Record<string, string> = {
    team_created: "text-blue-400",
    idea_submitted: "text-accent",
    user_joined: "text-green-400",
    prototype_submitted: "text-purple-400",
    milestone_unlocked: "text-yellow-400",
};

export function ActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [stats, setStats] = useState({ teamsToday: 0, usersToday: 0 });
    const [visibleActivity, setVisibleActivity] = useState<Activity | null>(null);

    useEffect(() => {
        const unsubActivities = subscribeToActivities((newActivities) => {
            setActivities(newActivities);
        }, 20);

        const unsubStats = subscribeToStats(setStats);

        return () => {
            unsubActivities();
            unsubStats();
        };
    }, []);

    // Show one activity at a time with auto-rotation
    useEffect(() => {
        if (activities.length === 0) return;

        let index = 0;
        setVisibleActivity(activities[0]);

        const interval = setInterval(() => {
            index = (index + 1) % Math.min(activities.length, 5);
            setVisibleActivity(activities[index]);
        }, 4000);

        return () => clearInterval(interval);
    }, [activities]);

    return (
        <div className="bg-bg-secondary border border-stroke-primary p-4 mb-6">
            {/* Stats Bar */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stroke-divider">
                <div className="flex items-center gap-2 text-sm">
                    <TrendingUp size={14} className="text-accent" />
                    <span className="text-text-muted">Today:</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <span className="text-accent font-bold">{stats.usersToday}</span>
                    <span className="text-text-muted">joined</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                    <span className="text-accent font-bold">{stats.teamsToday}</span>
                    <span className="text-text-muted">teams formed</span>
                </div>
            </div>

            {/* Activity Ticker */}
            <div className="h-8 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {visibleActivity && (
                        <motion.div
                            key={visibleActivity.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3 absolute inset-0"
                        >
                            <div className={`${colorMap[visibleActivity.type] || 'text-accent'}`}>
                                {iconMap[visibleActivity.type] || <Zap size={14} />}
                            </div>
                            <span className="text-sm text-white truncate">
                                {visibleActivity.message}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono ml-auto flex-shrink-0">
                                {formatTimeAgo(visibleActivity.createdAt?.toDate())}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {activities.length === 0 && (
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                        <Zap size={14} className="animate-pulse" />
                        <span>Waiting for activity...</span>
                    </div>
                )}
            </div>

            {/* Progress Dots */}
            {activities.length > 1 && (
                <div className="flex items-center justify-center gap-1 mt-3">
                    {activities.slice(0, 5).map((activity, index) => (
                        <div
                            key={activity.id}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${visibleActivity?.id === activity.id
                                    ? 'bg-accent'
                                    : 'bg-stroke-divider'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function formatTimeAgo(date: Date | undefined): string {
    if (!date) return 'just now';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
