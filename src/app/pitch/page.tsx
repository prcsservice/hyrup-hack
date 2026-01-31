"use client";

import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Lock, Trophy, Calendar } from "lucide-react";
import { usePitch } from "@/hooks/usePitch";
import { SlotPicker } from "@/components/pitch/SlotPicker";
import { PitchDashboard } from "@/components/pitch/PitchDashboard";
import { SeedSlotsButton } from "@/components/pitch/SeedSlotsButton";
import { useToast } from "@/context/ToastContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PitchPage() {
    return (
        <DashboardLayout showChat={false}>
            <PitchContent />
        </DashboardLayout>
    );
}

function PitchContent() {
    const { user } = useAuth();
    const { team, loading: teamLoading } = useTeam();
    const { slots, mySlot, loading: pitchLoading, bookSlot, formattedDate, formattedTime } = usePitch();
    const router = useRouter();
    const { showToast } = useToast();

    // Loading State
    if (teamLoading || pitchLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // No Team State
    if (!team) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <Lock size={48} className="text-text-muted mb-4" />
                <h1 className="text-2xl font-display font-bold mb-2">Restricted Access</h1>
                <p className="text-text-secondary mb-6">You need to lead or join a team to access the Pitch System.</p>
                <Button onClick={() => router.push('/dashboard')}>
                    <ArrowLeft size={16} className="mr-2" />
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    // --- DEV TOOL: Simulate Shortlist ---
    const simulateShortlist = async () => {
        if (!team) return;
        await updateDoc(doc(db, "teams", team.id), { shortlisted: true });
        showToast("DEV: Team marked as shortlisted", "success");
        window.location.reload();
    };

    // 1. NOT SHORTLISTED
    if (!team.shortlisted) {
        return (
            <div className="max-w-2xl mx-auto text-center py-16">
                {/* Header */}
                <header className="flex items-center gap-4 mb-12 justify-center">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 border-stroke-divider"
                        onClick={() => router.push('/dashboard')}
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-accent" />
                            <h1 className="text-2xl font-display font-bold">Pitch Desk</h1>
                        </div>
                    </div>
                </header>

                <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                    <Trophy size={40} className="text-yellow-500/50" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Under Review</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-8">
                    The judges are currently reviewing all Phase 1 submissions.
                    Shortlisted teams will unlock this page to book their live pitch slots.
                </p>
                <div className="p-4 bg-bg-secondary border border-stroke-primary w-full font-mono text-sm text-text-muted">
                    STATUS: PENDING RESULTS
                </div>

                {/* DEV ONLY BUTTON */}
                <div className="mt-12 opacity-50 hover:opacity-100">
                    <Button variant="secondary" size="sm" onClick={simulateShortlist} className="text-[10px] h-6">
                        [DEV] Force Shortlist
                    </Button>
                </div>
            </div>
        );
    }

    // 2. SHORTLISTED
    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8">
                <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 border-stroke-divider"
                    onClick={() => router.push('/dashboard')}
                >
                    <ArrowLeft size={16} />
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-accent" />
                        <h1 className="text-2xl md:text-3xl font-display font-bold">Live Pitch Desk</h1>
                    </div>
                    <p className="text-text-secondary font-mono text-sm">
                        TEAM: <span className="text-accent">{team.name}</span> // STATUS: {mySlot ? "BOOKED" : "ACTION REQUIRED"}
                    </p>
                </div>
            </header>

            {mySlot ? (
                <PitchDashboard
                    slot={mySlot}
                    formatTime={formattedTime}
                    formatDate={formattedDate}
                />
            ) : (
                <div className="animate-enter">
                    <div className="p-4 bg-accent/10 border border-accent/20 mb-8 flex items-start gap-3">
                        <div className="p-1 bg-accent/20 rounded-full mt-1">
                            <Lock size={12} className="text-accent" />
                        </div>
                        <div>
                            <h3 className="font-bold text-accent text-sm mb-1">Select Your Slot</h3>
                            <p className="text-text-secondary text-xs">
                                Slots are first-come, first-served. Once booked, you cannot reschedule without admin approval.
                            </p>
                        </div>
                    </div>

                    <SlotPicker
                        slots={slots}
                        onBook={bookSlot}
                        formatTime={formattedTime}
                        formatDate={formattedDate}
                    />
                </div>
            )}

            <SeedSlotsButton />
        </div>
    );
}
