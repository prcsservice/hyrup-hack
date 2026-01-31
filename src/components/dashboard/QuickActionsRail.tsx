"use client";

import { Users, FileText, HelpCircle, Headphones } from "lucide-react";
import { useTeam } from "@/context/TeamContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

/**
 * Quick Actions Rail
 * Horizontal row of shortcut cards for common dashboard actions.
 */

const ACTIONS = [
    {
        id: "invite",
        icon: Users,
        label: "Invite Member",
        description: "Share team link",
        action: "share"
    },
    {
        id: "submit",
        icon: FileText,
        label: "Submit Idea",
        description: "Start submission",
        href: "/submit/idea"
    },
    {
        id: "rules",
        icon: HelpCircle,
        label: "View Rules",
        description: "Check guidelines",
        href: "/rules"
    },
    {
        id: "support",
        icon: Headphones,
        label: "Get Support",
        description: "Contact team",
        href: "/contact"
    }
];

export function QuickActionsRail() {
    const { team } = useTeam();
    const { showToast } = useToast();
    const router = useRouter();

    const handleAction = (action: typeof ACTIONS[0]) => {
        if (action.href) {
            router.push(action.href);
        } else if (action.action === "share" && team) {
            // Copy invite link to clipboard
            const link = `https://fixforward.hyrup.in/register?code=${team.inviteCode}`;
            navigator.clipboard.writeText(link);
            showToast("Invite link copied!", "success");
        } else if (action.action === "email") {
            window.location.href = "mailto:info.hyrup@gmail.com?subject=FixForward%20Support";
        }
    };

    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.id}
                        onClick={() => handleAction(action)}
                        className="shrink-0 flex items-center gap-3 px-4 py-3 bg-bg-secondary border border-stroke-divider rounded-sm hover:border-accent hover:bg-bg-tertiary/30 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                            <Icon size={16} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">{action.label}</p>
                            <p className="text-[10px] text-text-muted">{action.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
