"use client";

import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { competitionConfig } from "@/lib/config";

/**
 * Registration Timer Bar (Separate Section)
 * 
 * Moved out of Hero content to declutter.
 * Placed immediately below the sticky hero.
 */
export function RegistrationTimerBar() {
    return (
        <section className="border-t border-b border-stroke-divider bg-bg-secondary py-12">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Label */}
                <div className="text-center md:text-left">
                    <span className="text-label text-accent block mb-2">URGENCY</span>
                    <h3 className="text-2xl font-display font-semibold">Registration closes in</h3>
                </div>

                {/* Timer */}
                <CountdownTimer
                    deadline={competitionConfig.deadlines.registrationClose}
                    className="scale-90 md:scale-100"
                />

                {/* Extra Info */}
                <div className="hidden md:block text-right">
                    <span className="text-label text-text-muted block mb-2">ENTRY FEE</span>
                    <span className="text-2xl font-mono">₹{competitionConfig.entryFee}</span>
                </div>

            </div>
        </section>
    );
}
