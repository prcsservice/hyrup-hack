"use client";

import { useAuth } from "@/context/AuthContext";
import { useJudge } from "@/hooks/useJudge";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Gavel, FileText, ArrowRight } from "lucide-react";

export default function JudgeDashboard() {
    return (
        <ProtectedRoute>
            <JudgeContent />
        </ProtectedRoute>
    );
}

function JudgeContent() {
    const { user, role, signOut } = useAuth();
    const { assignedTeams, loading } = useJudge();
    const router = useRouter();

    if (role !== 'judge' && role !== 'admin') {
        router.push('/dashboard');
        return null;
    }

    if (loading) {
        return (
            <div className="h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
                <div className="text-text-muted animate-pulse">Loading Assignments...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary p-4 md:p-8 flex flex-col">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-display font-bold flex items-center gap-2">
                        <Gavel size={24} className="text-accent" />
                        Judge Panel
                    </h1>
                    <p className="text-sm text-text-secondary font-mono uppercase tracking-widest mt-1">
                        Welcome, {user?.displayName}
                    </p>
                </div>
                <Button variant="secondary" size="sm" onClick={signOut}>Sign Out</Button>
            </header>

            <div className="flex-1">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignedTeams.map(team => (
                        <div key={team.id} className="bg-bg-secondary border border-stroke-primary p-6 rounded-sm hover:border-accent transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">{team.name}</h3>
                                <span className="px-2 py-1 bg-bg-tertiary text-text-muted text-[10px] uppercase font-mono rounded">
                                    {team.prototype ? "ROUND 2" : "ROUND 1"}
                                </span>
                            </div>

                            <div className="space-y-2 mb-6 text-sm text-text-secondary">
                                <p className="line-clamp-2">{(team as any).problemStatement || "No summary available."}</p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-stroke-divider">
                                <div className="text-xs font-mono text-text-muted">
                                    {team.members.length} Members
                                </div>
                                <Button size="sm" onClick={() => router.push(`/judges/grade/${team.id}`)}>
                                    Evaluate <ArrowRight size={12} className="ml-1" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {assignedTeams.length === 0 && (
                        <div className="col-span-full py-12 text-center border border-dashed border-stroke-divider rounded-sm text-text-secondary">
                            No assignments found. Please check back later.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
