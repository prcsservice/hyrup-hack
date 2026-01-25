"use client";

import { motion } from "framer-motion";
import { headlineWipe, contentSnap } from "@/lib/motion";

/**
 * Statement Section v2.0
 * Reference: layout.md §5.2
 * 
 * Single sentence. Huge type. Centered in framed container.
 * Minimal. No secondary UI.
 */

export function StatementSection() {
    return (
        <section className="section relative min-h-screen flex items-center">
            {/* Section header */}
            <div className="absolute top-0 left-0 right-0 section-header container">
                <span className="section-number">02</span>
                <span className="text-label text-text-muted">THE STATEMENT</span>
            </div>

            {/* Content */}
            <div className="container">
                <motion.div
                    className="max-w-5xl mx-auto text-center py-24"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-20%" }}
                >
                    <motion.p
                        className="text-section leading-tight"
                        variants={headlineWipe}
                    >
                        This is not a hackathon.
                    </motion.p>
                    <motion.p
                        className="text-hero text-accent mt-4"
                        variants={headlineWipe}
                    >
                        This is a call to action.
                    </motion.p>
                </motion.div>
            </div>

            {/* Bottom divider */}
            <div className="absolute bottom-0 left-0 right-0 container">
                <div className="divider" />
            </div>
        </section>
    );
}
