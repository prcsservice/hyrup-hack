"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Team } from "@/context/TeamContext";
import { Button } from "@/components/ui/Button";
import { TeamPreview } from "@/components/judge/TeamPreview";
import { ArrowLeft, ShieldAlert, CheckCircle, Ban } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function AdminTeamDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchTeam = async () => {
            if (!params?.teamId) return;
            const docRef = doc(db, "teams", params.teamId as string);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setTeam({ id: snap.id, ...snap.data() } as Team);
            } else {
                showToast("Team not found", "error");
                router.push('/admin/users');
            }
            setLoading(false);
        };
        fetchTeam();
    }, [params?.teamId, router, showToast]);

    const toggleShortlist = async () => {
        if (!team) return;
        setActionLoading(true);
        try {
            const newValue = !team.shortlisted;
            await updateDoc(doc(db, "teams", team.id), { shortlisted: newValue });
            setTeam({ ...team, shortlisted: newValue });
            showToast(`Team ${newValue ? 'shortlisted' : 'removed from shortlist'}`, "success");
        } catch (error) {
            console.error(error);
            showToast("Action failed", "error");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-text-muted animate-pulse">Loading Team Data...</div>;
    if (!team) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors">
                <ArrowLeft size={16} /> Back to Registry
            </button>

            {/* Admin Controls Header */}
            <div className="bg-bg-secondary border border-stroke-primary p-6 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                        {team.name}
                        {team.shortlisted && (
                            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full uppercase font-mono tracking-widest flex items-center gap-1">
                                <CheckCircle size={12} /> Shortlisted
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-text-secondary font-mono mt-1">ID: {team.id}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={team.shortlisted ? "secondary" : "primary"}
                        onClick={toggleShortlist}
                        disabled={actionLoading}
                    >
                        {team.shortlisted ? 'Revoke Shortlist' : 'Force Shortlist'}
                    </Button>
                    {/* Placeholder for Disqualify - logic same as updateDoc but maybe a new status field */}
                    <Button size="sm" variant="secondary" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                        <Ban size={16} className="mr-2" /> Disqualify
                    </Button>
                </div>
            </div>

            {/* Content Reuse */}
            <div className="bg-bg-secondary border border-stroke-primary p-8 rounded-sm">
                <div className="mb-8 p-4 bg-bg-tertiary rounded-sm">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><ShieldAlert size={16} className="text-accent" /> Members</h3>
                    <div className="space-y-1">
                        {team.members.map((m: any) => (
                            <div key={m.uid} className="flex justify-between text-sm text-text-secondary">
                                <span>{m.displayName || m.email}</span>
                                <span className="font-mono text-xs text-text-muted">{m.role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <TeamPreview team={team} />
            </div>
        </div>
    );
}
