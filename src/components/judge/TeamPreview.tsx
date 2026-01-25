import { Team } from "@/context/TeamContext";
import { ExternalLink, Github, Youtube, FileText, Figma, DollarSign, Rocket } from "lucide-react";
import { Button } from "../ui/Button";

export function TeamPreview({ team }: { team: Team }) {
    const data = (team as any); // Cast to access dynamic fields

    return (
        <div className="space-y-8 pr-4">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">{team.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    {team.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-bg-tertiary rounded text-[10px] text-text-secondary uppercase font-mono">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Phase 1: Idea */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-accent border-b border-stroke-divider pb-2">Problem & Solution (Round 1)</h3>

                <div>
                    <h4 className="text-sm font-mono text-text-muted uppercase mb-1">Problem Statement</h4>
                    <p className="text-text-secondary leading-relaxed bg-bg-secondary p-4 rounded-sm border border-stroke-primary">
                        {data.problemStatement || "No content provided."}
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-mono text-text-muted uppercase mb-1">Proposed Solution</h4>
                    <p className="text-text-secondary leading-relaxed bg-bg-secondary p-4 rounded-sm border border-stroke-primary">
                        {data.solutionOverview || "No content provided."}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-mono text-text-muted uppercase mb-1">Primary Domain</h4>
                        <div>
                            {data.domain ? (
                                <span className="px-2 py-1 bg-bg-tertiary rounded-full text-xs text-white border border-stroke-divider">{data.domain}</span>
                            ) : <span className="text-text-muted text-xs">None listed</span>}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-mono text-text-muted uppercase mb-1">Impact Stats</h4>
                        <p className="text-sm text-text-secondary">{data.impactStats || "N/A"}</p>
                    </div>
                </div>
            </section>

            {/* Phase 2: Prototype */}
            {team.prototype && (
                <section className="space-y-4 pt-4">
                    <h3 className="text-lg font-bold text-green-500 border-b border-stroke-divider pb-2">Prototype (Round 2)</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {team.prototype.deckUrl && (
                            <Button variant="secondary" onClick={() => window.open(team.prototype?.deckUrl, '_blank')} className="justify-start">
                                <FileText size={16} className="mr-2" /> Pitch Deck
                            </Button>
                        )}
                        {team.prototype.videoUrl && (
                            <Button variant="secondary" onClick={() => window.open(team.prototype?.videoUrl, '_blank')} className="justify-start">
                                <Youtube size={16} className="mr-2" /> Play Demo
                            </Button>
                        )}
                        {team.prototype.repoUrl && (
                            <Button variant="secondary" onClick={() => window.open(team.prototype?.repoUrl, '_blank')} className="justify-start">
                                <Github size={16} className="mr-2" /> Source Code
                            </Button>
                        )}
                        {team.prototype.figmaUrl && (
                            <Button variant="secondary" onClick={() => window.open(team.prototype?.figmaUrl, '_blank')} className="justify-start">
                                <Figma size={16} className="mr-2" /> Design File
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4 mt-4">
                        <div>
                            <h4 className="text-sm font-mono text-text-muted uppercase mb-1 flex items-center gap-2">
                                <DollarSign size={14} /> Cost Structure
                            </h4>
                            <p className="text-sm text-text-secondary bg-bg-secondary p-3 rounded-sm font-mono">
                                {team.prototype.costModel || "Not provided"}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-mono text-text-muted uppercase mb-1 flex items-center gap-2">
                                <Rocket size={14} /> Execution Plan
                            </h4>
                            <p className="text-sm text-text-secondary bg-bg-secondary p-3 rounded-sm font-mono">
                                {team.prototype.executionPlan || "Not provided"}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {!team.prototype && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-sm text-yellow-500 text-sm font-mono text-center">
                    ROUND 2 SUBMISSION PENDING
                </div>
            )}
        </div>
    );
}
