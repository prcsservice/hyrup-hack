"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import {
    Home,
    Lightbulb,
    Users,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Zap
} from "lucide-react";
import { useState } from "react";

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
    exactMatch?: boolean;
    badge?: string | number;
}

const mainNavItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/dashboard", exactMatch: true },
    { icon: Lightbulb, label: "Submit Idea", href: "/submit/idea" },
    { icon: BarChart3, label: "Prototype", href: "/submit/prototype" },
    { icon: Users, label: "My Team", href: "/dashboard/team", exactMatch: true },
];

const bottomNavItems: NavItem[] = [
    { icon: Settings, label: "Profile", href: "/dashboard/profile" },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { signOut, user } = useAuth();
    const { team } = useTeam();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (href: string, exactMatch?: boolean) => {
        // For exact match items
        if (exactMatch) {
            return pathname === href;
        }
        // For items that should match sub-routes
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <aside
            className={`
                hidden md:flex flex-col h-screen bg-bg-secondary border-r border-stroke-primary
                transition-all duration-300 shrink-0
                ${isCollapsed ? "w-16" : "w-60"}
            `}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-stroke-primary">
                {!isCollapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <img
                            src="/hyrup_logo.svg"
                            alt="HYRUP"
                            className="w-8 h-8"
                        />
                        <div>
                            <span className="font-display font-bold text-lg block leading-none">FixForward</span>
                            <span className="text-[10px] font-mono text-[#FF4D00] tracking-widest uppercase block leading-none mt-1">BY HYRUP</span>
                        </div>
                    </Link>
                )}
                {isCollapsed && (
                    <img
                        src="/hyrup_logo.svg"
                        alt="HYRUP"
                        className="w-8 h-8 mx-auto"
                    />
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 hover:bg-bg-tertiary transition-colors text-text-muted hover:text-white"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* User Info */}
            {!isCollapsed && (
                <div className="px-4 py-3 border-b border-stroke-primary">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-text-muted font-mono truncate">
                            {user?.displayName || "Operative"}
                        </span>
                    </div>
                    {team?.name && (
                        <div className="mt-1 text-xs text-accent font-medium truncate">
                            {team.name}
                        </div>
                    )}
                </div>
            )}

            {/* Main Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <div className="px-3 space-y-1">
                    {!isCollapsed && (
                        <div className="text-[10px] text-text-muted font-mono uppercase tracking-wider px-2 mb-2">
                            Navigation
                        </div>
                    )}
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href, item.exactMatch);

                        // Logic: If item is submit/prototype and user has NO team, disable it
                        const isRestricted = !team && (item.href.includes('/submit'));

                        if (isRestricted) {
                            return (
                                <div
                                    key={item.href}
                                    className={`
                                        relative flex items-center gap-3 px-3 py-2.5 transition-all group cursor-not-allowed opacity-50
                                        text-text-secondary border-l-2 border-transparent
                                        ${isCollapsed ? "justify-center px-0" : ""}
                                    `}
                                    title="Join a team to access this feature"
                                >
                                    <Icon size={18} />
                                    {!isCollapsed && (
                                        <span className="text-sm font-medium">{item.label}</span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-bg-tertiary border border-stroke-primary text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                            Join Team Required
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    relative flex items-center gap-3 px-3 py-2.5 transition-all group
                                    ${active
                                        ? "bg-accent/10 text-accent border-l-2 border-accent"
                                        : "text-text-secondary hover:bg-bg-tertiary hover:text-white border-l-2 border-transparent"
                                    }
                                    ${isCollapsed ? "justify-center px-0" : ""}
                                `}
                            >
                                <Icon size={18} className={active ? "text-accent" : ""} />
                                {!isCollapsed && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                                {item.badge && !isCollapsed && (
                                    <span className="ml-auto text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded-sm">
                                        {item.badge}
                                    </span>
                                )}
                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-bg-tertiary border border-stroke-primary text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="border-t border-stroke-primary py-4">
                <div className="px-3 space-y-1">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    relative flex items-center gap-3 px-3 py-2 transition-all group
                                    ${active
                                        ? "text-accent"
                                        : "text-text-muted hover:text-white"
                                    }
                                    ${isCollapsed ? "justify-center px-0" : ""}
                                `}
                            >
                                <Icon size={16} />
                                {!isCollapsed && (
                                    <span className="text-sm">{item.label}</span>
                                )}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-bg-tertiary border border-stroke-primary text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}

                    {/* Logout Button */}
                    <button
                        onClick={signOut}
                        className={`
                            relative flex items-center gap-3 px-3 py-2 w-full transition-all group
                            text-text-muted hover:text-red-400
                            ${isCollapsed ? "justify-center px-0" : ""}
                        `}
                    >
                        <LogOut size={16} />
                        {!isCollapsed && <span className="text-sm">Disconnect</span>}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-bg-tertiary border border-stroke-primary text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                Disconnect
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}
