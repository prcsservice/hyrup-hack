"use client";

import { motion } from "framer-motion";
import {
    Users,
    FileText,
    Bell,
    MessageCircle,
    Box,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
    variant: 'no-team' | 'no-submissions' | 'no-notifications' | 'no-messages' | 'generic';
    title?: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const variants = {
    'no-team': {
        icon: Users,
        title: "No Team Yet",
        description: "Create your own team or join an existing one to start your hackathon journey.",
    },
    'no-submissions': {
        icon: FileText,
        title: "No Submissions",
        description: "You haven't submitted your idea yet. Start working on your innovation!",
    },
    'no-notifications': {
        icon: Bell,
        title: "All Caught Up",
        description: "You have no new notifications. Check back later for updates.",
    },
    'no-messages': {
        icon: MessageCircle,
        title: "No Messages",
        description: "Start the conversation with your team members!",
    },
    'generic': {
        icon: Box,
        title: "Nothing Here",
        description: "There's nothing to display at the moment.",
    },
};

export function EmptyState({ variant, title, description, action }: EmptyStateProps) {
    const config = variants[variant];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-6 text-center"
        >
            {/* Animated Icon */}
            <motion.div
                initial={{ y: 10 }}
                animate={{ y: [10, 0, 10] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-16 h-16 bg-bg-tertiary border border-stroke-primary flex items-center justify-center mb-6"
            >
                <Icon size={28} className="text-text-muted" />
            </motion.div>

            {/* Text */}
            <h3 className="text-white font-bold text-lg mb-2">
                {title || config.title}
            </h3>
            <p className="text-text-secondary text-sm max-w-xs mb-6">
                {description || config.description}
            </p>

            {/* Action Button */}
            {action && (
                <Button onClick={action.onClick} size="sm">
                    <Plus size={14} className="mr-1" />
                    {action.label}
                </Button>
            )}
        </motion.div>
    );
}
