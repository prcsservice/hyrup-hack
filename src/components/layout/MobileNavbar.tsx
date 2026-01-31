"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    Home,
    Lightbulb,
    Users,
    MessageCircle,
    User
} from "lucide-react";
import { useState } from "react";

interface NavItem {
    icon: React.ElementType;
    label: string;
    href?: string;
    action?: string;
    exactMatch?: boolean;
}

const mobileNavItems: NavItem[] = [
    { icon: Home, label: "Home", href: "/dashboard", exactMatch: true },
    { icon: Lightbulb, label: "Submit", href: "/submit/idea" },
    { icon: Users, label: "Team", href: "/dashboard/team", exactMatch: true },
    { icon: MessageCircle, label: "Chat", href: "/dashboard/chat", exactMatch: true },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
];

interface MobileNavbarProps {
    onToggleChat?: () => void;
}

export function MobileNavbar({ onToggleChat }: MobileNavbarProps) {
    const pathname = usePathname();

    const isActive = (href?: string, exactMatch?: boolean) => {
        if (!href) return false;
        if (exactMatch) {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(href + "/");
    };

    const handleClick = (item: NavItem) => {
        if (item.action === "toggleChat" && onToggleChat) {
            onToggleChat();
        }
    };

    return (
        <nav className="fixed bottom-4 left-4 right-4 md:hidden z-50">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-bg-secondary/95 backdrop-blur-lg border border-stroke-primary rounded-lg shadow-2xl"
            >
                <div className="flex items-center justify-around py-2 px-2">
                    {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href, item.exactMatch);

                        if (item.action) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => handleClick(item)}
                                    className={`
                                        flex flex-col items-center justify-center py-2 px-3 transition-all
                                        ${active ? "text-accent" : "text-text-muted hover:text-white"}
                                    `}
                                >
                                    <Icon size={20} />
                                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href!}
                                className={`
                                    relative flex flex-col items-center justify-center py-2 px-3 transition-all
                                    ${active ? "text-accent" : "text-text-muted hover:text-white"}
                                `}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="mobileNav"
                                        className="absolute inset-0 bg-accent/10 rounded-lg"
                                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    />
                                )}
                                <Icon size={20} className="relative z-10" />
                                <span className="text-[10px] mt-1 font-medium relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>
        </nav>
    );
}
