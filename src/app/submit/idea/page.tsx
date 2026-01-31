"use client";

import { useRouter } from "next/navigation";
import { SubmissionProvider, useSubmission } from "@/context/SubmissionContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Stepper } from "@/components/submission/Stepper";
import { AutoSaver } from "@/components/submission/AutoSaver";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Lightbulb, Lock } from "lucide-react";
import { useTeam } from "@/context/TeamContext";
import { useEffect } from "react";

// Step Components
import { ProblemStep } from "@/components/submission/steps/ProblemStep";
import { SolutionStep } from "@/components/submission/steps/SolutionStep";
import { ImpactStep } from "@/components/submission/steps/ImpactStep";
import { ReviewStep } from "@/components/submission/steps/ReviewStep";

export default function SubmissionPage() {
    return (
        <DashboardLayout showChat={false}>
            <SubmissionProvider>
                <SubmissionContent />
            </SubmissionProvider>
        </DashboardLayout>
    );
}

function SubmissionContent() {
    const router = useRouter();
    const { step, setStep, submit, status } = useSubmission();
    const { team, isTeamLeader, loading } = useTeam();

    // Redirect if no team
    useEffect(() => {
        if (!loading && !team) {
            router.push('/dashboard');
        }
    }, [team, loading, router]);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);
    const handleSubmit = () => {
        submit(() => {
            router.push('/dashboard');
        });
    };

    if (loading) return <div>Loading...</div>;
    if (!team) return null; // Will redirect

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div className="flex items-start gap-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-1 h-8 w-8 p-0 border-stroke-divider"
                        onClick={() => router.push('/dashboard')}
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Lightbulb size={20} className="text-accent" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold">Idea Submission</h1>
                        </div>
                        <p className="text-text-secondary text-sm">Phase 1: Concept Validation</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!isTeamLeader && (
                        <div className="flex items-center gap-2 text-amber-500 text-sm bg-amber-500/10 px-3 py-1.5 rounded border border-amber-500/20">
                            <Lock size={14} />
                            <span>View Only Mode (Member)</span>
                        </div>
                    )}
                    {isTeamLeader && <AutoSaver />}
                </div>
            </div>

            {/* Stepper */}
            <Stepper />

            {/* Dynamic Form Area - Disable interactions if not leader */}
            <div className={`
                bg-bg-secondary/30 border border-stroke-divider p-6 md:p-8 lg:p-12 backdrop-blur-sm min-h-[400px]
                ${!isTeamLeader ? 'pointer-events-none opacity-80' : ''}
            `}>
                {step === 1 && <ProblemStep />}
                {step === 2 && <SolutionStep />}
                {step === 3 && <ImpactStep />}
                {step === 4 && <ReviewStep />}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center mt-8">
                <Button
                    variant="secondary"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="w-28 sm:w-32"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>

                {step < 4 ? (
                    <Button onClick={handleNext} className="w-28 sm:w-32">
                        Next <ArrowRight size={16} className="ml-2" />
                    </Button>
                ) : (
                    isTeamLeader ? (
                        <Button
                            onClick={handleSubmit}
                            className={`w-40 sm:w-48 text-white border-transparent ${status === 'submitted' ? 'bg-accent hover:bg-accent/80' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                            {status === 'submitted' ? 'Update Idea' : 'Submit Idea'}
                        </Button>
                    ) : (
                        <div className="text-sm text-text-muted italic">
                            Only Team Leader can submit
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
