"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Lightbulb, Hammer, Mic, Rocket } from "lucide-react";
import { staggerContainer, staggerItem, dividerDraw } from "@/lib/motion";

/**
 * Process Section v2.0
 * Reference: layout.md §5.3, animation.md §7
 * 
 * Pinned horizontal chapter.
 * Steps: Find → Design → Build → Pitch → Deploy
 * Bottom timeline rail.
 * One step active per viewport.
 * Geometry morphs per step.
 */

const steps = [
    { id: "find", label: "Find", description: "Identify real problems in your community", icon: Search },
    { id: "design", label: "Design", description: "Create your solution concept", icon: Lightbulb },
    { id: "build", label: "Build", description: "Develop a working prototype", icon: Hammer },
    { id: "pitch", label: "Pitch", description: "Present to national jury", icon: Mic },
    { id: "deploy", label: "Deploy", description: "Launch and scale impact", icon: Rocket },
];

export function HowItWorksSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const railWidth = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="section relative py-32">
            {/* Section header */}
            <div className="section-header container">
                <span className="section-number">03</span>
                <span className="text-label text-text-muted">THE PROCESS</span>
            </div>

            <div className="container section-content">
                {/* Title */}
                <motion.h2
                    className="text-section max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Find the problem.
                    <br />
                    <span className="text-accent">Build the fix.</span>
                    <br />
                    Pitch the nation.
                </motion.h2>

                {/* Steps grid */}
                <motion.div
                    className="grid md:grid-cols-5 gap-1 mt-16"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            className="group relative p-6 border border-stroke-divider hover:border-stroke-primary transition-colors"
                            variants={staggerItem}
                        >
                            {/* Step number */}
                            <span className="text-label text-accent">0{index + 1}</span>

                            {/* Icon */}
                            <step.icon className="w-8 h-8 mt-4 text-text-muted group-hover:text-accent transition-colors" strokeWidth={1} />

                            {/* Label */}
                            <h3 className="text-xl font-semibold mt-4">{step.label}</h3>

                            {/* Description */}
                            <p className="text-sm text-text-secondary mt-2">{step.description}</p>

                            {/* Arrow connector */}
                            {index < steps.length - 1 && (
                                <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-text-muted hidden md:block z-10">
                                    →
                                </span>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom timeline rail */}
                <div className="mt-16 relative">
                    <div className="h-px bg-stroke-divider" />
                    <motion.div
                        className="absolute top-0 left-0 h-px bg-accent"
                        style={{ width: railWidth }}
                    />

                    {/* Tick marks */}
                    <div className="flex justify-between mt-4">
                        {steps.map((step, i) => (
                            <span key={step.id} className="text-label text-text-muted">
                                0{i + 1}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
