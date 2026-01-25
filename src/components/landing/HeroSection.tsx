"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { maskReveal } from "@/lib/motion";
import { InteractiveOrbit } from "./InteractiveOrbit"; // NEW IMPORT

/**
 * Hero Section v2.1
 * - Replaced WireframeGeometry with InteractiveOrbit
 * - Removed CountdownTimer (moved to separate bar)
 */

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const contentOpacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[200vh]"
        >
            {/* Sticky container */}
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                {/* Background grid */}
                <div className="absolute inset-0 grid-rails opacity-50" />

                {/* Content */}
                <div className="container relative z-10 h-full flex items-center">
                    <div className="grid lg:grid-cols-2 gap-8 items-center w-full">

                        {/* Left column - Manifesto */}
                        <motion.div
                            className="flex flex-col gap-6"
                            style={{ opacity: contentOpacity, y: contentY }}
                        >
                            {/* Section label */}
                            <motion.div
                                className="flex items-center gap-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="text-label text-accent">01</span>
                                <div className="w-12 h-px bg-stroke-primary" />
                                <span className="text-label text-text-muted">THE CALL</span>
                            </motion.div>

                            {/* Headline */}
                            <div className="overflow-hidden">
                                <motion.h1
                                    className="text-hero leading-[0.95]"
                                    variants={maskReveal}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <span className="block">Students.</span>
                                    <span className="block text-accent">Fixing</span>
                                    <span className="block">What&apos;s Broken.</span>
                                </motion.h1>
                            </div>

                            {/* Supporting line */}
                            <motion.p
                                className="text-manifesto text-text-secondary max-w-md leading-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                India&apos;s student-powered innovation challenge.
                                Real problems. Real fixes. Real impact.
                            </motion.p>

                            {/* CTA Cluster - NOW CLOSER TO TEXT without Timer pushing it down */}
                            <motion.div
                                className="flex flex-wrap gap-4 mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Button size="lg">
                                    Join the Movement
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                                <Button variant="secondary" size="lg">
                                    How It Works
                                </Button>
                            </motion.div>

                            {/* Removed CountdownTimer from here */}
                        </motion.div>

                        {/* Right column - Interactive Geometry */}
                        <motion.div
                            className="relative h-[40vh] max-h-[400px] hidden lg:flex items-center justify-center pointer-events-auto"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            <InteractiveOrbit />
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <span className="text-label text-text-muted">Scroll</span>
                    <motion.div
                        className="w-px h-8 bg-stroke-primary"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
