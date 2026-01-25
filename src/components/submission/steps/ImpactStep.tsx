"use client";

import { useSubmission } from "@/context/SubmissionContext";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { GuidanceModal } from "../GuidanceModal";
import { guidanceContent } from "@/data/guidance";

export function ImpactStep() {
    const { data, updateData } = useSubmission();
    const [modalOpen, setModalOpen] = useState(false);
    const [activeGuidance, setActiveGuidance] = useState(guidanceContent.impact);

    const openGuidance = (content: typeof guidanceContent.impact) => {
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
                <h2 className="text-2xl font-display font-bold">Impact & Value</h2>
                <p className="text-text-secondary">Why does this matter?</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-mono uppercase text-text-muted">Target Audience</label>
                    <button
                        onClick={() => openGuidance(guidanceContent.targetAudience)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition-colors"
                    >
                        <Lightbulb size={12} />
                        <span>See Example</span>
                    </button>
                </div>
                <p className="text-xs text-text-secondary">Who benefits directly from your solution?</p>
                <input
                    className="w-full bg-bg-secondary border border-stroke-primary p-4 rounded-sm focus:border-accent outline-none font-display"
                    placeholder="e.g. Small business owners in Tier-2 cities"
                    value={data.targetAudience}
                    onChange={(e) => updateData({ targetAudience: e.target.value })}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-mono uppercase text-text-muted">Quantifiable Impact</label>
                    <button
                        onClick={() => openGuidance(guidanceContent.impact)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition-colors"
                    >
                        <Lightbulb size={12} />
                        <span>See Example</span>
                    </button>
                </div>
                <p className="text-xs text-text-secondary">Estimate the potential impact (costs saved, time reduced, users reached).</p>
                <textarea
                    value={data.impactStats}
                    onChange={(e) => updateData({ impactStats: e.target.value })}
                    className="w-full h-40 bg-bg-secondary border border-stroke-primary p-4 rounded-sm focus:border-accent outline-none"
                    placeholder="e.g. Could reduce processing time by 40% for 10k users..."
                />
            </div>
        </div>
    );
}
