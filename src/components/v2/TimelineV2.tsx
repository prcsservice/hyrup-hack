"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const milestones = [
    { id: "reg", date: "Jan 20", label: "Registration Opens", status: "active" },
    { id: "sub", date: "Feb 15", label: "Submissions Due", status: "upcoming" },
    { id: "finals", date: "Mar 10", label: "Finals", status: "upcoming" },
    { id: "results", date: "Mar 20", label: "Results", status: "upcoming" },
];

/**
 * TimelineV2 - Horizontal timeline with scroll marker
 */
export function TimelineV2() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const markerX = useTransform(scrollYProgress, [0.3, 0.7], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="relative py-32 bg-[#050505]">
            <div className="container">
                {/* Section header */}
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#FF4D00] font-mono text-sm tracking-widest">
                        04
                    </span>
                    <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                        TIMELINE
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-16">
                    The clock is <span className="text-[#FF4D00]">ticking.</span>
                </h2>

                {/* Timeline axis */}
                <div className="relative mt-16">
                    {/* Base line */}
                    <div className="h-px bg-white/10" />

                    {/* Active marker */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#FF4D00] -mt-px"
                        style={{ left: markerX }}
                    />

                    {/* Progress fill */}
                    <motion.div
                        className="absolute top-0 left-0 h-px bg-[#FF4D00]"
                        style={{
                            width: markerX,
                        }}
                    />

                    {/* Milestones */}
                    <div className="flex justify-between mt-8">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={milestone.id}
                                className="flex flex-col items-center text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* Tick mark */}
                                <div
                                    className={`w-px h-4 -mt-8 mb-4 ${milestone.status === "active"
                                            ? "bg-[#FF4D00]"
                                            : "bg-white/20"
                                        }`}
                                />

                                {/* Date */}
                                <span
                                    className={`font-mono text-lg font-semibold ${milestone.status === "active"
                                            ? "text-[#FF4D00]"
                                            : "text-white"
                                        }`}
                                >
                                    {milestone.date}
                                </span>

                                {/* Label */}
                                <span className="text-white/40 text-sm mt-2">
                                    {milestone.label}
                                </span>

                                {/* Number */}
                                <span className="text-white/20 font-mono text-xs mt-4">
                                    0{index + 1}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
