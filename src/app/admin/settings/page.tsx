"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { ToggleLeft, ToggleRight, Save, ShieldAlert, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { logAction } from "@/lib/audit";

interface GlobalSettings {
    registrationsOpen: boolean;
    submissionsOpen: boolean;
    resultsPublished: boolean;
    maintenanceMode: boolean;
    registrationDeadline?: string; // ISO String
    ideaDeadline?: string;
    prototypeDeadline?: string;
}

export default function AdminSettingsPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [settings, setSettings] = useState<GlobalSettings>({
        registrationsOpen: true,
        submissionsOpen: true,
        resultsPublished: false,
        maintenanceMode: false,
        registrationDeadline: '',
        ideaDeadline: '',
        prototypeDeadline: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "settings", "public"), (doc) => {
            if (doc.exists()) {
                setSettings(doc.data() as GlobalSettings);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "public"), settings, { merge: true });
            await logAction(user?.email, "UPDATE_SETTINGS", "Global Config", settings);
            showToast("Global settings updated", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to save settings", "error");
        } finally {
            setSaving(false);
        }
    };

    const toggle = (key: keyof GlobalSettings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) return <div className="p-8 text-center animate-pulse text-text-muted">Loading Configuration...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold mb-2">Global Settings</h1>
                <p className="text-text-secondary">Control feature flags and phase transitions for the entire platform.</p>
            </div>

            <div className="bg-bg-secondary border border-stroke-primary rounded-sm overflow-hidden">
                <div className="p-6 border-b border-stroke-primary bg-bg-tertiary/20">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <ShieldAlert size={18} className="text-accent" /> Critical Controls
                    </h2>
                    <p className="text-xs text-text-secondary mt-1">Changes here affect all users immediately.</p>
                </div>

                <div className="divide-y divide-stroke-divider">
                    <SettingRow
                        label="Registrations Open"
                        description="Allow new users to sign up and create teams."
                        enabled={settings.registrationsOpen}
                        onToggle={() => toggle('registrationsOpen')}
                    />
                    <SettingRow
                        label="Submissions Open"
                        description="Allow teams to submit ideas and prototypes."
                        enabled={settings.submissionsOpen}
                        onToggle={() => toggle('submissionsOpen')}
                    />
                    <SettingRow
                        label="Publish Results"
                        description="Visible leaderboard and winners announcement."
                        enabled={settings.resultsPublished}
                        onToggle={() => toggle('resultsPublished')}
                    />
                    <SettingRow
                        label="Maintenance Mode"
                        description="Lock the site for everyone except admins."
                        enabled={settings.maintenanceMode}
                        onToggle={() => toggle('maintenanceMode')}
                        danger
                    />
                </div>

                {/* Deadlines Section */}
                <div className="p-6 border-t border-stroke-primary bg-bg-tertiary/10">
                    <h2 className="font-bold text-white flex items-center gap-2 mb-4">
                        <Calendar size={18} className="text-accent" /> Phase Deadlines
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs text-text-muted uppercase font-mono">Registration Closes</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-sm text-sm text-white focus:border-accent outline-none"
                                value={settings.registrationDeadline || ''}
                                onChange={(e) => setSettings({ ...settings, registrationDeadline: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-text-muted uppercase font-mono">Idea Submission</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-sm text-sm text-white focus:border-accent outline-none"
                                value={settings.ideaDeadline || ''}
                                onChange={(e) => setSettings({ ...settings, ideaDeadline: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-text-muted uppercase font-mono">Prototype Submission</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-sm text-sm text-white focus:border-accent outline-none"
                                value={settings.prototypeDeadline || ''}
                                onChange={(e) => setSettings({ ...settings, prototypeDeadline: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-bg-tertiary/10 flex justify-end">
                    <Button onClick={handleSave} disabled={saving} className="w-32">
                        {saving ? 'Saving...' : (
                            <span className="flex items-center gap-2"><Save size={16} /> Save</span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function SettingRow({ label, description, enabled, onToggle, danger }: any) {
    return (
        <div className="p-6 flex items-center justify-between hover:bg-bg-tertiary/30 transition-colors">
            <div>
                <h3 className={`font-bold ${danger ? 'text-red-400' : 'text-white'}`}>{label}</h3>
                <p className="text-sm text-text-secondary">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`transition-colors ${enabled ? 'text-accent' : 'text-text-muted hover:text-white'}`}
            >
                {enabled ? <ToggleRight size={40} strokeWidth={1.5} /> : <ToggleLeft size={40} strokeWidth={1.5} />}
            </button>
        </div>
    );
}
