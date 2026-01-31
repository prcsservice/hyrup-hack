"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, deleteDoc, getDoc } from "firebase/firestore";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Check, X, Users, Loader2, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JoinRequest {
    id: string;
    teamId: string;
    userId: string;
    userName: string;
    userEmail: string;
    createdAt: any;
}

export function JoinRequestsPanel() {
    const { team } = useTeam();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const isLeader = team?.leaderId === user?.uid;

    useEffect(() => {
        if (!team?.id || !isLeader) {
            setLoading(false);
            return;
        }

        let previousCount = 0;

        // Listen to join requests for this team
        const q = query(
            collection(db, "joinRequests"),
            where("teamId", "==", team.id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as JoinRequest[];

            // Check for new requests and notify
            if (data.length > previousCount && previousCount > 0) {
                const newRequest = data[data.length - 1];

                // Show browser notification if permission granted
                if (Notification.permission === "granted") {
                    new Notification("New Join Request!", {
                        body: `${newRequest.userName} wants to join your team`,
                        icon: "/hyrup_logo.svg",
                        tag: "join-request"
                    });
                }

                // Also show toast
                showToast(`${newRequest.userName} requested to join!`, "info");
            }

            previousCount = data.length;
            setRequests(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [team?.id, isLeader, showToast]);

    const handleApprove = async (request: JoinRequest) => {
        if (!team) return;
        setProcessing(request.id);

        try {
            // Check if team is full
            if (team.members.length >= 4) {
                showToast("Team is already full!", "error");
                return;
            }

            // Add user to team members
            await updateDoc(doc(db, "teams", team.id), {
                members: arrayUnion(request.userId)
            });

            // Update user's teamId
            await updateDoc(doc(db, "users", request.userId), {
                teamId: team.id
            });

            // Delete the request
            await deleteDoc(doc(db, "joinRequests", request.id));

            showToast(`${request.userName} joined the team!`, "success");
        } catch (error) {
            console.error("Failed to approve request:", error);
            showToast("Failed to approve request", "error");
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (request: JoinRequest) => {
        setProcessing(request.id);
        try {
            await deleteDoc(doc(db, "joinRequests", request.id));
            showToast("Request rejected", "info");
        } catch (error) {
            console.error("Failed to reject request:", error);
            showToast("Failed to reject request", "error");
        } finally {
            setProcessing(null);
        }
    };

    if (!isLeader || !team) return null;

    return (
        <div className="bg-bg-secondary border border-stroke-primary rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white flex items-center gap-2">
                    <UserPlus size={18} className="text-accent" />
                    Join Requests
                </h3>
                {requests.length > 0 && (
                    <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full font-mono">
                        {requests.length}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-6 text-text-muted">
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Loading...
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-6 text-text-muted text-sm">
                    <Users size={24} className="mx-auto mb-2 opacity-30" />
                    No pending requests
                </div>
            ) : (
                <div className="space-y-2">
                    <AnimatePresence>
                        {requests.map((req) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center justify-between bg-bg-tertiary p-3 rounded-lg border border-stroke-divider"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-lg">
                                        👤
                                    </div>
                                    <div>
                                        <p className="font-medium text-white text-sm">{req.userName}</p>
                                        <p className="text-[11px] text-text-muted">{req.userEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {processing === req.id ? (
                                        <Loader2 className="animate-spin text-text-muted" size={16} />
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleReject(req)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleApprove(req)}
                                                className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full transition-colors"
                                                title="Approve"
                                            >
                                                <Check size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
