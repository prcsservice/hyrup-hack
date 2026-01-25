"use client";

import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Lock, Trophy } from "lucide-react";
import { usePitch } from "@/hooks/usePitch";
import { SlotPicker } from "@/components/pitch/SlotPicker";
import { PitchDashboard } from "@/components/pitch/PitchDashboard";
import { SeedSlotsButton } from "@/components/pitch/SeedSlotsButton";
import { useToast } from "@/context/ToastContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PitchPage() {
    return (
        <ProtectedRoute>
            <PitchContent />
        </ProtectedRoute>
    );
}

function PitchContent() {
    const { user, signOut } = useAuth();
    const { team, loading: teamLoading } = useTeam();
    const { slots, mySlot, loading: pitchLoading, bookSlot, formattedDate, formattedTime } = usePitch();
    const router = useRouter();
    const { showToast } = useToast();

    // Loading State
    if (teamLoading || pitchLoading) {
        return (
            <div className="h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-text-muted font-mono animate-pulse">Establishing Secure Connection...</div>
            </div>
        );
    }

    // No Team State
    if (!team) {
        return (
            <div className="h-screen bg-bg-primary flex flex-col items-center justify-center p-4 text-center">
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
        window.location.reload(); // Quick refresh to pick up state
    };

    // 1. NOT SHORTLISTED
    if (!team.shortlisted) {
        return (
            <div className="min-h-screen bg-bg-primary p-4 md:p-8 flex flex-col">
                <Header user={user} signOut={signOut} />

                <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
                    <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Trophy size={40} className="text-yellow-500/50" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">Under Review</h1>
                    <p className="text-text-secondary text-lg leading-relaxed mb-8">
                        The judges are currently reviewing all Phase 1 submissions.
                        Shortlisted teams will unlock this page to book their live pitch slots.
                    </p>
                    <div className="p-4 bg-bg-secondary border border-stroke-primary rounded-sm w-full font-mono text-sm text-text-muted">
                        STATUS: PENDING RESULTS
                    </div>

                    {/* DEV ONLY BUTTON */}
                    <div className="mt-12 opacity-50 hover:opacity-100">
                        <Button variant="secondary" size="sm" onClick={simulateShortlist} className="text-[10px] h-6">
                            [DEV] Force Shortlist
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. SHORTLISTED
    return (
        <div className="min-h-screen bg-bg-primary p-4 md:p-8 flex flex-col relative">
            <Header user={user} signOut={signOut} />

            <div className="flex-1 max-w-5xl mx-auto w-full pt-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Live Pitch Desk</h1>
                    <p className="text-text-secondary font-mono text-sm">
                        TEAM: <span className="text-accent">{team.name}</span> // STATUS: {mySlot ? "BOOKED" : "ACTION REQUIRED"}
                    </p>
                </div>

                {mySlot ? (
                    <PitchDashboard
                        slot={mySlot}
                        formatTime={formattedTime}
                        formatDate={formattedDate}
                    />
                ) : (
                    <div className="animate-enter">
                        <div className="p-4 bg-accent/10 border border-accent/20 rounded-sm mb-8 flex items-start gap-3">
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
            </div>

            <SeedSlotsButton />
        </div>
    );
}

function Header({ user, signOut }: { user: any, signOut: any }) {
    const router = useRouter();
    return (
        <header className="flex items-center justify-between pointer-events-auto">
            <button onClick={() => router.push('/dashboard')} className="flex items-center text-text-muted hover:text-white transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                <span className="font-mono text-sm uppercase">Back to Base</span>
            </button>
            <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                    <div className="text-[10px] text-text-muted font-mono uppercase">User</div>
                    <div className="text-sm font-bold">{user?.displayName}</div>
                </div>
            </div>
        </header>
    );
}
