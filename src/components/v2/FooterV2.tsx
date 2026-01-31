"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = {
    manifesto: [
        { label: "What is FixForward", href: "#" },
        { label: "How It Works", href: "#" },
        { label: "Timeline", href: "#" },
    ],
    rules: [
        { label: "Competition Rules", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Judging Criteria", href: "#" },
    ],
    legal: [
        { label: "Terms & Conditions", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Refund Policy", href: "#" },
    ],
    hyrup: [
        { label: "About HYRUP", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
    ],
};

const socials = [
    { icon: "𝕏", href: "#", label: "Twitter" },
    { icon: "in", href: "#", label: "LinkedIn" },
    { icon: "IG", href: "#", label: "Instagram" },
];

/**
 * FooterV2 - Animated footer that overlays on scroll
 * - Orange theme with large "HYRUP" text
 * - Animated looping text
 * - Slides over last section on scroll
 */
export function FooterV2() {
    const containerRef = useRef<HTMLElement>(null);
    const isInView = useInView(containerRef, { once: false, margin: "-20%" });

    return (
        <footer
            ref={containerRef}
            className="relative z-20 bg-[#FF4D00] text-black h-screen flex flex-col justify-between pt-20 pb-0 rounded-t-[3rem] -mt-10 shadow-[0_-50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
            {/* Main content */}
            <div className="container relative z-10 flex-1 flex flex-col">
                {/* Top section: Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-auto">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <img
                                src="/hyrup_logo.svg"
                                alt="HYRUP"
                                className="w-8 h-8"
                            />
                            <div>
                                <span className="text-2xl font-display font-bold text-black block">
                                    FixForward
                                </span>
                                <span className="text-xs font-mono text-black/60 tracking-widest uppercase">
                                    BY HYRUP
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-black/70 mb-6">
                            India&apos;s student-powered innovation movement.
                        </p>

                        {/* Social links */}
                        <div className="flex gap-3">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 border border-black/20 rounded-full flex items-center justify-center text-sm font-mono hover:bg-black hover:text-[#FF4D00] transition-colors"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <LinkColumn title="MANIFESTO" links={footerLinks.manifesto} />
                    <LinkColumn title="RULES" links={footerLinks.rules} />
                    <LinkColumn title="LEGAL" links={footerLinks.legal} />
                    <LinkColumn title="HYRUP" links={footerLinks.hyrup} />
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 mb-8 z-30 relative mix-blend-difference">
                    <p className="text-sm text-white/90 font-medium">
                        &ldquo;Built for students who refuse broken systems.&rdquo;
                    </p>
                    <div className="flex items-center gap-6 text-sm text-white/90 font-medium">
                        <Link href="/admin" className="hover:text-white transition-colors" suppressHydrationWarning>
                            Admin
                        </Link>
                        <span>© 2026 HYRUP</span>
                    </div>
                </div>
            </div>

            {/* Large Static HYRUP text - Clipped/Cut-out effect */}
            <div className="absolute bottom-[-5vw] left-0 right-0 flex justify-center pointer-events-none select-none">
                <span className="text-[35vw] font-display font-black text-black leading-[0.7] tracking-tighter">
                    HYRUP
                </span>
            </div>
        </footer>
    );
}

function LinkColumn({
    title,
    links,
}: {
    title: string;
    links: { label: string; href: string }[];
}) {
    return (
        <div>
            <h4 className="text-xs font-mono tracking-widest text-black/50 mb-4">
                {title}
            </h4>
            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="text-sm text-black/80 hover:text-black transition-colors"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/**
 * Infinite scrolling marquee with "HYRUP" text
 */
function AnimatedMarquee() {
    return (
        <div className="flex overflow-hidden">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: ["0%", "-50%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {[...Array(4)].map((_, i) => (
                    <span
                        key={i}
                        className="text-[120px] md:text-[180px] lg:text-[220px] font-display font-black text-black/10 leading-none tracking-tighter mx-8"
                    >
                        HYRUP
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
