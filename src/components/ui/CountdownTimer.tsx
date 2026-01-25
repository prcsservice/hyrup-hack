"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTimeRemaining } from "@/lib/utils";
import { digitFlip } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Countdown Timer v2.0
 * Reference: design.md §4 (Mono for Data/Timers)
 * 
 * Sharp blocks, monospace digits, 1px borders, no glow
 */

interface CountdownTimerProps {
    deadline: Date;
    className?: string;
    onComplete?: () => void;
}

export function CountdownTimer({ deadline, className, onComplete }: CountdownTimerProps) {
    const [time, setTime] = useState(getTimeRemaining(deadline));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            const remaining = getTimeRemaining(deadline);
            setTime(remaining);
            if (remaining.total <= 0) {
                clearInterval(interval);
                onComplete?.();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [deadline, onComplete]);

    if (!mounted) {
        return <CountdownSkeleton />;
    }

    return (
        <div className={cn("flex items-center gap-6", className)}>
            <CountdownUnit value={time.days} label="DAYS" />
            <Separator />
            <CountdownUnit value={time.hours} label="HRS" />
            <Separator />
            <CountdownUnit value={time.minutes} label="MIN" />
            <Separator />
            <CountdownUnit value={time.seconds} label="SEC" />
        </div>
    );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
    const display = value.toString().padStart(2, "0");

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex gap-[2px]">
                <AnimatePresence mode="popLayout">
                    {display.split("").map((digit, i) => (
                        <motion.div
                            key={`${digit}-${i}-${value}`}
                            className="countdown-digit"
                            variants={digitFlip}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {digit}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <span className="text-label text-text-muted">{label}</span>
        </div>
    );
}

function Separator() {
    return (
        <span className="text-2xl font-mono text-text-muted self-start mt-3">:</span>
    );
}

function CountdownSkeleton() {
    return (
        <div className="flex items-center gap-6 opacity-50">
            {["DAYS", "HRS", "MIN", "SEC"].map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-2">
                    <div className="flex gap-[2px]">
                        <div className="countdown-digit">0</div>
                        <div className="countdown-digit">0</div>
                    </div>
                    <span className="text-label text-text-muted">{label}</span>
                </div>
            ))}
        </div>
    );
}
