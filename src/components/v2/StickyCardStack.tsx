"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface StickyCard {
    id: string;
    title: string;
    subtitle: string;
    description?: string;
    icon?: ReactNode;
    color?: string;
}

interface StickyCardStackProps {
    cards: StickyCard[];
    sectionNumber?: string;
    sectionLabel?: string;
    sectionTitle?: string;
}

/**
 * StickyCardStack - Cards appear one by one and stick on top of each other
 * - First card appears, sticks
 * - On scroll, second card slides up and sticks ON TOP
 * - After all stacked, entire block scrolls away
 */
export function StickyCardStack({
    cards,
    sectionNumber = "06",
    sectionLabel = "DOMAINS",
    sectionTitle = "Every field. One mission.",
}: StickyCardStackProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Height = base + (card count * scroll distance per card)
    const scrollHeight = cards.length * 50 + 100;

    return (
        <section
            ref={containerRef}
            className="relative bg-[#050505]"
            style={{ height: `${scrollHeight}vh` }}
        >
            {/* Sticky container */}
            <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
                {/* Section header */}
                <div className="container pt-8 pb-4">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[#FF4D00] font-mono text-sm tracking-widest">
                            {sectionNumber}
                        </span>
                        <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                            {sectionLabel}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
                        {sectionTitle}
                    </h2>
                </div>

                {/* Cards container */}
                <div className="flex-1 relative container">
                    {cards.map((card, index) => (
                        <StickyCardItem
                            key={card.id}
                            card={card}
                            index={index}
                            total={cards.length}
                            containerRef={containerRef}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function StickyCardItem({
    card,
    index,
    total,
    containerRef,
}: {
    card: StickyCard;
    index: number;
    total: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Calculate when this card should appear and stick
    const startProgress = index / (total + 1);
    const endProgress = (index + 1) / (total + 1);

    // Card slides up from bottom, then sticks
    const y = useTransform(
        scrollYProgress,
        [startProgress, endProgress],
        ["100%", "0%"]
    );

    const opacity = useTransform(
        scrollYProgress,
        [startProgress, startProgress + 0.05],
        [0, 1]
    );

    // Scale slightly for depth effect
    const scale = useTransform(
        scrollYProgress,
        [startProgress, endProgress],
        [0.95, 1]
    );

    // Z-index increases as cards stack
    const zIndex = index + 1;

    return (
        <motion.div
            className="absolute inset-x-0 top-8"
            style={{
                y,
                opacity,
                scale,
                zIndex,
            }}
        >
            <div
                className="p-8 border border-white/10 bg-[#0A0A0A] hover:border-[#FF4D00]/50 transition-colors duration-300"
                style={{
                    boxShadow: `0 ${index * 2}px ${index * 8}px rgba(0,0,0,0.5)`,
                }}
            >
                {/* Card number */}
                <span
                    className="text-sm font-mono tracking-widest mb-4 block"
                    style={{ color: card.color || "#FF4D00" }}
                >
                    0{index + 1}
                </span>

                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                    {card.title}
                </h3>

                {/* Subtitle */}
                <p className="text-lg text-[#FF4D00]">{card.subtitle}</p>

                {/* Description */}
                {card.description && (
                    <p className="text-white/50 mt-4 max-w-lg">
                        {card.description}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

// Pre-configured domain cards
export const domainCards: StickyCard[] = [
    {
        id: "health",
        title: "Healthcare",
        subtitle: "Heal the healers",
        description: "Access, affordability, mental health, rural care",
    },
    {
        id: "law",
        title: "Law & Justice",
        subtitle: "Justice delayed is justice denied",
        description: "Legal access, awareness, court delays, citizen rights",
    },
    {
        id: "climate",
        title: "Climate",
        subtitle: "The planet can't wait",
        description: "Sustainability, waste, energy, conservation",
    },
    {
        id: "education",
        title: "Education",
        subtitle: "Unlearn to relearn",
        description: "Access, quality, skill gaps, employability",
    },
    {
        id: "civic",
        title: "Civic Tech",
        subtitle: "Government for the people",
        description: "Transparency, participation, public services",
    },
];
