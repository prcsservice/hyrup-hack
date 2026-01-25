"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const lines = [
    { text: "India is broken.", highlight: false, delay: 0 },
    { text: "", highlight: false, delay: 0.2 }, // Spacer
    { text: "Potholes swallow lives.", highlight: false, delay: 0.4 },
    { text: "Hospitals turn away the poor.", highlight: false, delay: 0.6 },
    { text: "Courts delay justice for decades.", highlight: false, delay: 0.8 },
    { text: "Schools teach tests, not thinking.", highlight: false, delay: 1 },
    { text: "", highlight: false, delay: 1.2 }, // Spacer
    { text: "We're not asking for permission.", highlight: true, delay: 1.4 },
    { text: "We are the fix.", highlight: true, delay: 1.6 },
];

/**
 * ManifestoSection - Emotional storytelling with scroll-linked reveals
 * - Each line reveals on scroll
 * - Key phrases highlight in orange
 */
export function ManifestoSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    return (
        <section
            ref={containerRef}
            className="relative py-32 bg-[#050505] min-h-screen flex items-center"
        >
            {/* Background accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-[#FF4D00] to-transparent" />

            <div className="container">
                {/* Section header */}
                <div className="flex items-center gap-4 mb-16">
                    <span className="text-[#FF4D00] font-mono text-sm tracking-widest">
                        02
                    </span>
                    <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                        THE MANIFESTO
                    </span>
                </div>

                {/* Lines */}
                <div className="max-w-4xl space-y-4">
                    {lines.map((line, index) => (
                        <ManifestoLine
                            key={index}
                            text={line.text}
                            highlight={line.highlight}
                            index={index}
                            total={lines.length}
                            scrollProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ManifestoLine({
    text,
    highlight,
    index,
    total,
    scrollProgress,
}: {
    text: string;
    highlight: boolean;
    index: number;
    total: number;
    scrollProgress: any;
}) {
    if (!text) return <div className="h-8" />;

    // Calculate when this line should animate based on scroll
    const startProgress = 0.1 + (index / total) * 0.5;
    const endProgress = startProgress + 0.1;

    const opacity = useTransform(
        scrollProgress,
        [startProgress, endProgress],
        [0, 1]
    );

    const x = useTransform(
        scrollProgress,
        [startProgress, endProgress],
        [-30, 0]
    );

    const color = useTransform(
        scrollProgress,
        [startProgress, endProgress],
        highlight ? ["rgba(255,77,0,0.3)", "rgba(255,77,0,1)"] : ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.8)"]
    );

    return (
        <motion.p
            className={`text-2xl md:text-4xl lg:text-5xl font-display font-bold leading-tight`}
            style={{
                opacity,
                x,
                color,
            }}
        >
            {text}
        </motion.p>
    );
}
