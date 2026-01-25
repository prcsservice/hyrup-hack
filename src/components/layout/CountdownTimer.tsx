"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
    className?: string;
    targetDate?: Date; // Optional, defaults to a fixed date
}

export function CountdownTimer({ className, targetDate }: CountdownTimerProps) {
    // Default to 15 days from now if no date provided, or specific hackathon date
    // Using a fixed future date for demo purposes: Feb 15, 2026
    const target = targetDate || new Date("2026-02-15T00:00:00");

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +target - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            } else {
                // Timer expired
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [target]);

    const formatNumber = (num: number) => String(num).padStart(2, '0');

    return (
        <div className={cn("flex items-center gap-4 font-mono text-sm", className)}>
            <span className="text-text-muted uppercase tracking-widest text-xs hidden sm:inline-block">
                Registration Closes In:
            </span>

            <div className="flex items-center gap-2 text-[#FF4D00]">
                <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold">{formatNumber(timeLeft.days)}</span>
                    <span className="text-xs text-secondary opacity-70">d</span>
                </div>
                <span className="text-secondary opacity-30">:</span>

                <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold">{formatNumber(timeLeft.hours)}</span>
                    <span className="text-xs text-secondary opacity-70">h</span>
                </div>
                <span className="text-secondary opacity-30">:</span>

                <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold">{formatNumber(timeLeft.minutes)}</span>
                    <span className="text-xs text-secondary opacity-70">m</span>
                </div>
                <span className="text-secondary opacity-30">:</span>

                <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold w-6">{formatNumber(timeLeft.seconds)}</span>
                    <span className="text-xs text-secondary opacity-70">s</span>
                </div>
            </div>
        </div>
    );
}
