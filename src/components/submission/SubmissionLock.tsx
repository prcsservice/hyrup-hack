"use client";

import { useSubmission } from "@/context/SubmissionContext";
import { Lock, User } from "lucide-react";
import { motion } from "framer-motion";

interface SubmissionLockProps {
    leaderName?: string;
}

export function SubmissionLock({ leaderName }: SubmissionLockProps) {
    const { isTeamLeader, canEditSubmission } = useSubmission();

    if (isTeamLeader && canEditSubmission) return null;

    const message = !isTeamLeader
        ? "Only the team leader can edit submissions"
        : "Submission deadline has passed";

    const subMessage = !isTeamLeader
        ? `Contact ${leaderName || 'your team leader'} to make changes`
        : "Editing is no longer available";

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-tertiary/50 border border-stroke-primary p-4 flex items-center gap-4 mb-6"
        >
            <div className="w-10 h-10 bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                <Lock size={18} className="text-accent" />
            </div>
            <div>
                <p className="text-white text-sm font-medium">{message}</p>
                <p className="text-text-muted text-xs mt-0.5">{subMessage}</p>
            </div>
        </motion.div>
    );
}
