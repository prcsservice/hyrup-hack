"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface RevealHeadingProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

/**
 * RevealHeading - Text that gets covered by an orange block, turning black.
 * Reference: User Image "Interface Minimalism"
 */
export function RevealHeading({ children, className, delay = 0 }: RevealHeadingProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <div ref={ref} className={cn("relative inline-block", className)}>
            {/* Base Text (White) */}
            <span className="relative z-0 text-white block px-2">
                {children}
            </span>

            {/* Overlay Mask (Orange Background + Black Text) */}
            <motion.div
                className="absolute inset-0 z-10 bg-[#FF4D00] overflow-hidden whitespace-nowrap"
                initial={{ width: "0%" }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1], // ease-primary
                    delay: delay
                }}
            >
                <span className="block px-2 text-black">
                    {children}
                </span>
            </motion.div>
        </div>
    );
}
