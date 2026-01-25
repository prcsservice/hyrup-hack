"use client";

import { motion } from "framer-motion";
import { competitionConfig } from "@/lib/config";
import { maskReveal, contentSnap } from "@/lib/motion";

/**
 * Prize Section v2.0
 * Reference: layout.md §5.5
 * 
 * Ultra minimal.
 * Large ₹3,00,000 figure.
 * One supporting line.
 * Divider top + bottom.
 */

export function PrizePoolSection() {
    return (
        <section className="section relative py-32 flex items-center min-h-[70vh]">
            {/* Section header */}
            <div className="absolute top-0 left-0 right-0 section-header container">
                <span className="section-number">05</span>
                <span className="text-label text-text-muted">PRIZE</span>
            </div>

            <div className="container">
                <motion.div
                    className="text-center"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-20%" }}
                >
                    {/* Large figure */}
                    <motion.div
                        className="overflow-hidden"
                        variants={maskReveal}
                    >
                        <span className="text-hero text-accent font-mono">
                            {competitionConfig.prizePoolFormatted}
                        </span>
                    </motion.div>

                    {/* Supporting line */}
                    <motion.p
                        className="text-manifesto text-text-secondary mt-8"
                        variants={contentSnap}
                    >
                        in cash, credits, and opportunity
                    </motion.p>

                    {/* Additional info */}
                    <motion.div
                        className="flex justify-center gap-16 mt-16 pt-16 border-t border-stroke-divider"
                        variants={contentSnap}
                    >
                        <div className="text-center">
                            <span className="text-label text-text-muted">Entry</span>
                            <span className="block text-2xl font-mono mt-2">
                                ₹{competitionConfig.entryFee}
                            </span>
                        </div>
                        <div className="text-center">
                            <span className="text-label text-text-muted">Team Size</span>
                            <span className="block text-2xl font-mono mt-2">
                                1–{competitionConfig.maxTeamSize}
                            </span>
                        </div>
                        <div className="text-center">
                            <span className="text-label text-text-muted">Domains</span>
                            <span className="block text-2xl font-mono mt-2">
                                10+
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
