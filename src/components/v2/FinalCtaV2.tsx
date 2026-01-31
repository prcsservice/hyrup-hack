"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { competitionConfig } from "@/lib/config";
import { ArrowRight } from "lucide-react";

/**
 * FinalCtaV2 - Final call to action with HYRUP branding
 */
export function FinalCtaV2() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-20%" });

    return (
        <section
            ref={ref}
            className="sticky bottom-0 h-screen pt-40 flex items-center justify-center -z-10 bg-[#050505] border-t border-white/10 overflow-hidden"
        >
            {/* Background geometric accent */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5"
                    style={{
                        background: `radial-gradient(circle, #FF4D00 0%, transparent 70%)`,
                    }}
                />
            </div>

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main text */}
                    <motion.div
                        className="space-y-4 mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-none">
                            Stop waiting.
                        </h2>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-[#FF4D00] leading-none">
                            Build it.
                        </h2>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        className="flex flex-col items-center gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <button className="group relative px-12 py-5 bg-[#FF4D00] text-black font-bold text-xl flex items-center gap-4 hover:gap-6 transition-all duration-300 overflow-hidden">
                            {/* Hover effect */}
                            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                            <span className="relative">Register Now</span>
                            <ArrowRight className="relative w-6 h-6" />
                        </button>

                        {/* Entry info */}
                        <div className="flex items-center gap-8 text-white/40 font-mono text-sm">
                            <span>
                                Entry: <span className="text-white">Free for Students</span>
                            </span>
                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                            <span>
                                Team Size: <span className="text-white">1-{competitionConfig.maxTeamSize}</span>
                            </span>
                        </div>
                    </motion.div>

                    {/* HYRUP branding */}
                    <motion.div
                        className="mt-24 pt-8 border-t border-white/10"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.6 }}
                    >
                        <p className="text-white/30 font-mono text-sm tracking-widest uppercase">
                            A <span className="text-[#FF4D00]">HYRUP</span> Initiative
                        </p>
                        <p className="text-white/20 text-sm mt-2">
                            Built for students who refuse broken systems.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
