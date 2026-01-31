"use client";

import { useTeam } from "@/context/TeamContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Lock, Rocket, DollarSign, FileText, Github, Figma, CheckCircle, BarChart3 } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function PrototypePage() {
    return (
        <DashboardLayout showChat={false}>
            <PrototypeContent />
        </DashboardLayout>
    );
}

function PrototypeContent() {
    const { team, loading, submitPrototype } = useTeam();
    const router = useRouter();
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        deckUrl: "",
        repoUrl: "",
        figmaUrl: "",
        costModel: "",
        executionPlan: ""
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!team || !team.shortlisted) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <Lock size={48} className="text-text-muted mb-4" />
                <h1 className="text-2xl font-display font-bold mb-2">Restricted Access</h1>
                <p className="text-text-secondary mb-6">Only shortlisted teams can submit prototypes.</p>
                <Button onClick={() => router.push('/dashboard')}>
                    <ArrowLeft size={16} className="mr-2" />
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitPrototype(formData);
            showToast("Prototype submitted successfully!", "success");
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            showToast("Failed to submit prototype.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-1 h-8 w-8 p-0 border-stroke-divider"
                        onClick={() => router.push('/dashboard')}
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <BarChart3 size={20} className="text-accent" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold">Prototype Launchpad</h1>
                        </div>
                        <p className="text-text-secondary text-sm">Phase 2: Final Submission</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-accent font-bold text-sm">
                    <Rocket size={16} />
                    <span>FINAL SUBMISSION</span>
                </div>
            </header>

            <p className="text-text-secondary mb-8">
                Submit your final artifacts for Round 2 judging. Ensure all links are publicly accessible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* SECTION 1: ARTIFACTS */}
                <section className="bg-bg-secondary border border-stroke-primary p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="w-6 h-6 bg-accent text-bg-primary flex items-center justify-center text-xs font-bold">1</span>
                        Review Artifacts
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                                <FileText size={14} /> Pitch Deck (PDF Only)
                            </label>
                            <input
                                required
                                name="deckUrl"
                                placeholder="https://drive.google.com/..."
                                className="w-full bg-bg-tertiary border border-stroke-primary p-3 focus:border-accent outline-none text-white text-sm font-mono"
                                value={formData.deckUrl}
                                onChange={handleChange}
                            />
                            <p className="text-[10px] text-text-secondary">Please ensure "Anyone with link" permission is ON.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                                <Github size={14} /> Code Repository
                            </label>
                            <input
                                required
                                name="repoUrl"
                                placeholder="https://github.com/username/repo"
                                className="w-full bg-bg-tertiary border border-stroke-primary p-3 focus:border-accent outline-none text-white text-sm font-mono"
                                value={formData.repoUrl}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                                <Figma size={14} /> Design File (Optional)
                            </label>
                            <input
                                name="figmaUrl"
                                placeholder="https://figma.com/file/..."
                                className="w-full bg-bg-tertiary border border-stroke-primary p-3 focus:border-accent outline-none text-white text-sm font-mono"
                                value={formData.figmaUrl}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                {/* SECTION 2: EXECUTION */}
                <section className="bg-bg-secondary border border-stroke-primary p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="w-6 h-6 bg-accent text-bg-primary flex items-center justify-center text-xs font-bold">2</span>
                        Feasibility & Execution
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                                <DollarSign size={14} /> Cost Structure
                            </label>
                            <p className="text-xs text-text-secondary">Break down your monthly operational costs (SaaS, hosting, APIs) for 1000 users.</p>
                            <textarea
                                required
                                name="costModel"
                                rows={4}
                                className="w-full bg-bg-tertiary border border-stroke-primary p-3 focus:border-accent outline-none text-white text-sm font-mono"
                                placeholder="e.g. Hosting: $10/mo, OpenAI API: $50/mo..."
                                value={formData.costModel}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                                <Rocket size={14} /> Execution Plan (Next 3 Months)
                            </label>
                            <p className="text-xs text-text-secondary">What are your key milestones if you win the grant?</p>
                            <textarea
                                required
                                name="executionPlan"
                                rows={4}
                                className="w-full bg-bg-tertiary border border-stroke-primary p-3 focus:border-accent outline-none text-white text-sm font-mono"
                                placeholder="Month 1: MVP refinement..."
                                value={formData.executionPlan}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                {/* SUBMIT */}
                <div className="flex justify-end pt-4">
                    <Button
                        className="w-full md:w-auto text-lg h-12 px-12"
                        disabled={submitting}
                    >
                        {submitting ? 'Transmitting...' : (
                            <span className="flex items-center gap-2">
                                Submit Prototype <CheckCircle size={18} />
                            </span>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    );
}
