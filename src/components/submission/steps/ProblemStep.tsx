"use client";

import { useSubmission } from "@/context/SubmissionContext";
import { WordCounter } from "@/components/ui/WordCounter";
import { FileUpload } from "@/components/submission/FileUpload";
import { useTeam } from "@/context/TeamContext";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { GuidanceModal } from "../GuidanceModal";
import { guidanceContent } from "@/data/guidance";

export function ProblemStep() {
    const { data, updateData } = useSubmission();
    const { team } = useTeam();
    const [modalOpen, setModalOpen] = useState(false);
    const [activeGuidance, setActiveGuidance] = useState(guidanceContent.problem);

    const openGuidance = (content: typeof guidanceContent.problem) => {
        setActiveGuidance(content);
        setModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GuidanceModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                content={activeGuidance}
            />

            <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold">The Problem</h2>
                <p className="text-text-secondary">What specific challenge are you solving? Be concise.</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-mono uppercase text-text-muted">Problem Statement</label>
                    <button
                        onClick={() => openGuidance(guidanceContent.problem)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition-colors"
                    >
                        <Lightbulb size={12} />
                        <span>See Example</span>
                    </button>
                </div>
                <textarea
                    value={data.problemStatement}
                    onChange={(e) => updateData({ problemStatement: e.target.value })}
                    className="w-full h-40 bg-bg-secondary border border-stroke-primary p-4 rounded-sm focus:border-accent outline-none mb-2"
                    placeholder="e.g. Students in rural areas lack access to quality STEM mentorship..."
                />
                <WordCounter value={data.problemStatement} maxWords={300} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-mono uppercase text-text-muted">Evidence & Context</label>
                    <button
                        onClick={() => openGuidance(guidanceContent.evidence)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition-colors"
                    >
                        <Lightbulb size={12} />
                        <span>See Example</span>
                    </button>
                </div>
                <p className="text-xs text-text-secondary mb-2">Why is this a problem *now*? Cite news, data, or personal experience.</p>
                <textarea
                    value={data.problemEvidence}
                    onChange={(e) => updateData({ problemEvidence: e.target.value })}
                    className="w-full h-32 bg-bg-secondary border border-stroke-primary p-4 rounded-sm focus:border-accent outline-none"
                    placeholder="According to 2024 Education Report..."
                />
                <WordCounter value={data.problemEvidence || ""} maxWords={200} />
            </div>

            {/* Evidence File Upload */}
            {team && (
                <div className="space-y-4">
                    <label className="block text-sm font-mono uppercase text-text-muted">Supporting Document (Optional)</label>
                    <p className="text-xs text-text-secondary mb-2">Upload a screenshot, research paper, or news clipping.</p>
                    <FileUpload
                        teamId={team.id}
                        folder="evidence"
                        accept=".pdf,.png,.jpg,.jpeg"
                        maxSizeMB={5}
                        onUpload={(url, name) => updateData({ evidenceFileUrl: url })}
                    />
                </div>
            )}
        </div>
    );
}
