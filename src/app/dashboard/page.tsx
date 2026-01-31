"use client";

import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { TeamProvider, useTeam } from "@/context/TeamContext";
import { CreateTeamForm } from "@/components/dashboard/CreateTeamForm";
import { JoinTeamForm } from "@/components/dashboard/JoinTeamForm";
import { TeamCard } from "@/components/dashboard/TeamCard";
import { TeamSearch } from "@/components/dashboard/TeamSearch";
import { NotificationFeed } from "@/components/dashboard/NotificationFeed";
import { MissionCountdown } from "@/components/dashboard/MissionCountdown";
import { ProgressBar } from "@/components/dashboard/ProgressBar";
import { QuickActionsRail } from "@/components/dashboard/QuickActionsRail";
import { GrowthWidgets } from "@/components/dashboard/GrowthWidgets";
import { ProgressMilestones } from "@/components/dashboard/ProgressMilestones";
import { CountdownTimer } from "@/components/dashboard/CountdownTimer";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { TeamChat } from "@/components/dashboard/TeamChat";
import { SocialCardGenerator } from "@/components/social/SocialCardGenerator";
import { FAQBot } from "@/components/layout/FAQBot";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { ErrorBoundary } from "@/components/providers/ErrorBoundary";
import { NotificationPrompt } from "@/components/notifications/NotificationPrompt";
import { ArrowRight, Target, Zap, CheckCircle, Info, Trophy, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
    return (
        <TeamProvider>
            <DashboardContent />
        </TeamProvider>
    );
}

function DashboardContent() {
    const { user, signOut } = useAuth();
    const { team, loading, createTeam } = useTeam();
    const router = useRouter();

    const handleGoSolo = async () => {
        if (!user?.displayName) return;
        const soloName = `${user.displayName.split(' ')[0]}'s Wrapper`;

        // Ensure name is unique or append random string if needed (simple retry logic could be better but basic append works for MVP)
        // Actually, createTeam logic checks duplicates. Let's just append a random suffix to be safe for solo mode.
        const suffix = Math.floor(Math.random() * 1000);
        await createTeam(`${soloName} #${suffix}`, { color: '#00C853', emoji: '👤' }, ['Solo'], "Solo Hacker");
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-bg-primary p-4 flex flex-col">

                {/* Header - Compact */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 shrink-0">
                    <div>
                        <h1 className="text-3xl font-display font-bold mb-1">Command Center</h1>
                        <button
                            onClick={() => router.push('/dashboard/profile')}
                            className="flex items-center gap-2 text-text-secondary font-mono text-xs hover:text-white transition-colors group"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse group-hover:scale-125 transition-transform" />
                            ONLINE // {user?.displayName} <span className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-1">(Edit Profile)</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right mr-2">
                            <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Global Status</div>
                            <div className="text-accent text-sm font-bold">REGISTRATION OPEN</div>
                        </div>
                        <Button variant="secondary" size="sm" onClick={signOut} className="h-9 px-4">
                            Disconnect
                        </Button>
                    </div>
                </header>

                {/* Push Notification Prompt - Shows for all users */}
                <NotificationPrompt />

                {/* Dynamic Grid Layout */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-text-muted font-mono animate-pulse">Running Diagnostics...</div>
                    ) : team ? (
                        /* 🟢 SQUAD MODE: BENTO GRID */
                        <div className="flex flex-col gap-4 h-full">
                            {/* Progress Bar at top */}
                            <ProgressBar className="shrink-0 bg-bg-secondary border border-stroke-primary py-2 px-4 rounded-sm" />

                            {/* Scrollable Container (Quick Actions + Grid) */}
                            <div data-lenis-prevent className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-2 pb-2 scrollbar-thin scrollbar-thumb-stroke-secondary scrollbar-track-transparent">
                                {/* Progress Milestones */}
                                <div data-tour="progress">
                                    <ProgressMilestones />
                                </div>

                                {/* Countdown Timer */}
                                <div data-tour="countdown">
                                    <CountdownTimer />
                                </div>

                                {/* Activity Feed */}
                                <ActivityFeed />

                                {/* Quick Actions */}
                                <QuickActionsRail />

                                {/* Main Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                                    {/* 1. TEAM IDENTITY (Hero) - Spans 8 cols */}
                                    <div className="md:col-span-8 md:row-span-2 h-full" data-tour="team">
                                        <TeamCard />
                                    </div>

                                    {/* 2. NEXT MISSION (Status) - Spans 4 cols */}
                                    <div className="md:col-span-4 bg-bg-secondary border border-stroke-primary p-6 flex flex-col justify-between group hover:border-accent transition-colors h-full">
                                        {team.shortlisted ? (
                                            !team.prototype ? (
                                                /* 🟢 PHASE 2: PROTOTYPE SUBMISSION (Shortlisted but no prototype yet) */
                                                <>
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="p-1.5 bg-accent/20 text-accent rounded-sm"><Rocket size={18} /></span>
                                                            <span className="text-[10px] font-mono text-text-muted uppercase">Round 2 Unlocked</span>
                                                        </div>
                                                        <h3 className="text-xl font-display font-bold text-white">Submit Prototype</h3>
                                                        <p className="text-text-secondary text-xs mt-1">Upload your artifacts to qualify for the pitch.</p>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-stroke-divider flex justify-between items-center">
                                                        <MissionCountdown phase="prototype" />
                                                        <Button size="sm" className="rounded-full h-8 text-xs" onClick={() => router.push('/submit/prototype')}>
                                                            Launch <ArrowRight size={12} className="ml-1" />
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                /* 🟢 PHASE 3: LIVE PITCH (Prototype submitted) */
                                                <>
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="p-1.5 bg-accent/20 text-accent rounded-sm"><Trophy size={18} /></span>
                                                            <span className="text-[10px] font-mono text-text-muted uppercase">Shortlisted</span>
                                                        </div>
                                                        <h3 className="text-xl font-display font-bold text-white">Live Pitch</h3>
                                                        <p className="text-text-secondary text-xs mt-1">Book your presentation slot now.</p>
                                                    </div>
                                                    <div className="mt-4 pt-4 border-t border-stroke-divider flex justify-between items-center">
                                                        <span className="text-xs font-mono text-accent">ACTION REQUIRED</span>
                                                        <Button size="sm" className="rounded-full h-8 text-xs" onClick={() => router.push('/pitch')}>
                                                            Manage <ArrowRight size={12} className="ml-1" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )
                                        ) : team.submissionStatus === 'submitted' ? (
                                            <>
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="p-1.5 bg-green-500/20 text-green-500 rounded-sm"><CheckCircle size={18} /></span>
                                                        <span className="text-[10px] font-mono text-text-muted uppercase">Status</span>
                                                    </div>
                                                    <h3 className="text-xl font-display font-bold text-white">Idea Submitted</h3>
                                                    <p className="text-text-secondary text-xs mt-1">Your concept is under review by the judges.</p>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-stroke-divider flex justify-between items-center">
                                                    <span className="text-xs font-mono text-green-500">RECEIVED</span>
                                                    <Button size="sm" variant="secondary" onClick={() => router.push('/submit/idea')} className="rounded-full h-8 text-xs hover:bg-bg-tertiary">
                                                        View <ArrowRight size={12} className="ml-1" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="p-1.5 bg-bg-tertiary rounded-sm text-accent"><Target size={18} /></span>
                                                        <span className="text-[10px] font-mono text-text-muted uppercase">Priority</span>
                                                    </div>
                                                    <h3 className="text-xl font-display font-bold">Submit Idea</h3>
                                                    <p className="text-text-secondary text-xs mt-1">Validate your problem statement before the deadline.</p>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-stroke-divider flex justify-between items-center">
                                                    <MissionCountdown phase="idea" />
                                                    <Button size="sm" className="rounded-full h-8 text-xs" onClick={() => router.push('/submit/idea')}>
                                                        Start <ArrowRight size={12} className="ml-1" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="md:col-span-4 h-full space-y-4">
                                        <NotificationFeed />
                                        <GrowthWidgets />
                                    </div>

                                </div>
                            </div>
                        </div>
                    ) : (
                        /* 🟡 SOLO MODE: ONBOARDING GRID */
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-8">

                            {/* 1. CREATE SQUAD (Main Action) - Left 7 cols */}
                            <div className="md:col-span-7 lg:col-span-8 bg-bg-secondary border border-stroke-primary p-6 lg:p-10 relative overflow-hidden group min-h-[400px] flex flex-col">
                                {/* Ambient Background */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-700" />

                                <div className="relative z-10 max-w-lg mx-auto w-full flex-1 flex flex-col justify-center">
                                    <CreateTeamForm />
                                </div>
                            </div>

                            {/* 2. JOIN / SEARCH (Side Actions) - Right 5 cols */}
                            <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4">

                                {/* Join Card */}
                                <div className="bg-bg-secondary border border-stroke-primary p-6 flex-1 min-h-[180px]">
                                    <JoinTeamForm />
                                </div>
                                <div className="text-center">
                                    <button onClick={handleGoSolo} className="text-xs text-text-muted hover:text-accent underline decoration-dotted underline-offset-4">
                                        I want to go solo
                                    </button>
                                </div>

                                {/* Search Card */}
                                <div className="bg-bg-tertiary border border-stroke-divider p-6 flex-1 min-h-[180px]">
                                    <div className="mb-3">
                                        <h3 className="font-display font-bold text-base mb-1 flex items-center gap-2">
                                            <Zap size={14} className="text-accent" />
                                            Scout for Teams
                                        </h3>
                                        <p className="text-text-secondary text-xs">Find squads looking for your skills.</p>
                                    </div>
                                    <TeamSearch />
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Floating Components */}
                <div data-tour="chat">
                    <TeamChat />
                </div>
                <div data-tour="faq">
                    <FAQBot />
                </div>

                {/* Onboarding Tour */}
                <OnboardingTour />

            </div>
        </ProtectedRoute>
    );
}
