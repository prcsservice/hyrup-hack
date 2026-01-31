"use client";

import { motion } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InteractiveOrbit } from "@/components/landing/InteractiveOrbit";

/**
 * Registration Page
 * Split Layout:
 * Left: The Manifesto (Visuals, Topographic)
 * Right: The Gateway (Auth Form)
 */

function RegisterPageContent() {
    const { signInWithGoogle, user, loading, onboarded } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Redirect logged-in users away from register page
    useEffect(() => {
        if (!loading && user) {
            router.push(onboarded ? '/dashboard' : '/onboarding');
        }
    }, [user, loading, onboarded, router]);

    // Capture Invite Code from URL if present (e.g. ?code=XYZ123)
    useEffect(() => {
        const code = searchParams?.get('code') || searchParams?.get('invite');
        if (code) {
            localStorage.setItem('inviteCode', code);
        }
    }, [searchParams]);

    const handleLogin = async () => {
        setIsLoading(true);
        setError("");
        try {
            await signInWithGoogle();
            // Navigation will be handled by the useEffect above once user state updates
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-mono tracking-widest uppercase text-text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is logged in, the useEffect will redirect them
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-mono tracking-widest uppercase text-text-muted">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen grid lg:grid-cols-2">

            {/* LEFT: The Manifesto (Visuals) - Desktop Only */}
            <div className="relative hidden lg:flex flex-col justify-between p-16 bg-bg-secondary overflow-hidden border-r border-stroke-divider">

                {/* Background Grid */}
                <div className="absolute inset-0 grid-rails opacity-30" />
                <div className="absolute inset-0 noise-overlay opacity-30" />

                {/* Animated Geometry */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60">
                    <InteractiveOrbit />
                </div>

                {/* Top Branding */}
                <div className="relative z-10">
                    <Link href="/" className="text-xl font-bold font-display">
                        FixForward
                    </Link>
                </div>

                {/* Bottom Manifesto */}
                <div className="relative z-10 max-w-lg">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-display font-bold leading-tight">
                            Build things that <br />
                            <span className="text-accent">actually matter.</span>
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "Connect with 5,000+ builders",
                                "Compete for ₹3,00,000 prize pool",
                                "Get feedback from industry leaders",
                                "Launch your startup in 48 hours"
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="flex items-center gap-3 text-text-secondary"
                                >
                                    <div className="w-5 h-5 rounded-full border border-stroke-primary flex items-center justify-center text-accent">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* RIGHT: The Gateway (Auth Form) */}
            <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-16 bg-bg-primary min-h-screen">

                {/* Mobile: Top Branding */}
                <div className="lg:hidden absolute top-6 left-6 z-10">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/hyrup_logo.svg" alt="HYRUP" className="w-6 h-6" />
                        <span className="text-lg font-bold font-display">FixForward</span>
                    </Link>
                </div>

                {/* Mobile: Background Pattern */}
                <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle cx="80" cy="20" r="40" fill="none" stroke="#FF4D00" strokeWidth="0.5" />
                            <circle cx="80" cy="20" r="30" fill="none" stroke="#FF4D00" strokeWidth="0.3" />
                            <circle cx="80" cy="20" r="20" fill="none" stroke="#FF4D00" strokeWidth="0.2" />
                        </svg>
                    </div>
                </div>

                <div className="w-full max-w-md space-y-6 lg:space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <motion.h1
                            className="text-2xl sm:text-3xl font-display font-bold"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Join the Movement
                        </motion.h1>
                        <p className="text-text-secondary text-sm sm:text-base">
                            Sign in to register for FixForward 2025.
                        </p>
                    </div>

                    {/* Mobile: Compact Benefits */}
                    <motion.div
                        className="lg:hidden flex flex-wrap gap-2 justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {[
                            "5,000+ builders",
                            "₹3L prize pool",
                            "48hr launch"
                        ].map((item, i) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent text-xs font-medium"
                            >
                                {item}
                            </span>
                        ))}
                    </motion.div>

                    {/* Auth Box */}
                    <div className="space-y-5 pt-2 lg:pt-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-400 flex items-center gap-2">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <Button
                            size="lg"
                            className="w-full relative group overflow-hidden"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </span>
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-stroke-divider" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-bg-primary px-2 text-text-muted">Or</span>
                            </div>
                        </div>

                        <p className="text-center text-xs sm:text-sm text-text-muted">
                            By continuing, you agree to our{" "}
                            <Link href="/terms" className="underline hover:text-accent">Terms of Service</Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="underline hover:text-accent">Privacy Policy</Link>.
                        </p>
                    </div>

                    {/* Config & Help */}
                    <div className="pt-6 lg:pt-8 border-t border-stroke-divider flex justify-between text-xs text-text-muted font-mono">
                        <span>FIXFORWARD ID: 2025-GX</span>
                        <span>HELP CENTER</span>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-bg-primary">Loading...</div>}>
            <RegisterPageContent />
        </Suspense>
    );
}
