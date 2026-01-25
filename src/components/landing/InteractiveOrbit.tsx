"use client";

import { useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

/**
 * Interactive Orbit Geometry v2.0
 * 
 * A 3D-like orbital system that responds to cursor movement.
 * Replaces the static SVG wireframe.
 * 
 * - Central core: Pulse effect
 * - Inner rings: Fast rotation, gyroscope-like
 * - Outer rings: Slow float
 * - Interactive: Tilts based on mouse position
 */

export function InteractiveOrbit() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse interaction state
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for tilt
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 100, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 100, damping: 30 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const width = rect.width;
            const height = rect.height;
            const x = (e.clientX - rect.left) / width - 0.5;
            const y = (e.clientY - rect.top) / height - 0.5;
            mouseX.set(x);
            mouseY.set(y);
        }
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-[400px] flex items-center justify-center perspective-[1000px] cursor-crosshair group"
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-[300px] h-[300px]"
            >
                {/* Core - Pulsing Sphere */}
                <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 bg-accent/30 rounded-full blur-xl"
                        style={{ filter: "drop-shadow(0 0 20px var(--accent))" }}
                    />
                    <div className="w-12 h-12 bg-accent/20 rounded-full border border-accent relative z-10" />
                </div>

                {/* Ring 1 - Vertical Gyro */}
                <motion.div
                    animate={{ rotateX: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-stroke-primary/50"
                    style={{ rotateY: 45 }}
                />

                {/* Ring 2 - Horizontal Gyro */}
                <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-stroke-primary/50"
                    style={{ rotateX: 45 }}
                />

                {/* Ring 3 - Outer Orbit (Dashed) */}
                <motion.div
                    animate={{ rotateZ: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-40px] rounded-full border border-dashed border-stroke-primary/30"
                />

                {/* Satellite Node */}
                <motion.div
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-20px]"
                >
                    <div className="w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_var(--accent)] absolute top-0 left-1/2 -translate-x-1/2" />
                </motion.div>

                {/* Interactive Grid Plane on Hover */}
                <motion.div
                    className="absolute inset-[-50%] border border-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ transform: "translateZ(-50px)" }}
                >
                    <div className="w-full h-full grid grid-cols-4 grid-rows-4">
                        {[...Array(16)].map((_, i) => (
                            <div key={i} className="border border-accent/10" />
                        ))}
                    </div>
                </motion.div>

            </motion.div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent opacity-50" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent opacity-50" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-accent opacity-50" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent opacity-50" />
        </div>
    );
}
