"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * ProtectedRoute Wrapper
 * Redirects unauthenticated users to the register page.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading, onboarded } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); // Need to check if already on /onboarding to avoid loop

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/register");
            } else if (!onboarded && pathname !== '/onboarding') {
                router.push("/onboarding");
            }
        }
    }, [user, loading, onboarded, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-muted">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-mono tracking-widest uppercase">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
