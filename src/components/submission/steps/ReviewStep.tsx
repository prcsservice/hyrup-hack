"use client";

import { useSubmission } from "@/context/SubmissionContext";

export function ReviewStep() {
    const { data } = useSubmission();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold">Final Review</h2>
                <p className="text-text-secondary">Check your submission before sending to the judges.</p>
            </div>

            <div className="space-y-6">

                {/* Section Review Card */}
                <div className="p-6 bg-bg-tertiary border border-stroke-divider rounded-sm space-y-4">
                    <h3 className="font-bold text-accent border-b border-stroke-primary pb-2 uppercase tracking-widest text-xs">The Problem</h3>
                    <div>
                        <div className="text-xs text-text-muted uppercase mb-1">Statement</div>
                        <p className="text-sm">{data.problemStatement || "Not specified"}</p>
                    </div>
                    <div>
                        <div className="text-xs text-text-muted uppercase mb-1">Evidence</div>
                        <p className="text-sm text-text-secondary">{data.problemEvidence || "No evidence provided"}</p>
                    </div>
                </div>

                <div className="p-6 bg-bg-tertiary border border-stroke-divider rounded-sm space-y-4">
                    <h3 className="font-bold text-accent border-b border-stroke-primary pb-2 uppercase tracking-widest text-xs">The Solution</h3>
                    <div>
                        <p className="text-sm">{data.solutionOverview || "Not specified"}</p>
                    </div>
                    <div>
                        <div className="text-xs text-text-muted uppercase mb-2">Primary Domain</div>
                        <div className="flex flex-wrap gap-2">
                            {data.domain ? (
                                <span className="px-2 py-1 bg-bg-primary border border-stroke-primary text-xs rounded-full">{data.domain}</span>
                            ) : <span className="text-text-muted text-xs italic">No domain selected</span>}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-bg-tertiary border border-stroke-divider rounded-sm space-y-4">
                    <h3 className="font-bold text-accent border-b border-stroke-primary pb-2 uppercase tracking-widest text-xs">Impact</h3>
                    <div>
                        <div className="text-xs text-text-muted uppercase mb-1">Target Audience</div>
                        <p className="text-sm">{data.targetAudience || "Not specified"}</p>
                    </div>
                    <div>
                        <div className="text-xs text-text-muted uppercase mb-1">Quantifiable Impact</div>
                        <p className="text-sm">{data.impactStats || "Not specified"}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
