"use client";

import { useTeam } from "@/context/TeamContext";
import { TeamCard } from "@/components/dashboard/TeamCard";
import { JoinRequestsPanel } from "@/components/dashboard/JoinRequestsPanel";
import { CreateTeamForm } from "@/components/dashboard/CreateTeamForm";
import { JoinTeamForm } from "@/components/dashboard/JoinTeamForm";
import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function TeamPage() {
    return <TeamContent />;
}

function TeamContent() {
    const { team, loading } = useTeam();
    const [mode, setMode] = useState<"choose" | "create" | "join">("choose");

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // If user has a team, show team card
    if (team) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0 border-stroke-divider"
                        >
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <Users size={20} className="text-accent" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold">My Team</h1>
                        </div>
                        <p className="text-text-secondary font-mono text-sm">
                            SQUADRON: <span className="text-accent">{team.name}</span>
                        </p>
                    </div>
                </header>

                {/* Team Card */}
                <TeamCard />

                {/* Join Requests Panel - Only visible to team leader */}
                <div className="mt-6">
                    <JoinRequestsPanel />
                </div>
            </div>
        );
    }

    // No team - show create/join options
    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8">
                <Link href="/dashboard">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 border-stroke-divider"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-accent" />
                        <h1 className="text-2xl md:text-3xl font-display font-bold">Join a Team</h1>
                    </div>
                    <p className="text-text-secondary text-sm">
                        Create or join a team to participate in the hackathon
                    </p>
                </div>
            </header>

            {mode === "choose" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid gap-4 md:grid-cols-2"
                >
                    {/* Create Team Option */}
                    <button
                        onClick={() => setMode("create")}
                        className="p-8 bg-bg-secondary border border-stroke-primary hover:border-accent transition-colors text-left group"
                    >
                        <div className="w-14 h-14 bg-accent/10 border border-accent/30 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                            <Plus size={24} className="text-accent" />
                        </div>
                        <h3 className="text-xl font-display font-bold mb-2">Create Team</h3>
                        <p className="text-text-secondary text-sm">
                            Start your own squadron and invite teammates
                        </p>
                    </button>

                    {/* Join Team Option */}
                    <button
                        onClick={() => setMode("join")}
                        className="p-8 bg-bg-secondary border border-stroke-primary hover:border-accent transition-colors text-left group"
                    >
                        <div className="w-14 h-14 bg-accent/10 border border-accent/30 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                            <UserPlus size={24} className="text-accent" />
                        </div>
                        <h3 className="text-xl font-display font-bold mb-2">Join Team</h3>
                        <p className="text-text-secondary text-sm">
                            Enter an invite code to join an existing team
                        </p>
                    </button>
                </motion.div>
            )}

            {mode === "create" && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <button
                        onClick={() => setMode("choose")}
                        className="text-sm text-text-muted hover:text-white mb-4 flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to options
                    </button>
                    <CreateTeamForm />
                </motion.div>
            )}

            {mode === "join" && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <button
                        onClick={() => setMode("choose")}
                        className="text-sm text-text-muted hover:text-white mb-4 flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to options
                    </button>
                    <JoinTeamForm />
                </motion.div>
            )}
        </div>
    );
}
