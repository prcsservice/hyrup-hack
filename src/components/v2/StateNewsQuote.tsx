"use client";

import { motion, AnimatePresence } from "framer-motion";
import { STATE_NEWS, NODES } from "./AnimatedIndiaMap";

interface StateNewsQuoteProps {
    stateId: string;
    stateIndex: number;
}

/**
 * StateNewsQuote - Shows issue news for the currently highlighted state
 * Styled like a tech terminal/card with monospace fonts
 */
export function StateNewsQuote({ stateId, stateIndex }: StateNewsQuoteProps) {
    const news = STATE_NEWS[stateId];
    const node = NODES.find(n => n.id === stateId);

    if (!news || !node) return null;

    const formattedIndex = String(stateIndex + 1).padStart(2, '0');
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={stateId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-[280px] h-[180px] bg-[#0a0a0a] border border-white/20 p-5"
                style={{
                    // Corner notch effect
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))"
                }}
            >
                {/* Top corner accent */}
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#FF4D00]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#FF4D00]" />

                {/* Header: Index & Date */}
                <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-white/40 tracking-wider">
                        NO. {formattedIndex}
                    </span>
                    <span className="font-mono text-xs text-white/40">
                        {dateStr}
                    </span>
                </div>

                {/* Category Badge */}
                <div className="mb-2">
                    <span className="inline-block px-2 py-0.5 bg-[#FF4D00]/20 text-[#FF4D00] text-[10px] font-mono tracking-wider">
                        {news.category}
                    </span>
                </div>

                {/* Headline */}
                <h3 className="text-white text-lg font-bold leading-tight mb-3 line-clamp-2">
                    {news.headline}
                </h3>

                {/* Issue Description */}
                <p className="text-white/50 text-xs font-mono leading-relaxed line-clamp-3">
                    {news.issue}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-5 left-5 right-5 h-px bg-linear-to-r from-[#FF4D00]/50 via-white/10 to-transparent" />
            </motion.div>
        </AnimatePresence>
    );
}
