"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { TeamProvider } from "@/context/TeamContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { MobileNavbar } from "./MobileNavbar";
import { FAQBot } from "./FAQBot";
import { TeamChat } from "@/components/dashboard/TeamChat";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Lenis from "@studio-freight/lenis";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
    children: ReactNode;
    showChat?: boolean;
    showFAQ?: boolean;
}

// Content transition variants
const contentVariants = {
    initial: {
        opacity: 0,
        x: 20,
    },
    enter: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.25,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: 0.15,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

export function DashboardLayout({
    children,
    showChat = true,
    showFAQ = true
}: DashboardLayoutProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isFAQOpen, setIsFAQOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();

    const toggleChat = () => setIsChatOpen(!isChatOpen);
    const toggleFAQ = () => setIsFAQOpen(!isFAQOpen);

    // Initialize Lenis for the dashboard scroll container
    useEffect(() => {
        if (!scrollContainerRef.current) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return;

        // Create a Lenis instance specifically for this container
        lenisRef.current = new Lenis({
            wrapper: scrollContainerRef.current,
            content: scrollContainerRef.current.firstElementChild as HTMLElement,
            duration: 1.0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        // RAF loop for this Lenis instance
        function raf(time: number) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenisRef.current?.destroy();
            lenisRef.current = null;
        };
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        scrollContainerRef.current?.scrollTo(0, 0);
    }, [pathname]);

    return (
        <ProtectedRoute>
            <TeamProvider>
                <div className="flex h-screen bg-bg-primary overflow-hidden">
                    {/* Desktop Sidebar */}
                    <DashboardSidebar />

                    {/* Main Content Area */}
                    <main className="flex-1 flex flex-col min-h-0 w-full">
                        {/* Scrollable Content with Lenis smooth scroll */}
                        <div
                            ref={scrollContainerRef}
                            data-lenis-prevent
                            className="flex-1 overflow-y-auto overflow-x-hidden"
                            style={{ height: '100%' }}
                        >
                            <div className="p-4 md:p-6 pb-28 md:pb-8 min-h-full">
                                {/* Animated Page Content */}
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={pathname}
                                        variants={contentVariants}
                                        initial="initial"
                                        animate="enter"
                                        exit="exit"
                                    >
                                        {children}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </main>

                    {/* Floating Components */}
                    {showChat && <TeamChat isOpen={isChatOpen} onToggle={toggleChat} />}
                    {showFAQ && <FAQBot />}

                    {/* Mobile Bottom Navbar */}
                    <MobileNavbar onToggleChat={toggleChat} />
                </div>
            </TeamProvider>
        </ProtectedRoute>
    );
}

