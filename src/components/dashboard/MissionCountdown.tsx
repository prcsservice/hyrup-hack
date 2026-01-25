"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CountdownTimer } from "@/components/ui/CountdownTimer";

interface MissionCountdownProps {
    phase: 'idea' | 'prototype';
}

export function MissionCountdown({ phase }: MissionCountdownProps) {
    const [deadline, setDeadline] = useState<Date | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "settings", "public"), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                const dateStr = phase === 'idea' ? data.ideaDeadline : data.prototypeDeadline;
                if (dateStr) {
                    setDeadline(new Date(dateStr));
                }
            }
        });
        return () => unsub();
    }, [phase]);

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
