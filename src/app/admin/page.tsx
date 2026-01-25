"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { Users, LayoutGrid, Trophy, Gavel, ArrowUpRight, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        users: 0,
        teams: 0,
        judges: 0,
        judgeInvites: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userCount = (await getCountFromServer(collection(db, "users"))).data().count;
                const teamCount = (await getCountFromServer(collection(db, "teams"))).data().count;

                const qJudges = query(collection(db, "users"), where("role", "==", "judge"));
                const judgeCount = (await getCountFromServer(qJudges)).data().count;

                const qInvites = query(collection(db, "judgeInvites"), where("used", "==", false));
                const inviteCount = (await getCountFromServer(qInvites)).data().count;

                setStats({
                    users: userCount,
                    teams: teamCount,
                    judges: judgeCount,
                    judgeInvites: inviteCount
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold mb-2">Command Center</h1>
                <p className="text-text-secondary">System overview and health metrics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Users"
                    value={stats.users}
                    icon={Users}
                    trend="+12%"
                    loading={loading}
                />
                <StatCard
                    label="Active Teams"
                    value={stats.teams}
                    icon={LayoutGrid}
                    loading={loading}
                />
                <StatCard
                    label="Judge Panel"
                    value={stats.judges}
                    icon={Gavel}
                    loading={loading}
                />
                <StatCard
                    label="Pending Invites"
                    value={stats.judgeInvites}
                    icon={Activity}
                    color="text-accent"
                    loading={loading}
                />
            </div>

            {/* Quick Actions (Placeholder for now) */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-bg-secondary border border-stroke-primary p-6 rounded-sm">
                    <h2 className="font-bold text-white mb-4">System Status</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-muted">Database Connection</span>
                            <span className="text-green-500 font-mono">ONLINE</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-muted">Auth Service</span>
                            <span className="text-green-500 font-mono">ONLINE</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-muted">Current Phase</span>
                            <span className="px-2 py-0.5 bg-bg-tertiary rounded text-white font-mono text-xs uppercase">Prototype Submission</span>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-stroke-primary p-6 rounded-sm">
                    <h2 className="font-bold text-white mb-4">Recent Activity</h2>
                    <div className="text-sm text-text-secondary text-center py-8 bg-bg-tertiary/20 rounded border border-dashed border-stroke-divider">
                        No recent logs available.
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, trend, color, loading }: any) {
    return (
        <div className="bg-bg-secondary border border-stroke-primary p-6 rounded-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-bg-tertiary ${color || 'text-text-muted'}`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <span className="text-[10px] font-mono text-green-500 flex items-center gap-1 bg-green-500/10 px-1.5 py-0.5 rounded">
                        {trend} <ArrowUpRight size={10} />
                    </span>
                )}
            </div>
            <div>
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">{label}</p>
                {loading ? (
                    <div className="h-8 w-16 bg-bg-tertiary animate-pulse rounded" />
                ) : (
                    <h3 className="text-3xl font-display font-bold text-white">{value}</h3>
                )}
            </div>
        </div>
    );
}
