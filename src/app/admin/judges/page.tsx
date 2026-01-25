"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Copy, CheckCircle, Mail } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface JudgeInvite {
    id: string;
    email: string;
    passkey: string;
    used: boolean;
    createdAt: any;
    usedAt: any;
}

export default function AdminJudgesPage() {
    const { showToast } = useToast();
    const [invites, setInvites] = useState<JudgeInvite[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [generating, setGenerating] = useState(false);

    // Fetch Invites
    useEffect(() => {
        const q = query(collection(db, "judgeInvites"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JudgeInvite));
            setInvites(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const generatePasskey = () => {
        // Generate robust 6 char alphanumeric code
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const handleCreateInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setGenerating(true);
        try {
            const passkey = generatePasskey();
            await addDoc(collection(db, "judgeInvites"), {
                email: email.toLowerCase(),
                passkey,
                used: false,
                createdAt: serverTimestamp(),
                usedAt: null
            });
            showToast(`Invite created for ${email}`, "success");
            setEmail("");
        } catch (error) {
            console.error(error);
            showToast("Failed to create invite", "error");
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Revoke this invite?")) {
            await deleteDoc(doc(db, "judgeInvites", id));
            showToast("Invite revoked", "success");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Copied to clipboard", "success");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold mb-2">Judge Management</h1>
                <p className="text-text-secondary">Generate secure access keys for judges. They must use the specific email assigned.</p>
            </div>

            {/* Generator Form */}
            <div className="bg-bg-secondary border border-stroke-primary p-6 rounded-sm">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-accent" /> New Invite
                </h2>
                <form onSubmit={handleCreateInvite} className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="email"
                            placeholder="judge@university.edu"
                            className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button disabled={generating}>
                        {generating ? 'Generating...' : 'Create Key'}
                    </Button>
                </form>
            </div>

            {/* Invite List */}
            <div className="bg-bg-secondary border border-stroke-primary rounded-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-stroke-primary flex justify-between items-center">
                    <h2 className="font-bold text-sm uppercase tracking-widest text-text-muted">Active Invites</h2>
                    <span className="text-xs text-text-muted font-mono">{invites.length} Total</span>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-text-muted animate-pulse">Loading Database...</div>
                ) : invites.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary">No invites generated yet.</div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-bg-tertiary text-text-muted font-mono text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Passkey</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stroke-divider">
                            {invites.map((invite) => (
                                <tr key={invite.id} className="hover:bg-bg-tertiary/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                        <Mail size={14} className="text-text-muted" />
                                        {invite.email}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-accent tracking-widest">
                                        {invite.passkey}
                                    </td>
                                    <td className="px-6 py-4">
                                        {invite.used ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-[10px] font-bold uppercase">
                                                <CheckCircle size={10} /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => copyToClipboard(`Passkey: ${invite.passkey}`)}
                                                className="p-2 hover:bg-bg-primary rounded text-text-secondary hover:text-white transition-colors"
                                                title="Copy Code"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(invite.id)}
                                                className="p-2 hover:bg-bg-primary rounded text-text-secondary hover:text-red-500 transition-colors"
                                                title="Revoke"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
