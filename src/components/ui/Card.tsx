"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardHover, cardFloat } from "@/lib/motion";

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "bento" | "glass";
    hover?: boolean;
    float?: boolean;
    glow?: "green" | "cyan" | "violet" | "amber" | "red" | "pink";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            variant = "default",
            hover = true,
            float = false,
            glow,
            children,
            ...props
        },
        ref
    ) => {
        const variants = {
            default: "card",
            bento: "card bento-card",
            glass:
                "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl",
        };

        const glowClasses = {
            green: "glow-green",
            cyan: "glow-cyan",
            violet: "glow-violet",
            amber: "glow-amber",
            red: "glow-red",
            pink: "glow-pink",
        };

        return (
            <motion.div
                ref={ref}
                className={cn(
                    variants[variant],
                    glow && glowClasses[glow],
                    className
                )}
                variants={hover ? cardHover : undefined}
                initial="initial"
                whileHover={hover ? "hover" : undefined}
                animate={float ? "animate" : undefined}
                {...(float && { variants: cardFloat })}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";

// Card subcomponents
const CardHeader = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("p-6 pb-0", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
    HTMLHeadingElement,
    HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-card-title font-semibold", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-text-secondary text-sm mt-1", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("p-6 pt-0 flex items-center gap-4", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
};
