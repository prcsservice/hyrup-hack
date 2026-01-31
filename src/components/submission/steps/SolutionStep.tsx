"use client";

import { useSubmission } from "@/context/SubmissionContext";
import { WordCounter } from "@/components/ui/WordCounter";
import { Lightbulb, Heart, Scale, Leaf, GraduationCap, Wheat, Accessibility, Zap, Car, Landmark, Shield, Code, Palette, TrendingUp } from "lucide-react";
import { useState } from "react";
import { GuidanceModal } from "../GuidanceModal";
import { guidanceContent } from "@/data/guidance";
import { competitionConfig } from "@/lib/config";

const domains = [
    { id: "health", label: "Healthcare", icon: Heart },
    { id: "law", label: "Law & Justice", icon: Scale },
    { id: "climate", label: "Climate", icon: Leaf },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "agri", label: "Agriculture", icon: Wheat },
    { id: "access", label: "Accessibility", icon: Accessibility },
    { id: "energy", label: "Energy", icon: Zap },
    { id: "mobility", label: "Mobility", icon: Car },
    { id: "civic", label: "Civic Tech", icon: Landmark },
    { id: "safety", label: "Public Safety", icon: Shield },
];

export function SolutionStep() {
    const { data, updateData } = useSubmission();
    const [modalOpen, setModalOpen] = useState(false);
    const [activeGuidance, setActiveGuidance] = useState(guidanceContent.solution);

    const openGuidance = (content: typeof guidanceContent.solution) => {
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
                <h2 className="text-2xl font-display font-bold">The Solution</h2>
                <p className="text-text-secondary">How does your idea solve the problem?</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-mono uppercase text-text-muted">Solution Overview</label>
                    <button
                        onClick={() => openGuidance(guidanceContent.solution)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition-colors"
                    >
                        <Lightbulb size={12} />
                        <span>See Example</span>
                    </button>
                </div>
                <textarea
                    value={data.solutionOverview}
                    onChange={(e) => updateData({ solutionOverview: e.target.value })}
                    className="w-full h-40 bg-bg-secondary border border-stroke-primary p-4 rounded-sm focus:border-accent outline-none"
                    placeholder="Describe your solution's key features and how it works..."
                />
                <WordCounter value={data.solutionOverview} maxWords={500} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-mono uppercase text-text-muted">Primary Domain</label>
                    <button
                        onClick={() => openGuidance(guidanceContent.domain)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium hover:bg-accent/20 transition-colors"
                    >
                        <Lightbulb size={12} />
                        <span>See Example</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {domains.map((d) => {
                        const Icon = d.icon;
                        const isSelected = data.domain === d.label;
                        return (
                            <button
                                key={d.id}
                                onClick={() => updateData({ domain: d.label })}
                                className={`
                                    p-4 rounded-sm border transition-all duration-200 flex flex-col items-center gap-3 group
                                    ${isSelected
                                        ? 'bg-accent/10 border-accent text-accent'
                                        : 'bg-bg-tertiary border-stroke-divider hover:border-stroke-primary text-text-secondary hover:text-white'
                                    }
                                `}
                            >
                                <Icon className={`w-6 h-6 ${isSelected ? 'text-accent' : 'text-text-muted group-hover:text-accent transition-colors'}`} />
                                <span className="text-xs font-medium">{d.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Solution Track Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-mono uppercase text-text-muted">Solution Track (Mandatory)</label>
                <p className="text-xs text-text-secondary -mt-2">Select the track that best represents your core deliverable.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {competitionConfig.solutionTracks.map((track) => {
                        const isSelected = data.track === track.id;
                        return (
                            <button
                                key={track.id}
                                type="button"
                                onClick={() => updateData({ track: track.id })}
                                className={`
                                    p-4 rounded-sm border transition-all duration-200 text-left
                                    ${isSelected
                                        ? 'bg-accent/10 border-accent text-white'
                                        : 'bg-bg-tertiary border-stroke-divider hover:border-stroke-primary text-text-secondary hover:text-white'
                                    }
                                `}
                            >
                                <span className={`font-bold ${isSelected ? 'text-accent' : 'text-white'}`}>{track.label}</span>
                                <p className="text-xs mt-1 text-text-muted">{track.description}</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
