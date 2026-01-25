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
    const { team, submitIdea } = useTeam();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [data, setData] = useState<SubmissionData>(INITIAL_DATA);
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'draft' | 'saving' | 'saved' | 'submitted'>('draft');

    // TODO: Load existing draft from Firestore on mount
    // useEffect(() => {
    //   if (team?.id) { ... fetch doc ... }
    // }, [team?.id]);

    // Debounced Autosave Simulation
    useEffect(() => {
        if (status === 'submitted') return;

        const timer = setTimeout(() => {
            if (status === 'draft') {
                setStatus('saving');
                // Mock DB write delay
                setTimeout(() => {
                    console.log("Auto-saved to Firestore:", data);
                    setStatus('saved');
                }, 800);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [data, status]);

    const updateData = (updates: Partial<SubmissionData>) => {
        setData(prev => ({ ...prev, ...updates }));
        // If it was submitted, we don't revert to draft immediately, 
        // we just let them edit. The save button will effectively be an "Update" button.
        // if (status !== 'submitted') setStatus('draft'); 
    };

    const submit = async (onSuccess?: () => void) => {
        if (!team) {
            showToast("You need a team to submit!", "error");
            return;
        }

        setStatus('saving');

        try {
            await submitIdea(); // Updates Firestore
            // await new Promise(r => setTimeout(r, 1500)); // Mock submit removed

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
