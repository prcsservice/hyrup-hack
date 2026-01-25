"use client";

import { Check, Circle } from "lucide-react";
import { useSubmission } from "@/context/SubmissionContext";

const STEPS = [
    { id: 1, label: "The Problem" },
    { id: 2, label: "The Solution" },
    { id: 3, label: "Impact" },
    { id: 4, label: "Review" },
];

export function Stepper() {
    const { step, setStep, status } = useSubmission();

    return (
        <div className="w-full max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
                {/* Connector Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-bg-tertiary -z-10" />

                {STEPS.map((s, idx) => {
                    const isActive = step === s.id;
                    const isCompleted = step > s.id;

                    return (
                        <div key={s.id} className="flex flex-col items-center gap-2 bg-bg-primary px-2">
                            <button
                                onClick={() => status !== 'submitted' && setStep(s.id)}
                                disabled={status === 'submitted'}
                                className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                          ${isActive ? 'border-accent bg-accent/10 text-accent scale-110 shadow-lg shadow-accent/20' :
                                        isCompleted ? 'border-stroke-secondary bg-bg-secondary text-text-muted' : 'border-bg-tertiary bg-bg-primary text-text-disabled'}
                       `}
                            >
                                {isCompleted ? <Check size={16} /> : <span className="text-sm font-mono font-bold">{s.id}</span>}
                            </button>
                            <span
                                className={`text-xs font-mono uppercase tracking-widest transition-colors ${isActive ? 'text-accent' : isCompleted ? 'text-text-secondary' : 'text-text-disabled'}`}
                            >
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
