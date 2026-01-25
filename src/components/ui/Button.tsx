"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonPress, DURATIONS, EASINGS } from "@/lib/motion";

/**
 * Button Component v2.0
 * Reference: design.md §10, animation.md §10
 * 
 * - Flat accent fill (primary)
 * - Square corners (no pills)
 * - No shadow
 * - Underline on hover
 * - Click: scale 0.96, instant snap back
 * - NO ripple effects
 */
export const buttonBaseStyles =
    "relative inline-flex items-center justify-center gap-3 font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-40 disabled:pointer-events-none";

export const buttonVariants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
};

export const buttonSizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[0.9375rem]",
    lg: "px-8 py-4 text-base",
};

interface ButtonProps
    extends Omit<HTMLMotionProps<"button">, "ref">,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">> {
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                className={cn(buttonBaseStyles, buttonVariants[variant], buttonSizes[size], className)}
                variants={buttonPress}
                initial="initial"
                whileTap={disabled ? undefined : "tap"}
                disabled={disabled}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
