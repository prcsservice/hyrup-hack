"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatedIndiaMap } from "./AnimatedIndiaMap";
import { StateNewsQuote } from "./StateNewsQuote";

/**
 * HeroV2 - Redesigned hero with grid layout
 * Layout:
 * - Top-left: Main headline
 * - Top-right: State news quote card
 * - Center: Animated network map
 * - Bottom-left: Description
 * - Bottom-right: Secondary headline + CTAs
 */
export function HeroV2() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeState, setActiveState] = useState<{ id: string; index: number }>({
        id: "srinagar",
        index: 0
    });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    // Callback to receive state changes from the map
    const handleStateChange = useCallback((stateId: string, index: number) => {
        setActiveState({ id: stateId, index });
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[200vh] bg-[#050505]"
        >
            {/* Sticky container - positioned below fixed navbar */}
            <div className="sticky top-16 h-[calc(100vh-64px)] overflow-hidden">
                {/* Grid background */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Corner markers */}
                <div className="absolute top-20 left-8 text-white/20 text-xl">+</div>
                <div className="absolute top-20 right-8 text-white/20 text-xl">+</div>
                <div className="absolute bottom-6 left-8 text-white/20 text-xl">+</div>
                <div className="absolute bottom-6 right-8 text-white/20 text-xl">+</div>

                {/* Main content grid */}
                <motion.div
                    className="container h-full pt-5 pb-6 flex flex-col justify-between"
                    style={{ opacity, scale }}
                >
                    {/* TOP ROW: Headline left, News Quote right */}
                    <div className="flex justify-between items-start relative z-10">
                        {/* Top left: Main headline */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            {/* HYRUP Badge */}
                            <span className="inline-flex items-center gap-2 mb-6 text-[#FF4D00] font-mono text-xs tracking-widest uppercase">
                                <span className="w-2 h-2 bg-[#FF4D00] animate-pulse" />
                                HYRUP PRESENTS
                            </span>

                            {/* Main headline */}
                            <h1 className="max-w-xl">
                                <span className="block text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                                    Students. Fixing.
                                </span>
                                <span className="block text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#FF4D00] leading-tight italic">
                                    What&apos;s Broken.
                                </span>
                            </h1>
                        </motion.div>

                        {/* Top right: State News Quote */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="hidden lg:block"
                        >
                            <StateNewsQuote
                                stateId={activeState.id}
                                stateIndex={activeState.index}
                            />
                        </motion.div>
                    </div>

                    {/* CENTER: Animated India map in background */}
                    <AnimatedIndiaMap onStateChange={handleStateChange} />

                    {/* BOTTOM ROW: Description left, CTA right */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
                        {/* Bottom left: Description - Hidden on mobile, shown below news card */}
                        <motion.div
                            className="max-w-sm hidden md:block"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <p className="text-sm text-white/50 leading-relaxed">
                                India&apos;s systems are cracking. Healthcare fails the poor.
                                Courts delay justice. Schools teach tests, not thinking.
                                We&apos;re building the fix.
                            </p>

                            {/* Scroll indicator */}
                            <div className="flex items-center gap-4 mt-6">
                                <span className="text-white/30 font-mono text-xs tracking-widest uppercase">
                                    Scroll
                                </span>
                                <motion.div
                                    className="w-px h-6 bg-[#FF4D00]"
                                    animate={{ scaleY: [1, 1.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>

                        {/* Bottom right: Secondary headline + CTAs */}
                        <motion.div
                            className="text-right"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            {/* Mobile News Card - Right aligned */}
                            <div className="lg:hidden mb-4 ml-auto max-w-[280px]">
                                <StateNewsQuote
                                    stateId={activeState.id}
                                    stateIndex={activeState.index}
                                />
                            </div>
                            {/* Mobile description - full width, right aligned text */}
                            <p className="lg:hidden text-sm text-white/50 leading-relaxed text-right mb-6">
                                India&apos;s systems are cracking. Healthcare fails the poor.
                                Courts delay justice. Schools teach tests, not thinking.
                                We&apos;re building the fix.
                            </p>

                            <h2 className="mb-6">
                                <span className="block text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-white">
                                    Where Problems
                                </span>
                                <span className="block text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-white/50 italic">
                                    Meet Solutions
                                </span>
                            </h2>

                            {/* CTA buttons */}
                            <div className="flex gap-3 justify-end">
                                <a
                                    href="/register"
                                    className="group px-6 py-3 bg-[#FF4D00] text-black text-sm font-semibold flex items-center gap-2 hover:gap-4 transition-all duration-300 whitespace-nowrap"
                                >
                                    Get Started Now
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={() => {
                                        window.scrollTo({
                                            top: window.innerHeight * 1.8,
                                            behavior: 'smooth'
                                        });
                                    }}
                                    className="px-6 py-3 border border-white/20 text-white text-sm font-medium hover:border-white/50 transition-colors whitespace-nowrap"
                                >
                                    Learn more
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

