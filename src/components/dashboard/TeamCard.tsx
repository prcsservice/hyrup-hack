"use client";

import { Copy, Share2, Users, LogOut, Zap, Rocket, Shield, Cpu, Flame, Target, Anchor, Gem, X, Mail, Phone, GraduationCap, Crown, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import { competitionConfig } from "@/lib/config";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Track badge colors
const TRACK_COLORS: Record<string, string> = {
    tech: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    medical: "bg-green-500/20 text-green-400 border-green-500/30",
    business: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    design: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

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

interface MemberInfo {
    uid: string;
    displayName: string;
    email: string;
    phone?: string;
    university?: string;
    bio?: string;
    skills?: string[];
    photoURL?: string;
}

export function TeamCard() {
    const { team, leaveTeam } = useTeam();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null);
    const [loadingMember, setLoadingMember] = useState(false);
    const [membersCache, setMembersCache] = useState<Record<string, MemberInfo>>({});

    if (!team) return null;

    const TeamIcon = ICONS[team.theme.emoji] || Rocket;

    const copyInvite = () => {
        const link = `https://fixforward.hyrup.in/join?code=${team.inviteCode}`;
        navigator.clipboard.writeText(link);
        showToast("Invite link copied!", "success");
    };

    const shareWhatsApp = () => {
        const link = `https://fixforward.hyrup.in/join?code=${team.inviteCode}`;
        const text = `🚀 *Join my team "${team.name}" on FixForward Hackathon!*

🎯 Use invite code: *${team.inviteCode}*

🔗 Click here to join: ${link}

💡 FixForward - India's biggest student hackathon by HYRUP`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const fetchMemberDetails = async (uid: string) => {
        // Check cache first
        if (membersCache[uid]) {
            setSelectedMember(membersCache[uid]);
            return;
        }

        setLoadingMember(true);
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                const memberInfo: MemberInfo = {
                    uid,
                    displayName: data.displayName || "Anonymous",
                    email: data.email || "",
                    phone: data.phone,
                    university: data.university,
                    bio: data.bio,
                    skills: data.skills,
                    photoURL: data.photoURL,
                };
                // Cache the data
                setMembersCache(prev => ({ ...prev, [uid]: memberInfo }));
                setSelectedMember(memberInfo);
            }
        } catch (error) {
            console.error("Failed to fetch member details:", error);
        } finally {
            setLoadingMember(false);
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <>
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
                                {team.track && (
                                    <span className={`mt-2 inline-block text-xs font-mono px-2 py-1 rounded border ${TRACK_COLORS[team.track] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                                        {competitionConfig.solutionTracks.find(t => t.id === team.track)?.label || 'Track'}
                                    </span>
                                )}
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
                        <div className="text-xs font-mono text-text-muted uppercase mb-4">
                            Operatives ({team.members.length}/4) • Click to view details
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {team.members.map((uid, i) => {
                                const isLeader = uid === team.leaderId;
                                const position = team.positions?.[uid];
                                const cachedMember = membersCache[uid];

                                return (
                                    <button
                                        key={uid || `member-${i}`}
                                        onClick={() => fetchMemberDetails(uid)}
                                        className="flex items-center gap-3 bg-bg-tertiary pr-4 rounded-full border border-stroke-divider hover:border-accent transition-all cursor-pointer group/member"
                                    >
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold
                                            ${isLeader
                                                ? 'bg-accent/20 text-accent border border-accent/50'
                                                : 'bg-stroke-secondary text-white border border-bg-secondary'
                                            }
                                        `}>
                                            {cachedMember ? getInitials(cachedMember.displayName) : `M${i + 1}`}
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium group-hover/member:text-accent transition-colors">
                                                    {cachedMember?.displayName || `Member ${i + 1}`}
                                                </span>
                                                {isLeader && <Crown size={12} className="text-yellow-500" />}
                                            </div>
                                            {position && (
                                                <span className="text-[10px] text-text-muted">{position}</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
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

            {/* Member Details Modal */}
            <AnimatePresence>
                {(selectedMember || loadingMember) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedMember(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-bg-secondary border border-stroke-primary w-full max-w-md relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            {loadingMember ? (
                                <div className="p-12 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : selectedMember && (
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`
                                            w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold
                                            ${selectedMember.uid === team.leaderId
                                                ? 'bg-accent text-black'
                                                : 'bg-bg-tertiary text-white border border-stroke-primary'
                                            }
                                        `}>
                                            {selectedMember.photoURL ? (
                                                <img
                                                    src={selectedMember.photoURL}
                                                    alt={selectedMember.displayName}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                getInitials(selectedMember.displayName)
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-display font-bold">
                                                    {selectedMember.displayName}
                                                </h3>
                                                {selectedMember.uid === team.leaderId && (
                                                    <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">
                                                        <Crown size={10} /> Leader
                                                    </span>
                                                )}
                                            </div>
                                            {team.positions?.[selectedMember.uid] && (
                                                <span className="text-sm text-accent">
                                                    {team.positions[selectedMember.uid]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4">
                                        {/* Email */}
                                        <div className="flex items-center gap-3 p-3 bg-bg-tertiary border border-stroke-divider">
                                            <Mail size={16} className="text-text-muted" />
                                            <div>
                                                <div className="text-[10px] text-text-muted uppercase font-mono">Email</div>
                                                <div className="text-sm">{selectedMember.email || "Not provided"}</div>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        {selectedMember.phone && (
                                            <div className="flex items-center gap-3 p-3 bg-bg-tertiary border border-stroke-divider">
                                                <Phone size={16} className="text-text-muted" />
                                                <div>
                                                    <div className="text-[10px] text-text-muted uppercase font-mono">Phone</div>
                                                    <div className="text-sm">{selectedMember.phone}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* University */}
                                        {selectedMember.university && (
                                            <div className="flex items-center gap-3 p-3 bg-bg-tertiary border border-stroke-divider">
                                                <GraduationCap size={16} className="text-text-muted" />
                                                <div>
                                                    <div className="text-[10px] text-text-muted uppercase font-mono">University</div>
                                                    <div className="text-sm">{selectedMember.university}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bio */}
                                        {selectedMember.bio && (
                                            <div className="p-3 bg-bg-tertiary border border-stroke-divider">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User size={14} className="text-text-muted" />
                                                    <span className="text-[10px] text-text-muted uppercase font-mono">Bio</span>
                                                </div>
                                                <p className="text-sm text-text-secondary">{selectedMember.bio}</p>
                                            </div>
                                        )}

                                        {/* Skills */}
                                        {selectedMember.skills && selectedMember.skills.length > 0 && (
                                            <div className="p-3 bg-bg-tertiary border border-stroke-divider">
                                                <div className="text-[10px] text-text-muted uppercase font-mono mb-2">Skills</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedMember.skills.map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-xs px-2 py-1 bg-accent/10 text-accent border border-accent/30"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 pt-4 border-t border-stroke-divider">
                                        <button
                                            onClick={() => setSelectedMember(null)}
                                            className="w-full py-2 bg-bg-tertiary border border-stroke-primary text-sm hover:border-accent transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
