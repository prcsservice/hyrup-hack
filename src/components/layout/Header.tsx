"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button, buttonBaseStyles, buttonVariants, buttonSizes } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { navLinks, siteConfig } from "@/lib/config";
import { buttonPress } from "@/lib/motion";

/**
 * Header v2.0
 * Reference: layout.md §3
 * 
 * - Fixed, opaque (no blur)
 * - 1px bottom divider
 * - Height reduces on scroll
 * - Divider darkens on scroll
 * - NO translucency, NO glow
 */

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { scrollY } = useScroll();

    // Scroll transforms - height reduces, divider darkens
    const headerHeight = useTransform(scrollY, [0, 100], [72, 56]);
    const dividerOpacity = useTransform(scrollY, [0, 100], [0.06, 0.2]);

    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMenuOpen]);

    if (pathname?.startsWith('/admin')) return null;

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 bg-bg-primary"
                style={{
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: mounted
                        ? `rgba(255, 255, 255, ${dividerOpacity.get()})`
                        : "rgba(255, 255, 255, 0.06)",
                }}
            >
                <motion.nav
                    className="container flex items-center justify-between"
                    style={{ height: mounted ? headerHeight : 72 }}
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <span className="text-lg font-semibold tracking-tight">
                            FixForward
                        </span>
                        <span className="text-label text-text-muted">
                            {siteConfig.tagline}
                        </span>
                    </Link>

                    {/* Process Rail - Center */}
                    <ProcessRail className="hidden lg:flex" />

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <Link href="/register">
                            <motion.div
                                className={cn(buttonBaseStyles, buttonVariants.secondary, buttonSizes.sm, "hidden md:flex")}
                                variants={buttonPress}
                                initial="initial"
                                whileTap="tap"
                            >
                                Login
                            </motion.div>
                        </Link>
                        <Link href="/register">
                            <motion.div
                                className={cn(buttonBaseStyles, buttonVariants.primary, buttonSizes.sm, "hidden sm:flex")}
                                variants={buttonPress}
                                initial="initial"
                                whileTap="tap"
                            >
                                Register
                                <ArrowRight className="w-4 h-4" />
                            </motion.div>
                        </Link>

                        {/* Mobile menu */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-text-primary hover:bg-bg-secondary transition-colors"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </motion.nav>
            </motion.header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <motion.div
                    className="fixed inset-0 z-40 bg-bg-primary lg:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="h-full flex flex-col justify-center items-start container gap-8 pt-20">
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={link.href}
                                    className="text-3xl font-display font-semibold text-text-primary hover:text-accent transition-colors hover-underline"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8"
                        >
                            <Button size="lg">
                                Register Now
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </>
    );
}

/**
 * Process Rail - layout.md §3
 * Register → Idea → Prototype → Pitch → Results
 */
function ProcessRail({ className }: { className?: string }) {
    const phases = [
        { id: "register", label: "Register", active: true },
        { id: "idea", label: "Idea", active: false },
        { id: "prototype", label: "Prototype", active: false },
        { id: "pitch", label: "Pitch", active: false },
        { id: "results", label: "Results", active: false },
    ];

    return (
        <div className={cn("items-center gap-1", className)}>
            {phases.map((phase, i) => (
                <div key={phase.id} className="flex items-center">
                    <div
                        className={cn(
                            "px-3 py-1 text-label transition-colors",
                            phase.active
                                ? "text-accent"
                                : "text-text-muted hover:text-text-secondary"
                        )}
                    >
                        <span className="text-mono mr-1.5 opacity-50">0{i + 1}</span>
                        {phase.label}
                    </div>
                    {i < phases.length - 1 && (
                        <span className="text-text-muted px-1">→</span>
                    )}
                </div>
            ))}
        </div>
    );
}

