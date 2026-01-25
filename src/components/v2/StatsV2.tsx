"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SplitFlapNumber } from "./animations";

const stats = [
    { value: "3,00,000", prefix: "₹", suffix: "+", label: "Prize Pool" },
    { value: "5,000", suffix: "+", label: "Students" },
    { value: "300", suffix: "+", label: "Schools" },
    { value: "50", suffix: "+", label: "Mentors" },
];

/**
 * StatsV2 - Large stats with split-flap animation
 * - Orange inverted theme block
 * - Large numbers with animation
 */
export function StatsV2() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-20%" });

    return (
        <section ref={ref} className="relative py-32 bg-[#050505]">
            <div className="container">
                {/* Section header */}
                <div className="flex items-center gap-4 mb-12">
                    <span className="text-[#FF4D00] font-mono text-sm tracking-widest">
                        08
                    </span>
                    <span className="text-white/50 font-mono text-xs tracking-widest uppercase">
                        THE SCALE
                    </span>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">

                    {/* Large Card - Prize Pool */}
                    <motion.div
                        className="lg:col-span-7 h-full flex flex-col justify-between p-8 md:p-12 border border-white/10 bg-white/5 relative overflow-hidden group hover:border-[#FF4D00]/50 transition-colors duration-500"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="space-y-4 relative z-10">
                            <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                                Total Prize Pool
                            </span>
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white leading-tight">
                                Fueling the next generation of builders.
                            </h3>
                        </div>

                        <div className="relative z-10 mt-auto pt-12">
                            <span className="text-[#FF4D00] text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-none tracking-tighter">
                                ₹3L
                                <span className="text-4xl align-top opacity-50">+</span>
                            </span>
                            <p className="text-white/40 font-mono text-sm mt-4">
                                Cash prizes, grants, and funding opportunities.
                            </p>
                        </div>

                        <div className="absolute inset-0 bg-linear-to-br from-transparent to-[#FF4D00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>

                    {/* Right Column - Stacked Stats */}
                    <div className="lg:col-span-5 grid grid-rows-3 gap-6 h-full">

                        {/* Students */}
                        <motion.div
                            className="row-span-1 border border-white/10 bg-white/5 p-8 flex items-center justify-between group hover:border-[#FF4D00]/50 transition-colors duration-500"
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <div className="flex flex-col">
                                <span className="text-white/40 font-mono text-xs tracking-widest uppercase mb-2">
                                    Impact
                                </span>
                                <span className="text-white text-4xl font-display font-bold">
                                    Students
                                </span>
                            </div>
                            <div className="text-[#FF4D00] text-5xl font-display font-bold">
                                5k+
                            </div>
                        </motion.div>

                        {/* Schools */}
                        <motion.div
                            className="row-span-1 border border-white/10 bg-white/5 p-8 flex items-center justify-between group hover:border-[#FF4D00]/50 transition-colors duration-500"
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex flex-col">
                                <span className="text-white/40 font-mono text-xs tracking-widest uppercase mb-2">
                                    Reach
                                </span>
                                <span className="text-white text-4xl font-display font-bold">
                                    Schools
                                </span>
                            </div>
                            <div className="text-[#FF4D00] text-5xl font-display font-bold">
                                300+
                            </div>
                        </motion.div>

                        {/* Mentors */}
                        <motion.div
                            className="row-span-1 border border-white/10 bg-white/5 p-8 flex items-center justify-between group hover:border-[#FF4D00]/50 transition-colors duration-500"
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="flex flex-col">
                                <span className="text-white/40 font-mono text-xs tracking-widest uppercase mb-2">
                                    Guidance
                                </span>
                                <span className="text-white text-4xl font-display font-bold">
                                    Mentors
                                </span>
                            </div>
                            <div className="text-[#FF4D00] text-5xl font-display font-bold">
                                50+
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
