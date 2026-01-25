"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    Heart,
    Scale,
    Leaf,
    GraduationCap,
    Wheat,
    Accessibility,
    Zap,
    Car,
    Landmark,
    Shield,
} from "lucide-react";
import { RevealHeading } from "./animations";

const domains = [
    { id: "health", label: "Healthcare", icon: Heart, num: "01" },
    { id: "law", label: "Law & Justice", icon: Scale, num: "02" },
    { id: "climate", label: "Climate", icon: Leaf, num: "03" },
    { id: "education", label: "Education", icon: GraduationCap, num: "04" },
    { id: "agri", label: "Agriculture", icon: Wheat, num: "05" },
    { id: "access", label: "Accessibility", icon: Accessibility, num: "06" },
    { id: "energy", label: "Energy", icon: Zap, num: "07" },
    { id: "mobility", label: "Mobility", icon: Car, num: "08" },
    { id: "civic", label: "Civic Tech", icon: Landmark, num: "09" },
    { id: "safety", label: "Public Safety", icon: Shield, num: "10" },
];

/**
 * BentoGrid (Noir Redesign)
 * Style: Minimalist Interface, Dark Cards, Negative Space
 * Reference: User Image 0 & 2
 */
export function BentoGrid() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <section ref={ref} className="relative py-32 bg-[#050505]">
            <div className="container">
                {/* Header with Reveal Animation */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[#FF4D00] font-mono text-sm tracking-widest">
                            06
                        </span>
                        <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                            / INTERFACE
                        </span>
                    </div>

                    {/* The requested 'Reveal' Heading */}
                    <div className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tighter uppercase">
                        <div className="overflow-hidden">
                            <RevealHeading delay={0.2}>
                                Interface
                            </RevealHeading>
                        </div>
                        <div className="overflow-hidden">
                            <RevealHeading delay={0.4}>
                                Minimalism
                            </RevealHeading>
                        </div>
                    </div>

                    <p className="mt-8 text-white/40 max-w-xl font-mono text-sm">
                        Reduce until only the essential remains. Every domain represents a critical system failure waiting for a patch.
                    </p>
                </div>

                {/* Minimalist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {domains.map((domain, index) => {
                        const Icon = domain.icon;
                        return (
                            <motion.div
                                key={domain.id}
                                className="group relative aspect-square bg-[#080808] border border-white/5 hover:border-white/10 transition-colors duration-500 overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                {/* Top Left Icon */}
                                <div className="absolute top-8 left-8">
                                    <Icon
                                        className="w-6 h-6 text-white/40 group-hover:text-[#FF4D00] transition-colors duration-500"
                                        strokeWidth={1}
                                    />
                                </div>

                                {/* Top Right Number */}
                                <div className="absolute top-8 right-8 font-mono text-xs text-white/20">
                                    {domain.num}
                                </div>

                                {/* Bottom Left Label */}
                                <div className="absolute bottom-8 left-8">
                                    <span className="text-white/60 group-hover:text-white transition-colors duration-500 text-sm font-medium tracking-wide">
                                        {domain.label}
                                    </span>
                                </div>

                                {/* Subtle Hover Glow */}
                                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
