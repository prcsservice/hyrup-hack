"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    Gavel,
    Settings,
    LogOut,
    Menu,
    ShieldAlert,
    ArrowRight,
    Megaphone,
    BookOpen,
    History
} from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/Button"; // Check path

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, signOut } = useAuth(); // role is handled by email check for strictness
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Specific Admin Login Handler
    const handleAdminLogin = async () => {
        setIsLoggingIn(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const email = result.user.email;
            if (email !== 'info.hyrup@gmail.com') {
                await signOut(); // Force sign out if wrong email
                alert("Access Denied. You must use info.hyrup@gmail.com");
            }
            // If success, react state updates and renders content
        } catch (error) {
            console.error("Admin Login Error", error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (loading) return <div className="h-screen bg-bg-primary flex items-center justify-center text-text-muted font-mono animate-pulse">Verifying Security Protocol...</div>;

    const isAdmin = user?.email === 'info.hyrup@gmail.com';

    // 1. Not Logged In -> Show Login Screen
    if (!user) {
        return (
            <div className="h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
                <div className="max-w-sm w-full bg-bg-secondary border border-stroke-primary p-8 rounded-sm text-center">
                    <div className="mx-auto w-12 h-12 bg-bg-tertiary rounded-full flex items-center justify-center mb-6 text-accent">
                        <ShieldAlert size={24} />
                    </div>
                    <h1 className="text-2xl font-display font-bold mb-2">Restricted Access</h1>
                    <p className="text-text-secondary text-sm mb-6">
                        This portal is exclusively for HYRUP Administrators.
                    </p>
                    <Button
                        onClick={handleAdminLogin}
                        className="w-full"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? 'Authenticating...' : 'Sign in with Google'}
                    </Button>
                    <p className="text-[10px] text-text-muted mt-4">
                        Allowed: info.hyrup@gmail.com
                    </p>
                </div>
            </div>
        );
    }

    // 2. Logged In but Wrong Email -> Show Unauthorized
    if (!isAdmin) {
        return (
            <div className="h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
                <div className="max-w-sm w-full bg-red-500/10 border border-red-500/50 p-8 rounded-sm text-center">
                    <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
                    <h1 className="text-xl font-bold text-red-500 mb-2">Unauthorized Identity</h1>
                    <p className="text-white text-sm mb-1">
                        Logged in as: <span className="font-mono text-accent">{user.email}</span>
                    </p>
                    <p className="text-text-secondary text-xs mb-6">
                        You do not have clearance to access the Admin Panel.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button variant="secondary" onClick={signOut}>
                            Switch Account
                        </Button>
                        <button onClick={() => router.push('/')} className="text-xs text-text-muted hover:text-white mt-2">
                            Return to Safe Zone
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Authenticated Admin -> Show Dashboard
    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Judges & Invites', href: '/admin/judges', icon: Gavel },
        { name: 'Users & Teams', href: '/admin/users', icon: Users },
        { name: 'Notifications', href: '/admin/notifications', icon: Megaphone },
        { name: 'CMS', href: '/admin/cms', icon: BookOpen },
        { name: 'Global Settings', href: '/admin/settings', icon: Settings },
        { name: 'Audit Logs', href: '/admin/audit', icon: History },
    ];

    return (
        <div className="min-h-screen bg-bg-primary flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-bg-secondary border-r border-stroke-primary transform transition-transform duration-200 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-stroke-primary">
                        <span className="font-display font-bold text-xl text-accent tracking-tight">HYRUP<span className="text-white">_ADMIN</span></span>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        router.push(item.href);
                                        setSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-accent/10 text-accent border border-accent/20'
                                            : 'text-text-secondary hover:text-white hover:bg-bg-tertiary border border-transparent'
                                        }
                                    `}
                                >
                                    <Icon size={18} />
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-stroke-primary">
                        <div className="bg-bg-tertiary rounded-sm p-3 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-bg-primary font-bold">
                                {user.displayName?.[0] || 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-sm font-bold truncate text-white">{user.displayName}</div>
                                <div className="text-[10px] text-text-muted truncate">{user.email}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-text-muted hover:text-red-400 transition-colors"
                        >
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 md:hidden border-b border-stroke-primary flex items-center justify-between px-4 bg-bg-secondary">
                    <span className="font-display font-bold text-lg">Admin Panel</span>
                    <button onClick={() => setSidebarOpen(true)} className="text-text-secondary">
                        <Menu size={24} />
                    </button>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
