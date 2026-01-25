"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { Plus, Trash2, BookOpen, FileText } from "lucide-react";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

interface CMSContent {
    faq: FAQItem[];
    // Future: rules, etc.
}

export default function AdminCMSPage() {
    const { showToast } = useToast();
    const [faq, setFaq] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'faq' | 'rules'>('faq');

    useEffect(() => {
        // We store all FAQ array in a single doc 'content/faq' for simplicity and atomicity/ordering
        const unsub = onSnapshot(doc(db, "content", "faq"), (d) => {
            if (d.exists()) {
                setFaq(d.data().items || []);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSaveFAQ = async (newItems: FAQItem[]) => {
        try {
            await setDoc(doc(db, "content", "faq"), { items: newItems }, { merge: true });
            showToast("FAQ Updated", "success");
        } catch (error) {
            showToast("Failed to save", "error");
        }
    };

    const addItem = () => {
        const newItem = { id: Date.now().toString(), question: "", answer: "" };
        handleSaveFAQ([...faq, newItem]);
    };

    const updateItem = (id: string, field: 'question' | 'answer', val: string) => {
        const newData = faq.map(item => item.id === id ? { ...item, [field]: val } : item);
        // Optimistic update local first for input perf? better to separate state
        setFaq(newData);
    };

    // Debounced save or manual save button? Manual for now to prevent spam writes

    const deleteItem = (id: string) => {
        if (confirm("Delete this item?")) {
            handleSaveFAQ(faq.filter(i => i.id !== id));
        }
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
                    className={`px-4 py-2 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${activeSection === 'faq' ? 'border-accent text-white' : 'border-transparent text-text-muted'}`}
                >
                    <BookOpen size={16} /> FAQ
                </button>
                <button
                    className="px-4 py-2 text-sm font-bold border-b-2 border-transparent text-text-muted cursor-not-allowed opacity-50 flex items-center gap-2"
                    title="Coming soon"
                >
                    <FileText size={16} /> Rules
                </button>
            </div>

            {loading ? (
                <div className="p-8 text-center animate-pulse text-text-muted">Loading Content...</div>
            ) : (
                <div className="space-y-4">
                    {faq.map((item, index) => (
                        <div key={item.id} className="bg-bg-secondary border border-stroke-primary p-4 rounded-sm relative group">
                            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => deleteItem(item.id)} className="text-text-muted hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-3 pr-8">
                                <div>
                                    <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Question</label>
                                    <input
                                        className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-sm text-sm text-white focus:border-accent outline-none"
                                        value={item.question}
                                        onChange={(e) => updateItem(item.id, 'question', e.target.value)}
                                        placeholder="e.g. How much is the entry fee?"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-mono text-text-muted mb-1 block">Answer</label>
                                    <textarea
                                        className="w-full bg-bg-tertiary border border-stroke-primary p-2 rounded-sm text-sm text-text-secondary focus:border-accent outline-none min-h-[80px]"
                                        value={item.answer}
                                        onChange={(e) => updateItem(item.id, 'answer', e.target.value)}
                                        placeholder="Draft the answer..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between items-center bg-bg-tertiary/20 p-4 rounded-sm border border-dashed border-stroke-primary">
                        <Button variant="secondary" onClick={addItem}>
                            <Plus size={16} className="mr-2" /> Add Question
                        </Button>
                        <Button onClick={() => handleSaveFAQ(faq)}>
                            Save Changes ({faq.length} items)
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
