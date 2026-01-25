"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { User, Smartphone, GraduationCap, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data
    const [name, setName] = useState("");
    const [university, setUniversity] = useState("");
    const [phone, setPhone] = useState("");

    // Pre-fill if Google Auth provided name
    useEffect(() => {
        if (user?.displayName) setName(user.displayName);
    }, [user]);

    // Check if ALREADY onboarded, then skip
    useEffect(() => {
        const checkProfile = async () => {
            if (!user) return;
            const docRef = doc(db, "users", user.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const data = snap.data();
                // If university is already set, they are "onboarded"
                if (data.university) {
                    // Check for invite redirect
                    const inviteCode = localStorage.getItem('inviteCode');
                    if (inviteCode) {
                        router.push(`/team/join?code=${inviteCode}`);
                    } else {
                        router.push('/dashboard');
                    }
                }
            }
        };
        if (!loading && user) checkProfile();
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);

        try {
            await updateDoc(doc(db, "users", user.uid), {
                displayName: name,
                university: university,
                phoneNumber: phone, // Optional usually, but good for hackathons
                onboarded: true,
                updatedAt: new Date()
            });

            showToast("Profile Initialized", "success");

            // Handle Pending Invites (from LocalStorage or URL)
            const inviteCode = localStorage.getItem('inviteCode') || searchParams?.get('next');
            if (inviteCode) {
                localStorage.removeItem('inviteCode'); // clean up
                // If it's a code, go to join. If it's a path, go there.
                if (inviteCode.startsWith('/')) {
                    router.push(inviteCode);
                } else {
                    router.push(`/team/join?code=${inviteCode}`);
                }
            } else {
                router.push("/dashboard");
            }

        } catch (error) {
            console.error(error);
            showToast("Failed to save profile", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold mb-2">Welcome to FixForward</h1>
                    <p className="text-text-secondary">Let's set up your hacker profile.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-bg-secondary border border-stroke-primary p-8 rounded-sm space-y-6">

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                            <User size={14} /> Full Name
                        </label>
                        <input
                            required
                            className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                            placeholder="e.g. Aditi Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                            <GraduationCap size={14} /> University / College
                        </label>
                        <input
                            required
                            className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                            placeholder="e.g. IIT Bombay"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                            <Smartphone size={14} /> WhatsApp Number <span className="text-text-muted normal-case">(Optional)</span>
                        </label>
                        <input
                            type="tel"
                            className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <p className="text-[10px] text-text-muted">Used only for urgent hackathon updates.</p>
                    </div>

                    <Button className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Initializing...' : (
                            <span className="flex items-center gap-2">
                                Complete Setup <ArrowRight size={16} />
                            </span>
                        )}
                    </Button>

                </form>
            </div>
        </div>
    );
}
