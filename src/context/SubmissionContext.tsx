"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useTeam } from "./TeamContext";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface SubmissionData {
    problemStatement: string;
    problemEvidence: string;
    solutionOverview: string;
    domain: string;
    track: string;
    targetAudience: string;
    impactStats: string;
    fileUrls: string[];
    evidenceFileUrl?: string;
}

interface SubmissionContextType {
    data: SubmissionData;
    updateData: (updates: Partial<SubmissionData>) => void;
    step: number;
    setStep: (step: number) => void;
    status: 'draft' | 'saving' | 'saved' | 'submitted';
    submit: (onSuccess?: () => void) => Promise<void>;
    isTeamLeader: boolean;
    canEditSubmission: boolean;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

const INITIAL_DATA: SubmissionData = {
    problemStatement: "",
    problemEvidence: "",
    solutionOverview: "",
    domain: "",
    track: "",
    targetAudience: "",
    impactStats: "",
    fileUrls: []
};

export function SubmissionProvider({ children }: { children: ReactNode }) {
    const { team, submitIdea, saveSubmission, isTeamLeader, canEditSubmission } = useTeam();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [data, setData] = useState<SubmissionData>(INITIAL_DATA);
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'draft' | 'saving' | 'saved' | 'submitted'>('draft');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (team && !isLoaded) {
            const hasData = team.problemStatement || team.problemEvidence || team.solutionOverview || team.domain;

            if (hasData || team.submissionStatus === 'submitted') {
                setData({
                    problemStatement: team.problemStatement || "",
                    problemEvidence: team.problemEvidence || "",
                    solutionOverview: team.solutionOverview || "",
                    domain: team.domain || "",
                    track: team.track || "",
                    targetAudience: team.targetAudience || "",
                    impactStats: team.impactStats || "",
                    fileUrls: team.fileUrls || [],
                    evidenceFileUrl: team.evidenceFileUrl
                });

                if (team.submissionStatus === 'submitted') {
                    setStatus('submitted');
                    setStep(4);
                } else {
                    setStatus('saved');
                }
            }
            setIsLoaded(true);
        }
    }, [team, isLoaded]);

    // Debounced Autosave - Only for team leaders
    useEffect(() => {
        if (status === 'submitted' || !isLoaded || !canEditSubmission) return;

        const timer = setTimeout(() => {
            if (status === 'draft') {
                console.log("Autosave triggering...", data);
                setStatus('saving');
                saveSubmission(data).then(() => {
                    console.log("Auto-saved to Firestore");
                    setStatus('saved');
                }).catch(err => {
                    console.error("Autosave failed", err);
                    setStatus('draft');
                });
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [data, status, isLoaded, canEditSubmission, saveSubmission]);

    const updateData = (updates: Partial<SubmissionData>) => {
        if (!canEditSubmission) {
            showToast("Only the team leader can edit submissions", "error");
            return;
        }
        setData(prev => ({ ...prev, ...updates }));
        if (status !== 'submitted') setStatus('draft');
    };

    const submit = async (onSuccess?: () => void) => {
        if (!team) {
            showToast("You need a team to submit!", "error");
            return;
        }

        if (!isTeamLeader) {
            showToast("Only the team leader can submit ideas", "error");
            return;
        }

        if (!canEditSubmission) {
            showToast("Submission deadline has passed", "error");
            return;
        }

        setStatus('saving');

        try {
            await submitIdea(data);
            setStatus('submitted');
            showToast("Submission Received! Good luck.", "success");

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Submission failed:", error);
            setStatus('draft');
            showToast("Failed to submit. Please try again.", "error");
        }
    };

    return (
        <SubmissionContext.Provider value={{
            data,
            updateData,
            step,
            setStep,
            status,
            submit,
            isTeamLeader,
            canEditSubmission
        }}>
            {children}
        </SubmissionContext.Provider>
    );
}

export function useSubmission() {
    const context = useContext(SubmissionContext);
    if (!context) throw new Error("useSubmission must be used within SubmissionProvider");
    return context;
}
