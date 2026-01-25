"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode, useMemo } from "react";

interface PixelRevealProps {
    children: ReactNode;
    gridSize?: number;
    className?: string;
}

/**
 * PixelReveal - Scroll-triggered pixel mask that reveals content
 * - Creates a grid of squares that fade out on scroll
 * - Reveals content underneath with a pixelated effect
 */
export function PixelReveal({
    children,
    gridSize = 20,
    className = "",
}: PixelRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"],
    });

    // Generate pixel grid positions
    const pixels = useMemo(() => {
        const cols = Math.ceil(100 / gridSize);
        const rows = Math.ceil(100 / gridSize);
        const result = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Random delay for each pixel
                const delay = Math.random() * 0.5;
                result.push({
                    id: `${row}-${col}`,
                    x: col * gridSize,
                    y: row * gridSize,
                    delay,
                });
            }
        }
        return result;
    }, [gridSize]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            {/* Content */}
            <div className="relative z-0">{children}</div>

            {/* Pixel mask overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {pixels.map((pixel) => (
                    <PixelSquare
                        key={pixel.id}
                        x={pixel.x}
                        y={pixel.y}
                        size={gridSize}
                        scrollProgress={scrollYProgress}
                        delay={pixel.delay}
                    />
                ))}
            </div>
        </div>
    );
}

function PixelSquare({
    x,
    y,
    size,
    scrollProgress,
    delay,
}: {
    x: number;
    y: number;
    size: number;
    scrollProgress: any;
    delay: number;
}) {
    const opacity = useTransform(
        scrollProgress,
        [delay, delay + 0.3],
        [1, 0]
    );

    return (
        <motion.div
            className="absolute bg-[#050505]"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size + 0.5}%`,
                height: `${size + 0.5}%`,
                opacity,
            }}
        />
    );
}

/**
 * PixelTransition - Simpler version for section transitions
 */
export function PixelTransition({ inverted = false }: { inverted?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const height = useTransform(scrollYProgress, [0, 0.5], ["100%", "0%"]);

    return (
        <div ref={ref} className="relative h-32 overflow-hidden">
            <motion.div
                className={`absolute inset-x-0 ${inverted ? "bottom-0" : "top-0"}`}
                style={{
                    height,
                    background: `repeating-linear-gradient(
                        ${inverted ? "180deg" : "0deg"},
                        #050505 0px,
                        #050505 8px,
                        transparent 8px,
                        transparent 16px
                    )`,
                }}
            />
        </div>
    );
}
