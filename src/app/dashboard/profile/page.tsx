"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { ArrowLeft, User, GraduationCap, Smartphone, Save, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}

function ProfileContent() {
    const { user } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        displayName: "",
        university: "",
        phoneNumber: "",
        bio: "",
        skills: "" // stored as comma separated string for simple UI, array in DB? Let's use string for now
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) {
                const data = snap.data();
                setFormData({
                    displayName: data.displayName || "",
                    university: data.university || "",
                    phoneNumber: data.phoneNumber || "",
                    bio: data.bio || "",
                    skills: data.skills || ""
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, "users", user.uid), {
                ...formData,
                updatedAt: new Date()
            });
            showToast("Profile Updated", "success");
        } catch (error) {
            console.error(error);
            showToast("Update failed", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-text-muted animate-pulse">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-bg-primary p-4 lg:p-8">
            <header className="flex items-center gap-4 mb-8">
                <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-bg-tertiary rounded-full text-text-muted hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-display font-bold">My Profile</h1>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* ID Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-bg-secondary border border-stroke-primary p-6 rounded-sm text-center">
                        <div className="w-24 h-24 rounded-full bg-bg-tertiary mx-auto mb-4 border-2 border-accent p-1">
                            {/* Valid Google Image or Placeholder */}
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-accent/20 flex items-center justify-center text-accent text-3xl font-display font-bold">
                                    {formData.displayName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">{formData.displayName}</h2>
                        <p className="text-sm text-text-secondary font-mono mb-4">{user?.email}</p>

                        <div className="flex justify-center gap-2">
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] uppercase font-bold rounded border border-green-500/20 flex items-center gap-1">
                                <Shield size={10} /> Verifed
                            </span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSave} className="bg-bg-secondary border border-stroke-primary p-6 md:p-8 rounded-sm space-y-6">

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                                    <User size={14} /> Full Name
                                </label>
                                <input
                                    required
                                    className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                                    <GraduationCap size={14} /> University
                                </label>
                                <input
                                    required
                                    className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                                    value={formData.university}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                                <Smartphone size={14} /> Phone
                            </label>
                            <input
                                className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-text-muted uppercase">Bio / Skills</label>
                            <textarea
                                className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm h-32 resize-none"
                                placeholder="Tell us about yourself..."
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 border-t border-stroke-divider flex justify-end">
                            <Button disabled={saving}>
                                {saving ? 'Saving...' : (
                                    <span className="flex items-center gap-2">
                                        <Save size={16} /> Save Changes
                                    </span>
                                )}
                            </Button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}
