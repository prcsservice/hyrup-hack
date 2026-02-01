"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

interface MissionCountdownProps {
    phase: 'idea' | 'prototype';
}

export function MissionCountdown({ phase }: MissionCountdownProps) {
    const [deadline, setDeadline] = useState<Date | null>(null);

    const { settings, loading } = useGlobalSettings();

    useEffect(() => {
        if (!loading && settings) {
            const dateStr = phase === 'idea' ? settings.ideaDeadline : settings.prototypeDeadline;
            if (dateStr) {
                setDeadline(new Date(dateStr));
            }
        }
    }, [phase, settings, loading]);

    if (!deadline) return null;

    // Check if passed
    if (new Date() > deadline) {
        return <span className="text-xs font-mono text-red-500">DEADLINE PASSED</span>;
    }

    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-mono text-text-muted uppercase mb-1">Time Remaining</span>
            <CountdownTimer deadline={deadline} className="scale-75 origin-left -ml-2" />
        </div>
    );
}
