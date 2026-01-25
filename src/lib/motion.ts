/**
 * Motion Presets v2.0
 * Reference: animation.md v2.0 — Architectural / Scroll-Driven / Systemic
 * 
 * Keywords: Architectural, Scroll-Driven, Editorial, Wireframe, Pinned,
 *           Structural, Manifesto, System UI, Cinematic, Restrained
 */

import type { Variants, Transition } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// TIMING CONSTANTS — animation.md §2
// ═══════════════════════════════════════════════════════════════════════════

export const DURATIONS = {
    ui: 0.16,        // UI hover: 120-200ms
    divider: 0.32,   // Divider draw: 250-400ms
    route: 0.75,     // Route reveal: 600-900ms
    modal: 0.25,     // Modal: 180-320ms
    heroPin: 2,      // Hero pin: 1500-2500ms
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// EASING — animation.md §2
// No spring overshoot. No bounce easing.
// ═══════════════════════════════════════════════════════════════════════════

export const EASINGS = {
    primary: [0.22, 1, 0.36, 1] as const,
    outQuad: [0.33, 1, 0.68, 1] as const,
    linear: [0, 0, 1, 1] as const,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════════

export const transitions = {
    ui: {
        duration: DURATIONS.ui,
        ease: EASINGS.primary,
    } satisfies Transition,

    divider: {
        duration: DURATIONS.divider,
        ease: EASINGS.primary,
    } satisfies Transition,

    route: {
        duration: DURATIONS.route,
        ease: EASINGS.outQuad,
    } satisfies Transition,

    modal: {
        duration: DURATIONS.modal,
        ease: EASINGS.primary,
    } satisfies Transition,
};

// ═══════════════════════════════════════════════════════════════════════════
// ROUTE TRANSITIONS — animation.md §3
// Architectural wipes, not fades. Panel slides, manifesto word flash.
// ═══════════════════════════════════════════════════════════════════════════

export const panelWipe: Variants = {
    initial: { y: "100%" },
    animate: {
        y: "-100%",
        transition: { duration: DURATIONS.route, ease: EASINGS.outQuad },
    },
};

export const pageReveal: Variants = {
    initial: { opacity: 0 },
    enter: {
        opacity: 1,
        transition: {
            duration: 0.3,
            delay: DURATIONS.route * 0.8,
        },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHIC MOTION — animation.md §5
// Vertical mask reveals, shutter wipes, baseline snaps, outline → fill
// ═══════════════════════════════════════════════════════════════════════════

export const maskReveal: Variants = {
    initial: {
        clipPath: "inset(100% 0 0 0)",
        opacity: 0,
    },
    animate: {
        clipPath: "inset(0% 0 0 0)",
        opacity: 1,
        transition: {
            clipPath: { duration: 0.6, ease: EASINGS.primary },
            opacity: { duration: 0.3 },
        },
    },
};

export const shutterWipe: Variants = {
    initial: {
        clipPath: "inset(0 100% 0 0)",
    },
    animate: {
        clipPath: "inset(0 0% 0 0)",
        transition: { duration: 0.8, ease: EASINGS.primary },
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION REVEAL — animation.md §7
// 1. Divider draws 2. Number appears 3. Headline wipes 4. Content snaps
// ═══════════════════════════════════════════════════════════════════════════

export const dividerDraw: Variants = {
    initial: { scaleX: 0, transformOrigin: "left" },
    animate: {
        scaleX: 1,
        transition: transitions.divider,
    },
};

export const sectionNumber: Variants = {
    initial: { opacity: 0, x: -10 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { ...transitions.divider, delay: 0.1 },
    },
};

export const headlineWipe: Variants = {
    initial: {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
    },
    animate: {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        transition: {
            clipPath: { duration: 0.6, ease: EASINGS.primary, delay: 0.2 },
            opacity: { duration: 0.3, delay: 0.2 },
        },
    },
};

export const contentSnap: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: EASINGS.primary, delay: 0.4 },
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// STAGGER CONTAINERS
// ═══════════════════════════════════════════════════════════════════════════

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
        },
    },
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 16 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: EASINGS.primary },
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// HOVER INTERACTIONS — animation.md §9
// Restrained: border thickens, underline slides, stroke brightens
// NO lift shadows, NO tilt, NO glow rings
// ═══════════════════════════════════════════════════════════════════════════

export const hoverBorder: Variants = {
    initial: { borderWidth: 1 },
    hover: { borderWidth: 2 },
};

export const hoverUnderline: Variants = {
    initial: { width: 0 },
    hover: { width: "100%" },
};

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON INTERACTIONS — animation.md §10
// Click: scale 0.96, instant snap back. NO ripple effects.
// ═══════════════════════════════════════════════════════════════════════════

export const buttonPress: Variants = {
    initial: { scale: 1 },
    tap: { scale: 0.96 },
};

// ═══════════════════════════════════════════════════════════════════════════
// LINE DRAW — animation.md §6
// SVG stroke animations
// ═══════════════════════════════════════════════════════════════════════════

export const lineDraw: Variants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 1.2, ease: EASINGS.primary },
            opacity: { duration: 0.2 },
        },
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// GEOMETRY MORPH — animation.md §6
// Slow orbit, axial spin, scroll-scrubbed
// ═══════════════════════════════════════════════════════════════════════════

export const slowOrbit: Variants = {
    animate: {
        rotate: 360,
        transition: {
            duration: 60,
            ease: "linear",
            repeat: Infinity,
        },
    },
};

export const axialSpin: Variants = {
    animate: {
        rotateY: 360,
        transition: {
            duration: 20,
            ease: "linear",
            repeat: Infinity,
        },
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// COUNTDOWN — animation.md (flip animation for digits)
// ═══════════════════════════════════════════════════════════════════════════

export const digitFlip: Variants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: transitions.ui },
    exit: { y: 20, opacity: 0, transition: transitions.ui },
};

// ═══════════════════════════════════════════════════════════════════════════
// REDUCED MOTION — animation.md §19
// ═══════════════════════════════════════════════════════════════════════════

export const reducedMotion: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
};

// ═══════════════════════════════════════════════════════════════════════════
// CARD INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════

export const cardHover: Variants = {
    initial: { y: 0 },
    hover: {
        y: -4,
        transition: { duration: DURATIONS.ui, ease: EASINGS.outQuad }
    }
};

export const cardFloat: Variants = {
    animate: {
        y: [0, -8, 0],
        transition: {
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
        }
    }
};
