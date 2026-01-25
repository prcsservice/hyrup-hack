"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { competitionConfig } from "@/lib/config";
import { maskReveal, slowOrbit } from "@/lib/motion";

/**
 * Final CTA Section v2.0
 * Reference: layout.md §5.9
 * 
 * Fullscreen frame.
 * One sentence.
 * Two buttons.
 * Subtle animated geometry behind.
 */

export function FinalCtaSection() {
    return (
        <section className="section relative min-h-screen flex items-center">
            {/* Section header */}
            <div className="absolute top-0 left-0 right-0 section-header container">
                <span className="section-number">09</span>
                <span className="text-label text-text-muted">JOIN</span>
            </div>

            {/* Background geometry */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <motion.svg
                    viewBox="0 0 400 400"
                    className="w-[600px] h-[600px] opacity-10"
                    variants={slowOrbit}
                    animate="animate"
                >
                    <circle
                        cx="200"
                        cy="200"
                        r="150"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        fill="none"
                        className="text-stroke-primary"
                    />
                    <circle
                        cx="200"
                        cy="200"
                        r="100"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        fill="none"
                        className="text-stroke-primary"
                    />
                    <line
                        x1="200"
                        y1="50"
                        x2="200"
                        y2="350"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-stroke-primary"
                    />
                    <line
                        x1="50"
                        y1="200"
                        x2="350"
                        y2="200"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-stroke-primary"
                    />
                </motion.svg>
            </div>

            {/* Content */}
            <div className="container relative z-10">
                <motion.div
                    className="max-w-3xl mx-auto text-center"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-20%" }}
                >
                    {/* One sentence */}
                    <motion.h2
                        className="text-hero"
                        variants={maskReveal}
                    >
                        Stop waiting.
                        <br />
                        <span className="text-accent">Build it.</span>
                    </motion.h2>

                    {/* Two buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button size="lg">
                            Register for ₹{competitionConfig.entryFee}
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Button variant="secondary" size="lg">
                            Read the Rules
                        </Button>
                    </motion.div>

                    {/* Trust line */}
                    <motion.p
                        className="text-label text-text-muted mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        Organized by HYRUP • {competitionConfig.prizePoolFormatted} Prize Pool
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
