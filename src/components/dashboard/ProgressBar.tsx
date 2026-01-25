"use client";

import { useTeam } from "@/context/TeamContext";
import { Check, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Progress Bar Component
 * Shows the team's journey through the hackathon phases.
 */

const PHASES = [
    { id: "registered", label: "Registered", description: "Account created" },
    { id: "team_formed", label: "Team Formed", description: "Squad assembled" },
    { id: "idea_submitted", label: "Idea Submitted", description: "Problem defined" },
    { id: "shortlisted", label: "Shortlisted", description: "Moving forward!" },
    { id: "prototype", label: "Prototype", description: "Solution built" },
];

interface ProgressBarProps {
    className?: string;
}

export function ProgressBar({ className }: ProgressBarProps) {
    const { team } = useTeam();

    // Calculate current phase index based on team data
    const getCurrentPhaseIndex = (): number => {
        if (!team) return 0; // Just registered, no team

        // Check prototype submission (has deckUrl)
        if (team.prototype?.deckUrl) return 4;

        // Check if shortlisted
        if (team.shortlisted) return 3;

        // Check if idea submitted
        if (team.submissionStatus === 'submitted') return 2;

        // Team exists = team formed
        return 1;
    };

    const currentPhase = getCurrentPhaseIndex();

    return (
        <div className={cn("w-full", className)}>
            {/* Desktop View */}
            <div className="hidden md:block">
                <div className="relative">
                    {/* Background Line */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-stroke-divider" />

                    {/* Progress Line */}
                    <div
                        className="absolute top-4 left-0 h-0.5 bg-accent transition-all duration-500"
                        style={{ width: `${(currentPhase / (PHASES.length - 1)) * 100}%` }}
                    />

                    {/* Phase Nodes */}
                    <div className="relative flex justify-between">
                        {PHASES.map((phase, index) => {
                            const isComplete = index < currentPhase;
                            const isCurrent = index === currentPhase;
                            const isPending = index > currentPhase;

                            return (
                                <div key={phase.id} className="flex flex-col items-center">
                                    {/* Node */}
                                    <div
                                        className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                            isComplete && "bg-accent border-accent text-bg-primary",
                                            isCurrent && "bg-bg-tertiary border-accent text-accent animate-pulse",
                                            isPending && "bg-bg-secondary border-stroke-divider text-text-muted"
                                        )}
                                    >
                                        {isComplete ? (
                                            <Check size={12} strokeWidth={3} />
                                        ) : isCurrent ? (
                                            <Loader2 size={12} className="animate-spin" />
                                        ) : (
                                            <Circle size={6} />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div className="mt-2 text-center">
                                        <p className={cn(
                                            "text-[10px] font-semibold uppercase tracking-wider",
                                            isComplete && "text-accent",
                                            isCurrent && "text-white",
                                            isPending && "text-text-muted"
                                        )}>
                                            {phase.label}
                                        </p>
                                        <p className="text-[10px] text-text-muted mt-0.5 hidden lg:block scale-90 origin-top">
                                            {phase.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile View - Compact */}
            <div className="md:hidden">
                <div className="flex items-center gap-3 p-3 bg-bg-secondary border border-stroke-divider rounded-sm">
                    <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent font-bold text-sm">
                        {currentPhase + 1}/{PHASES.length}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{PHASES[currentPhase].label}</p>
                        <p className="text-xs text-text-muted">{PHASES[currentPhase].description}</p>
                    </div>
                    {/* Mini Progress Bar */}
                    <div className="flex-1 h-1 bg-bg-tertiary rounded-full overflow-hidden ml-auto max-w-[80px]">
                        <div
                            className="h-full bg-accent transition-all duration-500"
                            style={{ width: `${((currentPhase + 1) / PHASES.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
