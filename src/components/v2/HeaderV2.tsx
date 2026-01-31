"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CountdownTimer } from "../layout/CountdownTimer";

/**
 * HeaderV2 - Minimal header emphasizing HYRUP
 * Inspiration: Large brand name, step indicators, orange accent
 */
export function HeaderV2() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-sm border-b border-white/5">
            <div className="container flex items-center justify-between h-16">
                {/* Logo + HYRUP emphasis */}
                <Link href="/" className="flex items-center gap-3">
                    <img
                        src="/hyrup_logo.svg"
                        alt="HYRUP"
                        className="w-8 h-8"
                    />
                    <span className="text-2xl font-display font-bold text-white tracking-tight">
                        FixForward
                    </span>
                    <span className="text-xs font-mono text-[#FF4D00] tracking-widest uppercase mt-1">
                        BY HYRUP
                    </span>
                </Link>

                {/* Registration Timer */}
                <CountdownTimer className="hidden lg:flex" />

                {/* CTA button - Smaller on mobile */}
                <Link
                    href="/register"
                    className="group px-4 md:px-6 py-2 md:py-2.5 bg-[#FF4D00] text-black text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                >
                    <span className="md:hidden">Join</span>
                    <span className="hidden md:inline">Join the Movement</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </header>
    );
}
