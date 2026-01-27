"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useTeam } from "./TeamContext";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
// import { db } from "@/lib/firebase"; // TODO: connect to real DB
// import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

interface SubmissionData {
    problemStatement: string;
    problemEvidence: string;
    solutionOverview: string;
    domain: string;
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
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

const INITIAL_DATA: SubmissionData = {
    problemStatement: "",
    problemEvidence: "",
    solutionOverview: "",
    domain: "",
    targetAudience: "",
    impactStats: "",
    fileUrls: []
};

export function SubmissionProvider({ children }: { children: ReactNode }) {
    const { team, submitIdea, saveSubmission } = useTeam();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [data, setData] = useState<SubmissionData>(INITIAL_DATA);
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'draft' | 'saving' | 'saved' | 'submitted'>('draft');

    // Track if we have initialized data from the team doc
    const initialized = useState(false); // Using state to force re-render if needed, or ref if not. Actually simple boolean ref is fine but strict mode double effect might be annoying.
    // Let's use a standard pattern:
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (team && !isLoaded) {
            // Check if team has any relevant data to load
            const hasData = team.problemStatement || team.problemEvidence || team.solutionOverview || team.domain;

            if (hasData || team.submissionStatus === 'submitted') {
                setData({
                    problemStatement: team.problemStatement || "",
                    problemEvidence: team.problemEvidence || "",
                    solutionOverview: team.solutionOverview || "",
                    domain: team.domain || "",
                    targetAudience: team.targetAudience || "",
                    impactStats: team.impactStats || "",
                    fileUrls: team.fileUrls || [],
                    evidenceFileUrl: team.evidenceFileUrl
                });

                if (team.submissionStatus === 'submitted') {
                    setStatus('submitted');
                    setStep(4); // Jump to review
                } else {
                    setStatus('saved');
                }
            }
            setIsLoaded(true);
        }
    }, [team, isLoaded]);

    // Debounced Autosave
    useEffect(() => {
        if (status === 'submitted' || !isLoaded) return;
        // Don't save if data is empty/initial to avoid overwriting DB with empty state on race condition
        // But if user clears field, we SHOULD save.
        // The isLoaded check ensures we don't save BEFORE we've loaded existing data.

        const timer = setTimeout(() => {
            if (status === 'draft') {
                console.log("Autosave triggering...", data);
                setStatus('saving');
                saveSubmission(data).then(() => {
                    console.log("Auto-saved to Firestore");
                    setStatus('saved');
                }).catch(err => {
                    console.error("Autosave failed", err);
                    setStatus('draft'); // Retry?
                });
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [data, status, isLoaded, saveSubmission]);

    const updateData = (updates: Partial<SubmissionData>) => {
        setData(prev => ({ ...prev, ...updates }));
        if (status !== 'submitted') setStatus('draft'); // Mark as needs saving
    };

    const submit = async (onSuccess?: () => void) => {
        if (!team) {
            showToast("You need a team to submit!", "error");
            return;
        }

        setStatus('saving');

        try {
            await submitIdea(data); // Updates Firestore with data + status
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
        <SubmissionContext.Provider value={{ data, updateData, step, setStep, status, submit }}>
            {children}
        </SubmissionContext.Provider>
    );
}

export function useSubmission() {
    const context = useContext(SubmissionContext);
    if (!context) throw new Error("useSubmission must be used within SubmissionProvider");
    return context;
}
