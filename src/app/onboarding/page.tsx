"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { User, Smartphone, GraduationCap, ArrowRight, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form Schema
const profileSchema = z.object({
    displayName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    university: z.string().min(2, "University name is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function OnboardingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();

    // States
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: "",
            email: "",
            university: "",
            phoneNumber: "",
        }
    });

    // Pre-fill Data
    useEffect(() => {
        if (user) {
            setValue("displayName", user.displayName || "");
            setValue("email", user.email || "");
        }
    }, [user, setValue]);

    // Check if ALREADY onboarded
    useEffect(() => {
        const checkProfile = async () => {
            if (!user) return;
            const docRef = doc(db, "users", user.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const data = snap.data();
                if (data.onboarded) {
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

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user) return;

        setIsSubmitting(true);

        try {
            // Format phone number
            let phone = data.phoneNumber.replace(/[\s\-\(\)]/g, "");
            if (!phone.startsWith('+')) {
                phone = `+91${phone}`;
            }

            await updateDoc(doc(db, "users", user.uid), {
                displayName: data.displayName,
                email: data.email,
                university: data.university,
                phoneNumber: phone,
                onboarded: true,
                updatedAt: new Date()
            });

            showToast("Profile Initialized", "success");

            // Handle Pending Invites
            const inviteCode = localStorage.getItem('inviteCode') || searchParams?.get('next');
            if (inviteCode) {
                localStorage.removeItem('inviteCode');
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

                <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-secondary border border-stroke-primary p-8 rounded-sm space-y-6">

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                            <User size={14} /> Full Name
                        </label>
                        <input
                            {...register("displayName")}
                            className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                            placeholder="e.g. Aditi Sharma"
                        />
                        {errors.displayName && <p className="text-red-500 text-xs">{errors.displayName.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                            <Mail size={14} /> Email Address
                        </label>
                        <input
                            {...register("email")}
                            readOnly
                            className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm opacity-70 cursor-not-allowed"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>

                    {/* University */}
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                            <GraduationCap size={14} /> University / College
                        </label>
                        <input
                            {...register("university")}
                            className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                            placeholder="e.g. IIT Bombay"
                        />
                        {errors.university && <p className="text-red-500 text-xs">{errors.university.message}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                            <Smartphone size={14} /> Phone Number
                        </label>
                        <input
                            {...register("phoneNumber")}
                            className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                            placeholder="+919876543210"
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
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
