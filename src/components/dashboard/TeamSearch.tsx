"use client";

import { useState } from "react";
import { Search, Users, Rocket, Zap, Shield, Cpu, Flame, Target, Anchor, Gem, X, Eye, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTeam, Team } from "@/context/TeamContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { competitionConfig } from "@/lib/config";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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

export function TeamSearch() {
    const { searchTeams } = useTeam();
    const { showToast } = useToast();
    const { user } = useAuth();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Team[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [requestSent, setRequestSent] = useState<string[]>([]);

    const handleSearch = async (val: string) => {
        setQuery(val);
        if (val.length > 2) {
            const res = await searchTeams(val);
            setResults(res);
            setShowResults(true);
        } else {
            setResults([]);
            setShowResults(false);
        }
    };

    const handleRequestJoin = async (teamId: string, teamName: string) => {
        if (!user) return;

        try {
            // Save to Firestore joinRequests collection
            const requestId = `${teamId}_${user.uid}`;
            await setDoc(doc(db, "joinRequests", requestId), {
                teamId,
                userId: user.uid,
                userName: user.displayName || "Participant",
                userEmail: user.email,
                createdAt: serverTimestamp()
            });

            setRequestSent([...requestSent, teamId]);
            showToast(`Join request sent to ${teamName}!`, "success");
            setSelectedTeam(null);
        } catch (error) {
            console.error("Failed to send request:", error);
            showToast("Failed to send request", "error");
        }
    };

    const getTrackLabel = (trackId: string) => {
        return competitionConfig.solutionTracks.find(t => t.id === trackId)?.label || "—";
    };

    return (
        <>
            <div className="relative w-full max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-sm border border-stroke-divider p-3 pl-10 rounded-lg text-sm focus:border-accent outline-none transition-colors"
                        placeholder="Search teams by name..."
                    />
                </div>

                {showResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-stroke-primary rounded-lg shadow-2xl z-20 max-h-72 overflow-y-auto">
                        {results.length === 0 ? (
                            <div className="p-4 text-center text-text-muted text-sm">No teams found.</div>
                        ) : (
                            results.map(team => {
                                const TeamIcon = ICONS[team.theme.emoji] || Rocket;
                                const isRequested = requestSent.includes(team.id);
                                return (
                                    <div key={team.id} className="p-3 border-b border-stroke-divider flex items-center justify-between hover:bg-bg-tertiary transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-bg-primary border-2" style={{ borderColor: team.theme.color }}>
                                                <TeamIcon size={16} style={{ color: team.theme.color }} />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-white">{team.name}</div>
                                                <div className="text-xs text-text-muted flex items-center gap-2">
                                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {team.members.length}/4</span>
                                                    {team.track && <span className="text-accent">{getTrackLabel(team.track)}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedTeam(team)}
                                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {team.members.length < 4 && (
                                                isRequested ? (
                                                    <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Sent</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRequestJoin(team.id, team.name)}
                                                        className="p-2 bg-accent/20 hover:bg-accent/30 rounded-full transition-colors text-accent"
                                                        title="Request to Join"
                                                    >
                                                        <UserPlus size={16} />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Team Details Modal */}
            <AnimatePresence>
                {selectedTeam && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedTeam(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-bg-secondary border border-stroke-primary rounded-lg w-full max-w-md overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-stroke-divider">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        {(() => {
                                            const TeamIcon = ICONS[selectedTeam.theme.emoji] || Rocket;
                                            return (
                                                <div
                                                    className="w-14 h-14 rounded-full flex items-center justify-center border-2 bg-bg-tertiary"
                                                    style={{ borderColor: selectedTeam.theme.color }}
                                                >
                                                    <TeamIcon size={24} style={{ color: selectedTeam.theme.color }} />
                                                </div>
                                            );
                                        })()}
                                        <div>
                                            <h3 className="text-xl font-display font-bold text-white">{selectedTeam.name}</h3>
                                            <p className="text-xs text-text-muted font-mono">CODE: {selectedTeam.inviteCode}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedTeam(null)} className="text-text-muted hover:text-white">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4">
                                {/* Track & Domain */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-bg-tertiary p-3 rounded-lg">
                                        <p className="text-[10px] uppercase text-text-muted font-mono mb-1">Track</p>
                                        <p className="text-sm font-medium text-accent">{selectedTeam.track ? getTrackLabel(selectedTeam.track) : "Not Set"}</p>
                                    </div>
                                    <div className="bg-bg-tertiary p-3 rounded-lg">
                                        <p className="text-[10px] uppercase text-text-muted font-mono mb-1">Domain</p>
                                        <p className="text-sm font-medium text-white">{selectedTeam.domain || "Not Set"}</p>
                                    </div>
                                </div>

                                {/* Members */}
                                <div>
                                    <p className="text-[10px] uppercase text-text-muted font-mono mb-2">Members ({selectedTeam.members.length}/4)</p>
                                    <div className="flex -space-x-2">
                                        {selectedTeam.members.map((m, i) => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-bg-tertiary border-2 border-bg-secondary flex items-center justify-center text-lg">
                                                👤
                                            </div>
                                        ))}
                                        {Array.from({ length: 4 - selectedTeam.members.length }).map((_, i) => (
                                            <div key={`empty-${i}`} className="w-10 h-10 rounded-full border-2 border-dashed border-stroke-divider flex items-center justify-center opacity-30">
                                                <Users size={14} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-stroke-divider">
                                {selectedTeam.members.length >= 4 ? (
                                    <div className="text-center text-text-muted text-sm">Team is full</div>
                                ) : requestSent.includes(selectedTeam.id) ? (
                                    <div className="text-center text-green-400 text-sm flex items-center justify-center gap-2">
                                        <CheckCircle size={16} /> Request Already Sent
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => handleRequestJoin(selectedTeam.id, selectedTeam.name)}
                                        className="w-full"
                                    >
                                        <UserPlus size={16} className="mr-2" />
                                        Request to Join
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

