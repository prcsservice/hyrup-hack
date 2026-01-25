"use client";

import { useSubmission } from "@/context/SubmissionContext";
import { Loader2, CheckCircle2, Save } from "lucide-react";

export function AutoSaver() {
    const { status } = useSubmission();

    if (status === 'draft') {
        return (
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono opacity-50">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Unsaved changes
            </div>
        );
    }

    if (status === 'saving') {
        return (
            <div className="flex items-center gap-2 text-accent text-xs font-mono">
                <Loader2 size={12} className="animate-spin" />
                Saving...
            </div>
        );
    }

    if (status === 'saved') {
        return (
            <div className="flex items-center gap-2 text-green-500 text-xs font-mono">
                <CheckCircle2 size={12} />
                All saved
            </div>
        );
    }

    if (status === 'submitted') {
        return (
            <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold">
                LOCKED
            </div>
        )
    }

    return null;
}
