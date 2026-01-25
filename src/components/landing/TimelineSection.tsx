"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { timelineMilestones } from "@/lib/config";
import { staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Timeline Section v2.0
 * Reference: layout.md §5.4, animation.md §8
 * 
 * Full-width horizontal axis.
 * Dates snap to ticks.
 * Active marker follows scroll.
 * No glow. Flat accent dot only.
 */

export function TimelineSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const markerPosition = useTransform(scrollYProgress, [0.3, 0.7], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="section relative py-32">
            {/* Section header */}
            <div className="section-header container">
                <span className="section-number">04</span>
                <span className="text-label text-text-muted">TIMELINE</span>
            </div>

            <div className="container section-content">
                {/* Title */}
                <motion.h2
                    className="text-section"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    The clock is ticking.
                </motion.h2>

                {/* Horizontal axis */}
                <div className="relative mt-24">
                    {/* Base line */}
                    <div className="h-px bg-stroke-primary" />

                    {/* Active marker */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-accent"
                        style={{ left: markerPosition }}
                    />

                    {/* Milestones */}
                    <motion.div
                        className="flex justify-between mt-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {timelineMilestones.map((milestone, index) => (
                            <motion.div
                                key={milestone.id}
                                className="flex flex-col items-center text-center"
                                variants={staggerItem}
                            >
                                {/* Tick mark */}
                                <div className="w-px h-4 bg-stroke-primary -mt-8 mb-4" />

                                {/* Date */}
                                <span className="text-mono text-lg font-semibold">
                                    {milestone.date.toLocaleDateString("en-IN", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>

                                {/* Label */}
                                <span className="text-label text-text-muted mt-2">
                                    {milestone.label}
                                </span>

                                {/* Number */}
                                <span className="text-label text-accent mt-4 opacity-50">
                                    0{index + 1}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
