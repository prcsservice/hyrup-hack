"use client";

import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import { CreateTeamForm } from "@/components/dashboard/CreateTeamForm";
import { JoinTeamForm } from "@/components/dashboard/JoinTeamForm";
import { TeamCard } from "@/components/dashboard/TeamCard";
import { TeamSearch } from "@/components/dashboard/TeamSearch";
import { NotificationFeed } from "@/components/dashboard/NotificationFeed";
import { MissionCountdown } from "@/components/dashboard/MissionCountdown";
import { QuickActionsRail } from "@/components/dashboard/QuickActionsRail";
import { GrowthWidgets } from "@/components/dashboard/GrowthWidgets";
import { ProgressMilestones } from "@/components/dashboard/ProgressMilestones";
import { SocialCardGenerator } from "@/components/social/SocialCardGenerator";
import { CountdownTimer } from "@/components/dashboard/CountdownTimer";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { NotificationPrompt } from "@/components/notifications/NotificationPrompt";
import { useDriverTour } from "@/hooks/useDriverTour";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Target, Zap, CheckCircle, Trophy, Rocket, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    return <DashboardContent />;
}

function DashboardContent() {
    const { user } = useAuth();
    const { team, loading, createTeam } = useTeam();
    const router = useRouter();

    // Initialize Driver.js onboarding tour
    useDriverTour();

    const handleGoSolo = async () => {
        if (!user?.displayName) return;
        const soloName = `${user.displayName.split(' ')[0]}'s Wrapper`;
        const suffix = Math.floor(Math.random() * 1000);
        await createTeam(`${soloName} #${suffix}`, { color: '#00C853', emoji: '👤' }, ['Solo'], "Solo Hacker");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-text-muted font-mono animate-pulse">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    Running Diagnostics...
                </div>
            </div>
        );
    }

    // No team state - Onboarding
    if (!team) {
        return (
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="text-center py-6">
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                        Welcome to <span className="text-accent">FixForward</span>
                    </h1>
                    <p className="text-text-secondary max-w-md mx-auto">
                        Create or join a squad to start your hackathon journey
                    </p>
                </div>

                {/* Notification Prompt */}
                <NotificationPrompt />

                {/* Main Grid - Create/Join */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Create Squad Card */}
                    <div className="lg:col-span-7 bg-bg-secondary border border-stroke-primary p-6 lg:p-8 relative overflow-hidden group">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-700" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={18} className="text-accent" />
                                <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Create New</span>
                            </div>
                            <CreateTeamForm />
                        </div>
                    </div>

                    {/* Join/Search Column */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Join with Code */}
                        <div className="bg-bg-secondary border border-stroke-primary p-6">
                            <h3 className="font-display font-bold text-lg mb-1">Have an Invite?</h3>
                            <p className="text-text-muted text-xs mb-4">Enter the 6-character code.</p>
                            <JoinTeamForm />
                        </div>

                        {/* Go Solo Option */}
                        <div className="text-center py-2">
                            <button
                                onClick={handleGoSolo}
                                className="text-xs text-text-muted hover:text-accent underline decoration-dotted underline-offset-4 transition-colors"
                            >
                                I want to go solo
                            </button>
                        </div>

                        {/* Search Teams */}
                        <div className="bg-bg-tertiary border border-stroke-divider p-6">
                            <div className="flex items-center gap-2 mb-1">
                                <Zap size={14} className="text-accent" />
                                <h3 className="font-display font-bold text-base">Scout for Teams</h3>
                            </div>
                            <p className="text-text-secondary text-xs mb-4">Find squads looking for your skills.</p>
                            <TeamSearch />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Has team - Main Dashboard
    return (
        <div className="space-y-4" data-tour="welcome">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold">Command Center</h1>
                    <p className="text-text-secondary text-sm font-mono">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                        {user?.displayName} // {team.name}
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <div className="text-right mr-2">
                        <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Status</div>
                        <div className="text-accent text-sm font-bold">ACTIVE</div>
                    </div>
                </div>
            </div>

            {/* Notification Prompt */}
            <NotificationPrompt />

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
            <div data-tour="actions">
                <QuickActionsRail />
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Team Card - Main */}
                <div className="lg:col-span-8" data-tour="team">
                    <TeamCard />
                </div>

                {/* Next Mission Card */}
                <div className="lg:col-span-4 bg-bg-secondary border border-stroke-primary p-6 flex flex-col justify-between group hover:border-accent transition-colors">
                    {team.shortlisted ? (
                        !team.prototype ? (
                            // PHASE 2: PROTOTYPE
                            <>
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="p-1.5 bg-accent/20 text-accent"><Rocket size={18} /></span>
                                        <span className="text-[10px] font-mono text-text-muted uppercase">Round 2 Unlocked</span>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-white">Submit Prototype</h3>
                                    <p className="text-text-secondary text-xs mt-1">Upload your artifacts to qualify for the pitch.</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-stroke-divider flex justify-between items-center">
                                    <MissionCountdown phase="prototype" />
                                    <Button size="sm" className="h-8 text-xs" onClick={() => router.push('/submit/prototype')}>
                                        Launch <ArrowRight size={12} className="ml-1" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            // PHASE 3: PITCH
                            <>
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="p-1.5 bg-accent/20 text-accent"><Trophy size={18} /></span>
                                        <span className="text-[10px] font-mono text-text-muted uppercase">Shortlisted</span>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-white">Live Pitch</h3>
                                    <p className="text-text-secondary text-xs mt-1">Book your presentation slot now.</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-stroke-divider flex justify-between items-center">
                                    <span className="text-xs font-mono text-accent">ACTION REQUIRED</span>
                                    <Button size="sm" className="h-8 text-xs" onClick={() => router.push('/pitch')}>
                                        Manage <ArrowRight size={12} className="ml-1" />
                                    </Button>
                                </div>
                            </>
                        )
                    ) : team.submissionStatus === 'submitted' ? (
                        // SUBMITTED - WAITING
                        <>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="p-1.5 bg-green-500/20 text-green-500"><CheckCircle size={18} /></span>
                                    <span className="text-[10px] font-mono text-text-muted uppercase">Status</span>
                                </div>
                                <h3 className="text-xl font-display font-bold text-white">Idea Submitted</h3>
                                <p className="text-text-secondary text-xs mt-1">Your concept is under review by the judges.</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-stroke-divider flex justify-between items-center">
                                <span className="text-xs font-mono text-green-500">RECEIVED</span>
                                <Button size="sm" variant="secondary" onClick={() => router.push('/submit/idea')} className="h-8 text-xs">
                                    View <ArrowRight size={12} className="ml-1" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        // PHASE 1: SUBMIT IDEA
                        <>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="p-1.5 bg-bg-tertiary text-accent"><Target size={18} /></span>
                                    <span className="text-[10px] font-mono text-text-muted uppercase">Priority</span>
                                </div>
                                <h3 className="text-xl font-display font-bold">Submit Idea</h3>
                                <p className="text-text-secondary text-xs mt-1">Validate your problem statement before the deadline.</p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-stroke-divider flex justify-between items-center">
                                <MissionCountdown phase="idea" />
                                <Button size="sm" className="h-8 text-xs" onClick={() => router.push('/submit/idea')}>
                                    Start <ArrowRight size={12} className="ml-1" />
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                {/* Notifications & Growth */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <NotificationFeed />
                    <GrowthWidgets />
                    <SocialCardGenerator />
                </div>
            </div>
        </div>
    );
}
