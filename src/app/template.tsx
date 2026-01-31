"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Template component runs on every page change
// Skip animation for dashboard routes (handled internally by DashboardLayout)
export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Dashboard pages have their own internal transitions via DashboardLayout
    // Only animate non-dashboard pages
    const isDashboardRoute = pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/submit') ||
        pathname?.startsWith('/pitch');

    if (isDashboardRoute) {
        // No transition for dashboard routes - they handle it internally
        return <>{children}</>;
    }

    // Smooth transition for public pages (landing, login, register, etc.)
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
