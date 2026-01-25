"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { staggerItem } from "@/lib/motion";

/**
 * Community Section v2.0
 * Reference: layout.md §5.8
 * 
 * Massive numbers only.
 * 5,000+ Students / 300+ Colleges / 50+ Cities
 * Ticker rail underneath.
 */

const stats = [
    { value: "5,000+", label: "Students" },
    { value: "300+", label: "Colleges" },
    { value: "50+", label: "Cities" },
];

export function CommunitySection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const tickerX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    return (
        <section ref={containerRef} className="section relative py-32">
            {/* Section header */}
            <div className="section-header container">
                <span className="section-number">08</span>
                <span className="text-label text-text-muted">SCALE</span>
            </div>

            <div className="container section-content">
                {/* Massive numbers */}
                <div className="flex flex-wrap justify-center gap-16 lg:gap-24">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <span className="text-hero text-accent font-mono block">
                                {stat.value}
                            </span>
                            <span className="text-label text-text-muted mt-4 block">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Ticker rail */}
            <div className="mt-24 overflow-hidden border-t border-b border-stroke-divider py-6">
                <motion.div
                    className="flex gap-16 whitespace-nowrap"
                    style={{ x: tickerX }}
                >
                    {[...Array(3)].map((_, setIndex) => (
                        <div key={setIndex} className="flex gap-16">
                            {[
                                "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
                                "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
                                "Bhopal", "Chandigarh", "Kochi", "Indore", "Nagpur",
                            ].map((city) => (
                                <span
                                    key={`${setIndex}-${city}`}
                                    className="text-text-muted text-sm font-mono"
                                >
                                    {city}
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
