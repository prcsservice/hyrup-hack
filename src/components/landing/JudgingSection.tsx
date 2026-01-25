"use client";

import { motion } from "framer-motion";
import { competitionConfig } from "@/lib/config";
import { staggerContainer, staggerItem, lineDraw } from "@/lib/motion";

/**
 * Judging Section v2.0
 * Reference: layout.md §5.7
 * 
 * Split grid.
 * Left: radar plot rubric
 * Right: judge grid
 * Center vertical spine.
 */

export function JudgingSection() {
    const criteria = Object.entries(competitionConfig.judgingCriteria);

    return (
        <section className="section relative py-32">
            {/* Section header */}
            <div className="section-header container">
                <span className="section-number">07</span>
                <span className="text-label text-text-muted">JUDGING</span>
            </div>

            <div className="container section-content">
                {/* Title */}
                <motion.h2
                    className="text-section"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Real standards.
                </motion.h2>

                {/* Split grid */}
                <div className="grid lg:grid-cols-2 gap-16 mt-16 relative">
                    {/* Center spine */}
                    <div className="spine-vertical hidden lg:block" />

                    {/* Left: Radar/Rubric */}
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <h3 className="text-label text-text-muted mb-8">CRITERIA</h3>

                        {/* Radar plot as SVG */}
                        <div className="relative aspect-square max-w-sm">
                            <svg
                                viewBox="0 0 200 200"
                                className="w-full h-full"
                                fill="none"
                            >
                                {/* Radar circles */}
                                {[1, 2, 3, 4].map((i) => (
                                    <circle
                                        key={i}
                                        cx="100"
                                        cy="100"
                                        r={i * 20}
                                        className="stroke-stroke-primary"
                                        strokeWidth="0.5"
                                    />
                                ))}

                                {/* Axis lines */}
                                {criteria.map((_, i) => {
                                    const angle = (i * 360) / criteria.length - 90;
                                    const rad = (angle * Math.PI) / 180;
                                    const x2 = 100 + 80 * Math.cos(rad);
                                    const y2 = 100 + 80 * Math.sin(rad);
                                    return (
                                        <line
                                            key={i}
                                            x1="100"
                                            y1="100"
                                            x2={x2}
                                            y2={y2}
                                            className="stroke-stroke-primary"
                                            strokeWidth="0.5"
                                        />
                                    );
                                })}

                                {/* Data polygon */}
                                <motion.polygon
                                    points={criteria
                                        .map(([_, value], i) => {
                                            const angle = (i * 360) / criteria.length - 90;
                                            const rad = (angle * Math.PI) / 180;
                                            const r = (value / 20) * 80;
                                            return `${100 + r * Math.cos(rad)},${100 + r * Math.sin(rad)}`;
                                        })
                                        .join(" ")}
                                    className="fill-accent/10 stroke-accent"
                                    strokeWidth="1"
                                    variants={lineDraw}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                />
                            </svg>
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {criteria.map(([key, value]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-text-secondary capitalize">
                                        {key.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                    <span className="text-mono">{value}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Judge grid */}
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <h3 className="text-label text-text-muted mb-8">THE JURY</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    className="border border-stroke-divider p-6 hover:border-stroke-primary transition-colors"
                                    variants={staggerItem}
                                >
                                    <div className="w-12 h-12 border border-stroke-primary flex items-center justify-center mb-4">
                                        <span className="text-mono text-text-muted">{i}</span>
                                    </div>
                                    <span className="text-label text-text-muted">Judge {i}</span>
                                    <p className="text-sm text-text-secondary mt-1">
                                        Industry Expert
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-sm text-text-muted mt-8 italic">
                            Full jury announcement coming soon
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
