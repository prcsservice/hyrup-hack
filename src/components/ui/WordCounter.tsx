"use client";

import { cn } from "@/lib/utils";

/**
 * Word Counter Component
 * Displays current word count vs max with color coding.
 */

interface WordCounterProps {
    value: string;
    maxWords: number;
    warningThreshold?: number; // Percentage (0-1) at which to show warning
    className?: string;
}

export function WordCounter({ value, maxWords, warningThreshold = 0.8, className }: WordCounterProps) {
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
    const percentage = wordCount / maxWords;

    const isOverLimit = wordCount > maxWords;
    const isWarning = percentage >= warningThreshold && !isOverLimit;

    return (
        <div className={cn("flex items-center gap-2 text-xs font-mono", className)}>
            <span className={cn(
                "transition-colors",
                isOverLimit && "text-red-500 font-bold",
                isWarning && "text-yellow-500",
                !isWarning && !isOverLimit && "text-text-muted"
            )}>
                {wordCount}
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-text-muted">{maxWords} words</span>

            {/* Visual indicator bar */}
            <div className="flex-1 max-w-[60px] h-1 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all duration-300",
                        isOverLimit && "bg-red-500",
                        isWarning && "bg-yellow-500",
                        !isWarning && !isOverLimit && "bg-accent"
                    )}
                    style={{ width: `${Math.min(percentage * 100, 100)}%` }}
                />
            </div>
        </div>
    );
}
