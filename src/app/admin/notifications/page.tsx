"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { Bell, Plus, Trash2, ToggleRight, ToggleLeft, Megaphone } from "lucide-react";

interface Notification {
    id: string;
    message: string;
    type: 'info' | 'alert' | 'success';
    active: boolean;
    createdAt: any;
}

export default function AdminNotificationsPage() {
    const { showToast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [newType, setNewType] = useState<'info' | 'alert' | 'success'>('info');

    useEffect(() => {
        const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
            setNotifications(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage) return;

        try {
            await addDoc(collection(db, "notifications"), {
                message: newMessage,
                type: newType,
                active: true, // Auto activate
                createdAt: serverTimestamp()
            });
            setNewMessage("");
            showToast("Broadcast sent", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to send broadcast", "error");
        }
    };

    const toggleActive = async (n: Notification) => {
        await updateDoc(doc(db, "notifications", n.id), { active: !n.active });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this notification history?")) {
            await deleteDoc(doc(db, "notifications", id));
            showToast("Deleted", "success");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold mb-2">Notification Center</h1>
                <p className="text-text-secondary">Broadcast global alerts to all users. Used for deadlines, maintenance, or announcements.</p>
            </div>

            {/* Create Form */}
            <div className="bg-bg-secondary border border-stroke-primary p-6 rounded-sm">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Megaphone size={18} className="text-accent" /> New Broadcast
                </h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <textarea
                            placeholder="Type your message here..."
                            className="w-full bg-bg-tertiary border border-stroke-primary p-3 rounded-sm focus:border-accent outline-none text-white text-sm h-24 resize-none"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex gap-4 items-center">
                        <select
                            className="bg-bg-tertiary border border-stroke-primary p-2 rounded-sm text-sm text-white focus:border-accent outline-none"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value as any)}
                        >
                            <option value="info">Info (Blue)</option>
                            <option value="alert">Alert (Yellow)</option>
                            <option value="success">Success (Green)</option>
                        </select>
                        <Button className="ml-auto px-8">Broadcast</Button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-bg-secondary border border-stroke-primary rounded-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-stroke-primary flex justify-between items-center">
                    <h2 className="font-bold text-sm uppercase tracking-widest text-text-muted">History</h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center animate-pulse text-text-muted">Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary">No broadcasts yet.</div>
                ) : (
                    <div className="divide-y divide-stroke-divider">
                        {notifications.map(n => (
                            <div key={n.id} className="p-4 flex items-center justify-between hover:bg-bg-tertiary/20">
                                <div className="flex gap-4 items-center">
                                    <div className={`w-2 h-2 rounded-full ${n.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500/50'}`} />
                                    <div>
                                        <p className={`text-sm ${n.active ? 'text-white' : 'text-text-muted line-through'}`}>{n.message}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] font-mono uppercase bg-bg-tertiary px-1.5 rounded text-text-muted">{n.type}</span>
                                            <span className="text-[10px] text-text-muted">{n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString() : 'Just now'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleActive(n)} className="text-text-secondary hover:text-white transition-colors" title={n.active ? 'Deactivate' : 'Activate'}>
                                        {n.active ? <ToggleRight size={24} className="text-accent" /> : <ToggleLeft size={24} />}
                                    </button>
                                    <button onClick={() => handleDelete(n.id)} className="text-text-secondary hover:text-red-500 transition-colors p-2" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
