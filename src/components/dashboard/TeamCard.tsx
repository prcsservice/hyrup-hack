"use client";

import { Copy, Share2, Users, LogOut, Zap, Rocket, Shield, Cpu, Flame, Target, Anchor, Gem } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const ICONS: Record<string, any> = {
    rocket: Rocket,
    zap: Zap,
    shield: Shield,
    cpu: Cpu,
    flame: Flame,
    target: Target,
    anchor: Anchor,
    gem: Gem
};

export function TeamCard() {
    const { team, leaveTeam } = useTeam();
    const { user } = useAuth();

    if (!team) return null;

    const TeamIcon = ICONS[team.theme.emoji] || Rocket; // Fallback for old data

    const copyInvite = () => {
        const link = `${window.location.origin}/join?code=${team.inviteCode}`;
        navigator.clipboard.writeText(link);
        alert("Invite link copied to clipboard: " + link);
    };

    const shareWhatsApp = () => {
        const link = `${window.location.origin}/join?code=${team.inviteCode}`;
        const text = `Join my squad "${team.name}" on FixForward! Code: ${team.inviteCode} Link: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="w-full h-full p-8 bg-bg-secondary border border-stroke-primary relative overflow-hidden flex flex-col justify-between group hover:border-accent/50 transition-colors">
            {/* Decorative Glow based on Team Color */}
            <div
                className="absolute top-0 right-0 w-96 h-96 blur-[100px] opacity-10 pointer-events-none rounded-full"
                style={{ background: team.theme.color }}
            />

            <div className="relative z-10">
                {/* Header: Identity */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center border-2 bg-bg-tertiary"
                            style={{ borderColor: team.theme.color }}
                        >
                            <TeamIcon
                                size={32}
                                style={{
                                    color: team.theme.color,
                                    filter: `drop-shadow(0 0 15px ${team.theme.color})`
                                }}
                            />
                        </div>
                        <div>
                            <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Squadron</div>
                            <h2 className="text-4xl font-display font-bold">{team.name}</h2>
                        </div>
                    </div>

                    {/* Invite Widget */}
                    <div className="hidden md:block">
                        <div className="flex items-center gap-2 bg-bg-primary border border-stroke-primary px-4 py-2 rounded-full cursor-pointer hover:border-accent transition-colors" onClick={copyInvite}>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-mono text-lg font-bold tracking-widest">{team.inviteCode}</span>
                            <Copy size={14} className="ml-2 text-text-muted" />
                        </div>
                    </div>
                </div>

                {/* Members Grid */}
                <div className="mt-12">
                    <div className="text-xs font-mono text-text-muted uppercase mb-4">Operatives ({team.members.length}/4)</div>
                    <div className="flex gap-4">
                        {team.members.map((m, i) => (
                            <div key={i} className="flex items-center gap-3 bg-bg-tertiary pr-4 rounded-full border border-stroke-divider">
                                <div className="w-10 h-10 rounded-full bg-stroke-secondary flex items-center justify-center text-xs border border-bg-secondary">
                                    👤
                                </div>
                                <span className="text-sm font-medium">Hacker {i + 1}</span>
                            </div>
                        ))}
                        {/* Empty Slots */}
                        {Array.from({ length: 4 - team.members.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="w-10 h-10 rounded-full border border-dashed border-stroke-primary flex items-center justify-center opacity-30">
                                <Users size={14} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="relative z-10 mt-8 pt-8 border-t border-stroke-divider flex justify-between items-center">
                <div className="flex gap-4">
                    <Button variant="secondary" size="sm" onClick={copyInvite}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                    </Button>
                    <Button size="sm" onClick={shareWhatsApp} className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                        <Share2 className="w-4 h-4 mr-2" />
                        WhatsApp
                    </Button>
                </div>

                {team.leaderId === user?.uid ? (
                    <button className="text-xs text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors" onClick={leaveTeam}>
                        <LogOut size={12} /> DISBAND SQUAD
                    </button>
                ) : (
                    <button className="text-xs text-red-500 hover:text-red-400 flex items-center gap-2 transition-colors" onClick={leaveTeam}>
                        <LogOut size={12} /> LEAVE SQUAD
                    </button>
                )}
            </div>

        </div>
    );
}
