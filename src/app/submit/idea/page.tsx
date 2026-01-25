"use client";

import { useRouter } from "next/navigation";
import { SubmissionProvider, useSubmission } from "@/context/SubmissionContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Stepper } from "@/components/submission/Stepper";
import { AutoSaver } from "@/components/submission/AutoSaver";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Step Components
import { ProblemStep } from "@/components/submission/steps/ProblemStep";
import { SolutionStep } from "@/components/submission/steps/SolutionStep";
import { ImpactStep } from "@/components/submission/steps/ImpactStep";
import { ReviewStep } from "@/components/submission/steps/ReviewStep";

import { TeamProvider } from "@/context/TeamContext";

export default function SubmissionPage() {
    return (
        <TeamProvider>
            <SubmissionProvider>
                <SubmissionLayout />
            </SubmissionProvider>
        </TeamProvider>
    );
}

function SubmissionLayout() {
    const router = useRouter();
    const { step, setStep, submit, status } = useSubmission();

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);
    const handleSubmit = () => {
        submit(() => {
            router.push('/dashboard');
        });
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-6">

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-8">
                        <div className="flex items-start gap-4">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="mt-1 h-8 w-8 p-0 rounded-full border-stroke-divider"
                                onClick={() => router.push('/dashboard')}
                                title="Back to Dashboard"
                            >
                                <ArrowLeft size={16} />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-display font-bold">Idea Submission</h1>
                                <p className="text-text-secondary">Phase 1: Concept Validation</p>
                            </div>
                        </div>
                        <AutoSaver />
                    </div>

                    <Stepper />

                    {/* Dynamic Form Area */}
                    <div className="bg-bg-secondary/30 border border-stroke-divider p-8 lg:p-12 rounded-sm backdrop-blur-sm min-h-[400px]">
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
                            className="w-32"
                        >
                            <ArrowLeft size={16} className="mr-2" /> Back
                        </Button>

                        {step < 4 ? (
                            <Button onClick={handleNext} className="w-32">
                                Next <ArrowRight size={16} className="ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                className={`w-48 text-white border-transparent ${status === 'submitted' ? 'bg-accent hover:bg-accent/80' : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {status === 'submitted' ? 'Update Idea' : 'Submit Idea'}
                            </Button>
                        )}
                    </div>

                </div>
            </div>
        </ProtectedRoute>
    );
}
