"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { ArrowLeft, User, GraduationCap, Smartphone, Save, Shield, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    return <ProfileContent />;
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
        skills: ""
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8">
                <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 border-stroke-divider"
                    onClick={() => router.push('/dashboard')}
                >
                    <ArrowLeft size={16} />
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <Settings size={20} className="text-accent" />
                        <h1 className="text-2xl md:text-3xl font-display font-bold">My Profile</h1>
                    </div>
                    <p className="text-text-secondary text-sm">Manage your account settings</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* ID Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-bg-secondary border border-stroke-primary p-6 text-center">
                        <div className="w-24 h-24 rounded-full bg-bg-tertiary mx-auto mb-4 border-2 border-accent p-1">
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
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] uppercase font-bold border border-green-500/20 flex items-center gap-1">
                                <Shield size={10} /> Verified
                            </span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSave} className="bg-bg-secondary border border-stroke-primary p-6 md:p-8 space-y-6">

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-mono text-text-muted uppercase flex items-center gap-2">
                                    <User size={14} /> Full Name
                                </label>
                                <input
                                    required
                                    className="w-full bg-bg-tertiary border border-stroke-primary p-3 focus:border-accent outline-none text-white text-sm"
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
                                    className="w-full bg-bg-tertiary border border-stroke-primary p-3 focus:border-accent outline-none text-white text-sm"
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
                                className="w-full bg-bg-tertiary border border-stroke-primary p-3 focus:border-accent outline-none text-white text-sm"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-mono text-text-muted uppercase">Bio / Skills</label>
                            <textarea
                                className="w-full bg-bg-tertiary border border-stroke-primary p-3 focus:border-accent outline-none text-white text-sm h-32 resize-none"
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
