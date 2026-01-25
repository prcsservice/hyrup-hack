"use client";

import { useAuth } from "@/context/AuthContext";
import { useJudge, ScoreData } from "@/hooks/useJudge";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { Team } from "@/context/TeamContext";
import { TeamPreview } from "@/components/judge/TeamPreview";
import { RubricInput } from "@/components/judge/RubricInput";
import { useToast } from "@/context/ToastContext";

export default function GradePage() {
    return (
        <ProtectedRoute>
            <GradeContent />
        </ProtectedRoute>
    );
}

const INITIAL_SCORE: ScoreData = {
    criteria: {
        problem: 0,
        originality: 0,
        feasibility: 0,
        prototype: 0,
        impact: 0,
        pitch: 0
    },
    total: 0,
    feedback: ""
};

function GradeContent() {
    const { role } = useAuth();
    const router = useRouter();
    const params = useParams();
    const { fetchTeamById, submitScore, getExistingScore, loading: hookLoading } = useJudge();
    const { showToast } = useToast();

    const [team, setTeam] = useState<Team | null>(null);
    const [score, setScore] = useState<ScoreData>(INITIAL_SCORE);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (role !== 'judge' && role !== 'admin') {
            router.push('/dashboard');
        }
    }, [role, router]);

    useEffect(() => {
        const load = async () => {
            if (!params?.teamId) return;
            const tId = params.teamId as string;

            // Fetch Team
            const teamData = await fetchTeamById(tId);
            if (!teamData) {
                showToast("Team not found", "error");
                router.push('/judges');
                return;
            }
            setTeam(teamData);

            // Fetch Existing Score
            const existing = await getExistingScore(tId);
            if (existing) setScore(existing);

            setLoading(false);
        };
        load();
    }, [params?.teamId]);

    const handleScoreChange = (key: keyof typeof score.criteria, val: number) => {
        const newCriteria = { ...score.criteria, [key]: val };
        const total = Object.values(newCriteria).reduce((a, b) => a + b, 0);
        setScore({ ...score, criteria: newCriteria, total });
    };

    const handleSubmit = async () => {
        if (!team) return;
        setSubmitting(true);
        try {
            await submitScore(team.id, score);
            router.push('/judges');
        } catch (error) {
            // Toast handled in hook
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || hookLoading) return <div className="h-screen flex items-center justify-center text-text-muted">Loading Evaluation Data...</div>;
    if (!team) return null;

    return (
        <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-stroke-primary flex items-center justify-between px-6 bg-bg-secondary shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/judges')} className="text-text-muted hover:text-white transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="font-bold text-white leading-tight">{team.name}</h1>
                        <span className="text-[10px] text-text-secondary font-mono uppercase">Judging Room</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-text-muted uppercase font-mono">Total Score</div>
                        <div className={`text-2xl font-display font-bold ${score.total >= 50 ? 'text-accent' : 'text-text-muted'}`}>
                            {score.total} <span className="text-sm text-text-muted font-normal">/ 100</span>
                        </div>
                    </div>
                    <Button onClick={handleSubmit} disabled={submitting} className="w-32">
                        {submitting ? 'Saving...' : (
                            <span className="flex items-center gap-2">Submit <CheckCircle size={14} /></span>
                        )}
                    </Button>
                </div>
            </header>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT: Artifacts (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-primary">
                    <TeamPreview team={team} />
                </div>

                {/* RIGHT: Scoring (Scrollable) */}
                <div className="w-full md:w-[400px] lg:w-[450px] bg-bg-secondary border-l border-stroke-primary flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <h3 className="font-bold text-white border-b border-stroke-divider pb-2 sticky top-0 bg-bg-secondary z-10">
                            Assessment Rubric
                        </h3>

                        <RubricInput
                            label="Problem Statement"
                            description="Clarity, depth of research, and validity of the problem."
                            max={20}
                            value={score.criteria.problem}
                            onChange={(v) => handleScoreChange('problem', v)}
                        />
                        <RubricInput
                            label="Originality"
                            description="Uniqueness of the approach vs existing solutions."
                            max={15}
                            value={score.criteria.originality}
                            onChange={(v) => handleScoreChange('originality', v)}
                        />
                        <RubricInput
                            label="Feasibility"
                            description="Technical viability and execution plan realism."
                            max={15}
                            value={score.criteria.feasibility}
                            onChange={(v) => handleScoreChange('feasibility', v)}
                        />
                        <RubricInput
                            label="Prototype Quality"
                            description="Functionality, design, and completeness of MVP."
                            max={15}
                            value={score.criteria.prototype}
                            onChange={(v) => handleScoreChange('prototype', v)}
                        />
                        <RubricInput
                            label="Impact potential"
                            description="Potential for scale and social/economic benefit."
                            max={15}
                            value={score.criteria.impact}
                            onChange={(v) => handleScoreChange('impact', v)}
                        />
                        <RubricInput
                            label="Live Pitch"
                            description="Delivery, visuals, Q&A handling."
                            max={20}
                            value={score.criteria.pitch}
                            onChange={(v) => handleScoreChange('pitch', v)}
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white">Private Feedback</label>
                            <p className="text-xs text-text-secondary">Notes for internal admins/judges only.</p>
                            <textarea
                                className="w-full h-32 bg-bg-tertiary border border-stroke-primary p-3 rounded-sm text-sm text-white focus:border-accent outline-none resize-none"
                                placeholder="Write your assessment here..."
                                value={score.feedback}
                                onChange={(e) => setScore({ ...score, feedback: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
