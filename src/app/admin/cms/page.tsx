"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { Plus, Trash2, BookOpen, Users, Award, Eye, EyeOff, ExternalLink } from "lucide-react";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface SponsorItem {
    id: string;
    name: string;
    logo: string; // URL
    tier: 'platinum' | 'gold' | 'silver' | 'bronze';
    website?: string;
    revealed: boolean;
}

interface JuryItem {
    id: string;
    name: string;
    photo: string; // URL
    designation: string;
    company: string;
    linkedIn?: string;
    revealed: boolean;
}

type SectionType = 'faq' | 'sponsors' | 'jury';

export default function AdminCMSPage() {
    const { showToast } = useToast();
    const [faq, setFaq] = useState<FAQItem[]>([]);
    const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
    const [jury, setJury] = useState<JuryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<SectionType>('faq');

    useEffect(() => {
        const unsubFaq = onSnapshot(doc(db, "content", "faq"), (d) => {
            if (d.exists()) setFaq(d.data().items || []);
        });
        const unsubSponsors = onSnapshot(doc(db, "content", "sponsors"), (d) => {
            if (d.exists()) setSponsors(d.data().items || []);
        });
        const unsubJury = onSnapshot(doc(db, "content", "jury"), (d) => {
            if (d.exists()) setJury(d.data().items || []);
            setLoading(false);
        });
        return () => { unsubFaq(); unsubSponsors(); unsubJury(); };
    }, []);

    // Generic save handlers
    const handleSave = async (collection: string, items: any[]) => {
        try {
            await setDoc(doc(db, "content", collection), { items }, { merge: true });
            showToast(`${collection.charAt(0).toUpperCase() + collection.slice(1)} Updated`, "success");
        } catch (error) {
            showToast("Failed to save", "error");
        }
    };

    // FAQ handlers
    const addFAQ = () => {
        const newItem = { id: Date.now().toString(), question: "", answer: "" };
        handleSave("faq", [...faq, newItem]);
    };
    const updateFAQ = (id: string, field: string, val: string) => {
        setFaq(faq.map(item => item.id === id ? { ...item, [field]: val } : item));
    };
    const deleteFAQ = (id: string) => {
        if (confirm("Delete this FAQ?")) handleSave("faq", faq.filter(i => i.id !== id));
    };

    // Sponsor handlers
    const addSponsor = () => {
        const newItem: SponsorItem = { id: Date.now().toString(), name: "", logo: "", tier: "silver", revealed: false };
        handleSave("sponsors", [...sponsors, newItem]);
    };
    const updateSponsor = (id: string, field: string, val: any) => {
        setSponsors(sponsors.map(item => item.id === id ? { ...item, [field]: val } : item));
    };
    const deleteSponsor = (id: string) => {
        if (confirm("Delete this sponsor?")) handleSave("sponsors", sponsors.filter(i => i.id !== id));
    };

    // Jury handlers
    const addJury = () => {
        const newItem: JuryItem = { id: Date.now().toString(), name: "", photo: "", designation: "", company: "", revealed: false };
        handleSave("jury", [...jury, newItem]);
    };
    const updateJury = (id: string, field: string, val: any) => {
        setJury(jury.map(item => item.id === id ? { ...item, [field]: val } : item));
    };
    const deleteJury = (id: string) => {
        if (confirm("Delete this jury member?")) handleSave("jury", jury.filter(i => i.id !== id));
    };

    const TIER_COLORS = {
        platinum: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        gold: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        silver: "bg-gray-400/20 text-gray-300 border-gray-400/30",
        bronze: "bg-orange-600/20 text-orange-400 border-orange-600/30",
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold mb-2">Content Manager (CMS)</h1>
                <p className="text-text-secondary">Update text content across the site without code deployment.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stroke-primary mb-6">
                <button
                    onClick={() => setActiveSection('faq')}
                    className={`px-4 py-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeSection === 'faq' ? 'border-accent text-white' : 'border-transparent text-text-muted hover:text-white'}`}
                >
                    <BookOpen size={16} /> FAQ
                </button>
                <button
                    onClick={() => setActiveSection('sponsors')}
                    className={`px-4 py-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeSection === 'sponsors' ? 'border-accent text-white' : 'border-transparent text-text-muted hover:text-white'}`}
                >
                    <Award size={16} /> Sponsors
                </button>
                <button
                    onClick={() => setActiveSection('jury')}
                    className={`px-4 py-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeSection === 'jury' ? 'border-accent text-white' : 'border-transparent text-text-muted hover:text-white'}`}
                >
                    <Users size={16} /> Jury
                </button>
            </div>

            {loading ? (
                <div className="p-8 text-center animate-pulse text-text-muted">Loading Content...</div>
            ) : (
                <>
                    {/* FAQ Section */}
                    {activeSection === 'faq' && (
                        <div className="space-y-4">
                            {faq.map((item) => (
                                <div key={item.id} className="bg-bg-secondary border border-stroke-primary p-4 rounded-lg relative group">
                                    <button onClick={() => deleteFAQ(item.id)} className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="space-y-3 pr-8">
                                        <div>
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Question</label>
                                            <input
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.question}
                                                onChange={(e) => updateFAQ(item.id, 'question', e.target.value)}
                                                placeholder="e.g. How much is the entry fee?"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Answer</label>
                                            <textarea
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-text-secondary focus:border-accent outline-none min-h-[80px]"
                                                value={item.answer}
                                                onChange={(e) => updateFAQ(item.id, 'answer', e.target.value)}
                                                placeholder="Draft the answer..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center bg-bg-tertiary/20 p-4 rounded-lg border border-dashed border-stroke-primary">
                                <Button variant="secondary" onClick={addFAQ}><Plus size={16} className="mr-2" /> Add Question</Button>
                                <Button onClick={() => handleSave("faq", faq)}>Save Changes ({faq.length} items)</Button>
                            </div>
                        </div>
                    )}

                    {/* Sponsors Section */}
                    {activeSection === 'sponsors' && (
                        <div className="space-y-4">
                            {sponsors.map((item) => (
                                <div key={item.id} className="bg-bg-secondary border border-stroke-primary p-4 rounded-lg relative group">
                                    <div className="absolute right-4 top-4 flex items-center gap-2 opacity-0 group-hover:opacity-100">
                                        <button onClick={() => updateSponsor(item.id, 'revealed', !item.revealed)} className={`${item.revealed ? 'text-green-400' : 'text-text-muted'} hover:text-accent`} title="Toggle Visibility">
                                            {item.revealed ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button onClick={() => deleteSponsor(item.id)} className="text-text-muted hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pr-16">
                                        <div>
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Name</label>
                                            <input
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.name}
                                                onChange={(e) => updateSponsor(item.id, 'name', e.target.value)}
                                                placeholder="Company Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Tier</label>
                                            <select
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.tier}
                                                onChange={(e) => updateSponsor(item.id, 'tier', e.target.value)}
                                            >
                                                <option value="platinum">Platinum</option>
                                                <option value="gold">Gold</option>
                                                <option value="silver">Silver</option>
                                                <option value="bronze">Bronze</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Logo URL</label>
                                            <input
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.logo}
                                                onChange={(e) => updateSponsor(item.id, 'logo', e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Website (optional)</label>
                                            <input
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.website || ""}
                                                onChange={(e) => updateSponsor(item.id, 'website', e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className={`text-xs px-2 py-1 rounded border ${TIER_COLORS[item.tier]}`}>{item.tier.toUpperCase()}</span>
                                        {item.revealed ? <span className="text-xs text-green-400">✓ Visible</span> : <span className="text-xs text-text-muted">Hidden</span>}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center bg-bg-tertiary/20 p-4 rounded-lg border border-dashed border-stroke-primary">
                                <Button variant="secondary" onClick={addSponsor}><Plus size={16} className="mr-2" /> Add Sponsor</Button>
                                <Button onClick={() => handleSave("sponsors", sponsors)}>Save Changes ({sponsors.length} sponsors)</Button>
                            </div>
                        </div>
                    )}

                    {/* Jury Section */}
                    {activeSection === 'jury' && (
                        <div className="space-y-4">
                            {jury.map((item) => (
                                <div key={item.id} className="bg-bg-secondary border border-stroke-primary p-4 rounded-lg relative group">
                                    <div className="absolute right-4 top-4 flex items-center gap-2 opacity-0 group-hover:opacity-100">
                                        <button onClick={() => updateJury(item.id, 'revealed', !item.revealed)} className={`${item.revealed ? 'text-green-400' : 'text-text-muted'} hover:text-accent`} title="Toggle Visibility">
                                            {item.revealed ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button onClick={() => deleteJury(item.id)} className="text-text-muted hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pr-16">
                                        <div>
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Name</label>
                                            <input
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.name}
                                                onChange={(e) => updateJury(item.id, 'name', e.target.value)}
                                                placeholder="Full Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Designation</label>
                                            <input
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.designation}
                                                onChange={(e) => updateJury(item.id, 'designation', e.target.value)}
                                                placeholder="e.g. CTO, Founder"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Company</label>
                                            <input
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.company}
                                                onChange={(e) => updateJury(item.id, 'company', e.target.value)}
                                                placeholder="Company Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Photo URL</label>
                                            <input
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.photo}
                                                onChange={(e) => updateJury(item.id, 'photo', e.target.value)}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">LinkedIn (optional)</label>
                                            <input
                                                className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-lg text-sm text-white focus:border-accent outline-none"
                                                value={item.linkedIn || ""}
                                                onChange={(e) => updateJury(item.id, 'linkedIn', e.target.value)}
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        {item.revealed ? <span className="text-xs text-green-400">✓ Visible on site</span> : <span className="text-xs text-text-muted">Hidden until revealed</span>}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center bg-bg-tertiary/20 p-4 rounded-lg border border-dashed border-stroke-primary">
                                <Button variant="secondary" onClick={addJury}><Plus size={16} className="mr-2" /> Add Jury Member</Button>
                                <Button onClick={() => handleSave("jury", jury)}>Save Changes ({jury.length} judges)</Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

