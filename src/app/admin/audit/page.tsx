"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { History, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Log {
    id: string;
    adminEmail: string;
    action: string;
    target: string;
    createdAt: any;
    metadata: any;
}

export default function AuditPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "auditLogs"),
                orderBy("createdAt", "desc"),
                limit(50)
            );
            const snap = await getDocs(q);
            setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as Log)));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold mb-2">Audit Logs</h1>
                    <p className="text-text-secondary">Track admin activity and system events.</p>
                </div>
                <Button variant="secondary" onClick={fetchLogs} disabled={loading}>
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </Button>
            </div>

            <div className="bg-bg-secondary border border-stroke-primary rounded-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-bg-tertiary text-text-muted font-mono uppercase text-xs">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Admin</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Target</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke-divider">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-text-muted">Loading records...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-text-muted"><History size={24} className="mx-auto mb-2 opacity-20" />No activity recorded.</td></tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id} className="hover:bg-bg-tertiary/20">
                                    <td className="p-4 font-mono text-text-muted">
                                        {log.createdAt?.seconds ? format(log.createdAt.toDate(), "MMM dd, HH:mm:ss") : '-'}
                                    </td>
                                    <td className="p-4 text-white">
                                        {log.adminEmail}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase
                                            ${log.action.includes('BAN') ? 'bg-red-500/20 text-red-500' :
                                                log.action.includes('SETTINGS') ? 'bg-yellow-500/20 text-yellow-500' :
                                                    'bg-blue-500/20 text-blue-500'}`}>
                                            {log.action.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-text-secondary font-mono text-xs">
                                        {log.target}
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
