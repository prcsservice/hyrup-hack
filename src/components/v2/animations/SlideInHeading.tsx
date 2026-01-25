"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";

interface SlideInHeadingProps {
    children: ReactNode;
    highlightText?: string;
    className?: string;
    delay?: number;
}

/**
 * SlideInHeading - Section heading that slides in from side
 * - Text slides from left
 * - Highlighted portion gets orange background
 * - Text color flips to black on highlighted part
 */
export function SlideInHeading({
    children,
    highlightText,
    className = "",
    delay = 0,
}: SlideInHeadingProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.9", "start 0.3"],
    });

    const x = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    const text = typeof children === "string" ? children : "";

    if (highlightText && text.includes(highlightText)) {
        const parts = text.split(highlightText);
        return (
            <motion.div
                ref={ref}
                className={`overflow-hidden ${className}`}
                style={{ x, opacity }}
            >
                <span className="text-white">{parts[0]}</span>
                <span className="bg-[#FF4D00] text-black px-2 py-1 inline-block">
                    {highlightText}
                </span>
                <span className="text-white">{parts[1]}</span>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={`overflow-hidden ${className}`}
            style={{ x, opacity }}
        >
            {children}
        </motion.div>
    );
}

interface SectionHeadingProps {
    number: string;
    label: string;
    title: string;
    highlightWord?: string;
}

/**
 * Full section heading with number, label, and animated title
 */
export function SectionHeading({
    number,
    label,
    title,
    highlightWord,
}: SectionHeadingProps) {
    return (
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
                <span className="text-[#FF4D00] font-mono text-sm tracking-widest">
                    {number}
                </span>
                <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                    {label}
                </span>
            </div>
            <SlideInHeading
                highlightText={highlightWord}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-none"
            >
                {title}
            </SlideInHeading>
        </div>
    );
}
