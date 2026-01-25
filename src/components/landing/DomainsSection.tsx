"use client";

import { motion } from "framer-motion";
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
import { domains } from "@/lib/config";
import { staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Domains Section v2.0
 * Reference: layout.md §5.6
 * 
 * Icon matrix.
 * Wireframe symbols only.
 * Hover expands tile border.
 * No cards. No gradients.
 */

const iconMap: Record<string, React.ElementType> = {
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
};

export function DomainsSection() {
    return (
        <section className="section relative py-32">
            {/* Section header */}
            <div className="section-header container">
                <span className="section-number">06</span>
                <span className="text-label text-text-muted">DOMAINS</span>
            </div>

            <div className="container section-content">
                {/* Title */}
                <motion.h2
                    className="text-section"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Every field. One mission.
                </motion.h2>

                <p className="text-text-secondary mt-4 max-w-xl">
                    If it affects real people — it belongs here.
                </p>

                {/* Icon matrix */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-5 gap-px mt-16 bg-stroke-divider"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {domains.map((domain) => {
                        const Icon = iconMap[domain.icon] || Heart;
                        return (
                            <motion.div
                                key={domain.id}
                                className="group bg-bg-primary p-8 flex flex-col items-center text-center hover:bg-bg-secondary transition-colors cursor-pointer"
                                variants={staggerItem}
                            >
                                <Icon
                                    className="w-10 h-10 text-text-muted group-hover:text-accent transition-colors"
                                    strokeWidth={1}
                                />
                                <span className="text-sm font-medium mt-4 group-hover:text-accent transition-colors">
                                    {domain.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CTA */}
                <motion.p
                    className="text-center text-text-secondary mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-accent">Your field belongs here.</span>
                </motion.p>
            </div>
        </section>
    );
}
