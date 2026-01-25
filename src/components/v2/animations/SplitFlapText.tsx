"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface SplitFlapTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    charDuration?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789₹,+.";

/**
 * SplitFlapText - Airport departure board style text animation
 * - Characters cycle through random letters before landing on final
 * - Each character animates independently with stagger
 */
export function SplitFlapText({
    text,
    className = "",
    delay = 0,
    duration = 1.5,
    charDuration = 0.08,
}: SplitFlapTextProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const [displayText, setDisplayText] = useState(
        text.split("").map(() => " ")
    );
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (!isInView) return;

        const targetChars = text.toUpperCase().split("");
        const delays = targetChars.map(
            (_, i) => delay * 1000 + i * 50 + Math.random() * 100
        );

        const intervals: NodeJS.Timeout[] = [];
        const timeouts: NodeJS.Timeout[] = [];

        targetChars.forEach((targetChar, i) => {
            if (targetChar === " ") {
                setDisplayText((prev) => {
                    const next = [...prev];
                    next[i] = " ";
                    return next;
                });
                return;
            }

            // Start cycling after delay
            timeouts.push(
                setTimeout(() => {
                    let cycles = 0;
                    const maxCycles = Math.floor(duration / charDuration) + i * 2;

                    intervals.push(
                        setInterval(() => {
                            if (cycles >= maxCycles) {
                                // Land on final character
                                setDisplayText((prev) => {
                                    const next = [...prev];
                                    next[i] = targetChar;
                                    return next;
                                });
                                clearInterval(intervals[i]);

                                // Check if all done
                                if (i === targetChars.length - 1) {
                                    setCompleted(true);
                                }
                            } else {
                                // Random character
                                const randomChar =
                                    CHARS[Math.floor(Math.random() * CHARS.length)];
                                setDisplayText((prev) => {
                                    const next = [...prev];
                                    next[i] = randomChar;
                                    return next;
                                });
                                cycles++;
                            }
                        }, charDuration * 1000)
                    );
                }, delays[i])
            );
        });

        return () => {
            intervals.forEach(clearInterval);
            timeouts.forEach(clearTimeout);
        };
    }, [isInView, text, delay, duration, charDuration]);

    return (
        <span
            ref={ref}
            className={`font-mono inline-flex ${className}`}
            aria-label={text}
        >
            {displayText.map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block min-w-[0.6em] text-center"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: delay + i * 0.02 }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    );
}

/**
 * SplitFlapNumber - Optimized for numeric displays
 */
export function SplitFlapNumber({
    value,
    prefix = "",
    suffix = "",
    className = "",
    delay = 0,
}: {
    value: string | number;
    prefix?: string;
    suffix?: string;
    className?: string;
    delay?: number;
}) {
    return (
        <span className={className}>
            {prefix && <span className="text-[#FF4D00]">{prefix}</span>}
            <SplitFlapText
                text={String(value)}
                delay={delay}
                charDuration={0.06}
            />
            {suffix && <span className="text-white/60 ml-1">{suffix}</span>}
        </span>
    );
}
