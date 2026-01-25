"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "accent" | "outline" | "prize";
    size?: "sm" | "md" | "lg";
    pulse?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    (
        { className, variant = "default", size = "md", pulse = false, ...props },
        ref
    ) => {
        const variants = {
            default: "bg-bg-tertiary text-text-secondary border-stroke-primary",
            accent:
                "bg-accent-green/20 text-accent-green border-accent-green/30",
            outline: "bg-transparent text-text-primary border-stroke-primary",
            prize:
                "bg-gradient-to-r from-accent-amber/20 to-accent-green/20 text-accent-amber border-accent-amber/30",
        };

        const sizes = {
            sm: "px-2 py-0.5 text-xs",
            md: "px-3 py-1 text-sm",
            lg: "px-4 py-1.5 text-base",
        };

        const badge = (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center gap-1.5 font-medium rounded-full border",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );

        if (pulse) {
            return (
                <motion.span
                    className="relative inline-flex"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {badge}
                    <span className="absolute inset-0 rounded-full bg-accent-green/20 animate-ping" />
                </motion.span>
            );
        }

        return badge;
    }
);

Badge.displayName = "Badge";

export { Badge };
