"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { competitionConfig } from "@/lib/config";

/**
 * PrizeV2 - Prize section with large animated number
 */
export function PrizeV2() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-20%" });

    return (
        <section
            ref={ref}
            className="relative py-32 min-h-[70vh] flex items-center bg-[#050505]"
        >
            {/* Background accent */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[300px] md:text-[400px] font-display font-bold text-[#FF4D00]/5 select-none">
                    ₹
                </span>
            </div>

            <div className="container relative z-10">
                {/* Section header */}
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-[#FF4D00] font-mono text-sm tracking-widest">
                        05
                    </span>
                    <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                        PRIZE
                    </span>
                </div>

                {/* Large figure */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-6xl md:text-8xl lg:text-[140px] font-display font-bold text-[#FF4D00]">
                        {competitionConfig.prizePoolFormatted}
                    </span>
                </motion.div>

                {/* Supporting line */}
                <motion.p
                    className="text-center text-xl md:text-2xl text-white/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                >
                    in cash, credits, and opportunity
                </motion.p>

                {/* Additional info */}
                <motion.div
                    className="flex justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 }}
                >
                    <div className="text-center">
                        <span className="text-white/40 font-mono text-xs tracking-widest uppercase block mb-2">
                            Entry
                        </span>
                        <span className="text-2xl font-mono text-white">
                            ₹{competitionConfig.entryFee}
                        </span>
                    </div>
                    <div className="text-center">
                        <span className="text-white/40 font-mono text-xs tracking-widest uppercase block mb-2">
                            Team Size
                        </span>
                        <span className="text-2xl font-mono text-white">
                            1–{competitionConfig.maxTeamSize}
                        </span>
                    </div>
                    <div className="text-center">
                        <span className="text-white/40 font-mono text-xs tracking-widest uppercase block mb-2">
                            Domains
                        </span>
                        <span className="text-2xl font-mono text-white">10+</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
