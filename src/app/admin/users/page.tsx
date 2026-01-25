"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { Search, Trophy, Ban, CheckCircle, AlertTriangle, User as UserIcon, Users } from "lucide-react";
import { Team } from "@/context/TeamContext";

export default function AdminUsersPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'teams'>('teams');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold mb-2">Registry</h1>
                <p className="text-text-secondary">Manage all registered users and participating teams.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stroke-primary">
                <button
                    onClick={() => setActiveTab('teams')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'teams' ? 'border-accent text-white' : 'border-transparent text-text-muted hover:text-white'}`}
                >
                    Teams
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'users' ? 'border-accent text-white' : 'border-transparent text-text-muted hover:text-white'}`}
                >
                    Users
                </button>
            </div>

            {activeTab === 'teams' ? <TeamList /> : <UserList />}
        </div>
    );
}

function TeamList() {
    const { showToast } = useToast();
    const [teams, setTeams] = useState<Team[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "teams"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Team));
            setTeams(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const toggleShortlist = async (team: Team) => {
        try {
            const newValue = !team.shortlisted;
            await updateDoc(doc(db, "teams", team.id), { shortlisted: newValue });
            showToast(`Team ${newValue ? 'shortlisted' : 'removed from shortlist'}`, "success");
        } catch (error) {
            showToast("Update failed", "error");
        }
    };

    const filtered = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                        placeholder="Search teams..."
                        className="w-full bg-bg-secondary border border-stroke-primary pl-10 pr-4 py-2 rounded-sm text-sm focus:border-accent outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-bg-secondary border border-stroke-primary rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-bg-tertiary text-text-muted font-mono text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Team Name</th>
                            <th className="px-6 py-3">Members</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke-divider">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center animate-pulse text-text-muted">Loading Teams...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-text-secondary">No teams found.</td></tr>
                        ) : (
                            filtered.map(team => (
                                <tr
                                    key={team.id}
                                    className="hover:bg-bg-tertiary/50 transition-colors cursor-pointer group"
                                    onClick={() => window.location.href = `/admin/teams/${team.id}`}
                                >
                                    <td className="px-6 py-4 font-bold text-white group-hover:text-accent transition-colors">
                                        {team.name}
                                        {team.shortlisted && <span className="ml-2 text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded uppercase font-mono">Shortlisted</span>}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">{team.members.length}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${team.submissionStatus === 'submitted' ? 'bg-green-500/20 text-green-500' : 'bg-bg-tertiary text-text-muted'
                                            }`}>
                                            {team.submissionStatus || 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            size="sm"
                                            variant={team.shortlisted ? "secondary" : "primary"}
                                            onClick={(e) => { e.stopPropagation(); toggleShortlist(team); }}
                                            className="text-xs h-8"
                                        >
                                            {team.shortlisted ? 'Revoke' : 'Shortlist'}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function UserList() {
    // Basic User List (Read Only for now for simplicity, can add Ban later)
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="bg-bg-secondary border border-stroke-primary rounded-sm overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-bg-tertiary text-text-muted font-mono text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Joined</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stroke-divider">
                    {loading ? (
                        <tr><td colSpan={4} className="p-8 text-center animate-pulse text-text-muted">Loading Users...</td></tr>
                    ) : (
                        users.map(u => (
                            <tr key={u.uid} className="hover:bg-bg-tertiary/50">
                                <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                    <UserIcon size={14} className="text-text-muted" />
                                    {u.displayName || 'Anonymous'}
                                </td>
                                <td className="px-6 py-4 text-text-secondary">{u.email}</td>
                                <td className="px-6 py-4 font-mono text-xs uppercase text-accent">{u.role || 'student'}</td>
                                <td className="px-6 py-4 text-text-muted text-xs">
                                    {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
