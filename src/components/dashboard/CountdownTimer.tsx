"use client";

import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

function calculateTimeLeft(deadline: string | undefined): TimeLeft | null {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        total: diff,
    };
}

function getUrgencyColor(timeLeft: TimeLeft | null): string {
    if (!timeLeft || timeLeft.total <= 0) return "bg-red-500/20 border-red-500/50 text-red-500";
    if (timeLeft.days < 1) return "bg-red-500/20 border-red-500/50 text-red-500";
    if (timeLeft.days < 3) return "bg-orange-500/20 border-orange-500/50 text-orange-400";
    if (timeLeft.days < 7) return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
    return "bg-accent/10 border-accent/30 text-accent";
}

export function CountdownTimer() {
    const { settings, loading } = useGlobalSettings();
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [activeDeadline, setActiveDeadline] = useState<{ label: string; deadline: string } | null>(null);

    // Determine which deadline to show
    useEffect(() => {
        const now = new Date();

        // Priority: closest upcoming deadline
        const deadlines = [
            { label: "Registration Closes", deadline: settings.registrationDeadline },
            { label: "Idea Submission", deadline: settings.ideaDeadline },
            { label: "Prototype Due", deadline: settings.prototypeDeadline },
        ].filter(d => d.deadline && new Date(d.deadline) > now);

        if (deadlines.length > 0) {
            deadlines.sort((a, b) =>
                new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
            );
            setActiveDeadline(deadlines[0] as { label: string; deadline: string });
        } else {
            setActiveDeadline(null);
        }
    }, [settings]);

    // Update countdown every second
    useEffect(() => {
        if (!activeDeadline) {
            setTimeLeft(null);
            return;
        }

        const updateTimer = () => {
            setTimeLeft(calculateTimeLeft(activeDeadline.deadline));
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [activeDeadline]);

    if (loading || !activeDeadline || !timeLeft) return null;

    const urgencyColor = getUrgencyColor(timeLeft);
    const isUrgent = timeLeft.days < 1 && timeLeft.total > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border p-4 mb-6 ${urgencyColor}`}
        >
            <div className="flex items-center gap-3 mb-3">
                {isUrgent ? (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        <AlertTriangle size={18} />
                    </motion.div>
                ) : (
                    <Clock size={18} />
                )}
                <span className="text-xs font-mono uppercase tracking-wider">
                    {activeDeadline.label}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {timeLeft.total <= 0 ? (
                    <span className="text-sm font-bold">Deadline Passed</span>
                ) : (
                    <>
                        <TimeUnit value={timeLeft.days} label="Days" />
                        <span className="text-text-muted">:</span>
                        <TimeUnit value={timeLeft.hours} label="Hrs" />
                        <span className="text-text-muted">:</span>
                        <TimeUnit value={timeLeft.minutes} label="Min" />
                        <span className="text-text-muted">:</span>
                        <TimeUnit value={timeLeft.seconds} label="Sec" animate />
                    </>
                )}
            </div>

            {isUrgent && timeLeft.total > 0 && (
                <motion.div
                    className="mt-3 text-[10px] uppercase tracking-widest opacity-80"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    Submit now to avoid missing the deadline
                </motion.div>
            )}
        </motion.div>
    );
}

function TimeUnit({ value, label, animate }: { value: number; label: string; animate?: boolean }) {
    return (
        <div className="flex flex-col items-center">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={animate ? { y: -10, opacity: 0 } : false}
                    animate={{ y: 0, opacity: 1 }}
                    exit={animate ? { y: 10, opacity: 0 } : undefined}
                    className="text-2xl font-display font-bold tabular-nums"
                >
                    {String(value).padStart(2, '0')}
                </motion.span>
            </AnimatePresence>
            <span className="text-[9px] text-text-muted uppercase tracking-wider mt-1">
                {label}
            </span>
        </div>
    );
}
