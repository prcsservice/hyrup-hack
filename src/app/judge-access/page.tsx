"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function JudgeAccessPage() {
    const { user, role, claimJudgeAccess } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [passkey, setPasskey] = useState("");
    const [loading, setLoading] = useState(false);

    if (role === 'judge' || role === 'admin') {
        return (
            <div className="h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
                <ShieldCheck size={48} className="text-green-500 mb-4" />
                <h1 className="text-2xl font-display font-bold mb-2">Access Granted</h1>
                <p className="text-text-secondary mb-6">You are already authorized as a Judge.</p>
                <Button onClick={() => router.push('/judges')}>
                    Enter Judge Panel <ArrowRight size={16} className="ml-2" />
                </Button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await claimJudgeAccess(passkey);
            if (success) {
                showToast("Access Granted. Welcome, Judge.", "success");
                setTimeout(() => router.push('/judges'), 1000);
            } else {
                showToast("Access Denied. Invalid Passkey.", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Verification failed.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-bg-secondary border border-stroke-primary p-8 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-accent to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-display font-bold">Judge Access</h1>
                    <p className="text-text-secondary text-sm mt-2">
                        Enter your secure passkey to unlock the evaluation panel.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            placeholder="Enter Passkey"
                            className="w-full bg-bg-primary border border-stroke-primary p-3 rounded-sm text-center font-mono text-lg tracking-widest focus:border-accent outline-none transition-colors"
                            value={passkey}
                            onChange={(e) => setPasskey(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <Button className="w-full h-12" disabled={loading || !passkey}>
                        {loading ? 'Verifying...' : 'Authenticate'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => router.push('/')} className="text-xs text-text-muted hover:text-white transition-colors">
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
