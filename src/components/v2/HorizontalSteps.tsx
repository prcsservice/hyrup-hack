"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, Lightbulb, Hammer, Mic, Rocket } from "lucide-react";

const steps = [
    {
        id: "find",
        number: "01",
        title: "FIND",
        subtitle: "The Problem",
        description: "Identify real problems in your community that affect everyday people.",
        icon: Search,
        color: "#FF4D00",
    },
    {
        id: "design",
        number: "02",
        title: "DESIGN",
        subtitle: "The Solution",
        description: "Create a concept that actually addresses the root cause.",
        icon: Lightbulb,
        color: "#FF6B2C",
    },
    {
        id: "build",
        number: "03",
        title: "BUILD",
        subtitle: "The Prototype",
        description: "Develop a working prototype that proves your idea works.",
        icon: Hammer,
        color: "#FF8A50",
    },
    {
        id: "pitch",
        number: "04",
        title: "PITCH",
        subtitle: "The Nation",
        description: "Present to a national jury of industry experts.",
        icon: Mic,
        color: "#FFA875",
    },
    {
        id: "deploy",
        number: "05",
        title: "DEPLOY",
        subtitle: "The Impact",
        description: "Launch your solution and scale real-world impact.",
        icon: Rocket,
        color: "#FFC599",
    },
];

/**
 * HorizontalSteps - Horizontal scroll section for "How It Works"
 * - Full viewport height sticky section
 * - Scrolling vertically translates content horizontally
 */
export function HorizontalSteps() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Transform vertical scroll to horizontal movement
    const x = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", `-${(steps.length - 1) * 100}%`]
    );

    return (
        <section
            ref={containerRef}
            className="relative bg-[#050505]"
            style={{ height: `${steps.length * 100}vh` }}
        >
            {/* Sticky container */}
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Section header */}
                <div className="absolute top-8 left-0 right-0 z-20 container">
                    <div className="flex items-center gap-4">
                        <span className="text-[#FF4D00] font-mono text-sm tracking-widest">
                            03
                        </span>
                        <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                            THE PROCESS
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-4">
                        <span className="text-white/80">Find the problem.</span>{" "}
                        <span className="text-[#FF4D00]">Build the fix.</span>
                    </h2>
                </div>

                {/* Horizontal scroll content */}
                <motion.div
                    className="flex h-full pt-32"
                    style={{ x }}
                >
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="min-w-full h-full flex items-center justify-center px-8"
                        >
                            <StepCard step={step} index={index} />
                        </div>
                    ))}
                </motion.div>

                {/* Progress bar */}
                <div className="absolute bottom-8 left-0 right-0 container">
                    <div className="h-px bg-white/10 relative">
                        <motion.div
                            className="absolute top-0 left-0 h-px bg-[#FF4D00]"
                            style={{
                                width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                            }}
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        {steps.map((step, i) => (
                            <span
                                key={step.id}
                                className="text-white/40 font-mono text-xs"
                            >
                                {step.number}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function StepCard({
    step,
    index,
}: {
    step: (typeof steps)[0];
    index: number;
}) {
    const Icon = step.icon;

    return (
        <motion.div
            className="relative max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
        >
            {/* Large number background */}
            <span
                className="absolute -top-20 -left-8 text-[200px] font-display font-bold leading-none opacity-5"
                style={{ color: step.color }}
            >
                {step.number}
            </span>

            {/* Icon */}
            <div
                className="w-16 h-16 flex items-center justify-center mb-6"
                style={{ color: step.color }}
            >
                <Icon size={48} strokeWidth={1} />
            </div>

            {/* Title */}
            <div className="flex items-baseline gap-4 mb-4">
                <h3
                    className="text-5xl md:text-7xl font-display font-bold"
                    style={{ color: step.color }}
                >
                    {step.title}
                </h3>
                <span className="text-2xl text-white/60 font-light">
                    {step.subtitle}
                </span>
            </div>

            {/* Description */}
            <p className="text-xl text-white/50 max-w-lg leading-relaxed">
                {step.description}
            </p>

            {/* Arrow to next */}
            {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                    <span className="text-white/20 text-4xl">→</span>
                </div>
            )}
        </motion.div>
    );
}
