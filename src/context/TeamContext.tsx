"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    query,
    where,
    getDocs,
    serverTimestamp,
    runTransaction,
    onSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Types
export interface Team {
    id: string;
    name: string;
    name_lower: string;
    inviteCode: string; // 6 char code
    leaderId: string;
    members: string[]; // UIDs
    openToRequests: boolean;
    tags: string[]; // "Looking for X"
    theme: {
        color: string;
        emoji: string;
    };
    submissionStatus?: 'pending' | 'submitted';
    positions?: { [uid: string]: string }; // Map UID -> Role (e.g. "Frontend Dev")
    pitchSlotId?: string; // Phase 7
    shortlisted?: boolean; // Phase 7
    prototype?: {
        deckUrl: string;
        videoUrl: string;
        repoUrl: string;
        figmaUrl?: string;
        costModel: string;
        executionPlan: string;
    };
    createdAt: any;
}

export interface TeamContextType {
    team: Team | null;
    loading: boolean;
    createTeam: (name: string, theme: { color: string, emoji: string }, tags: string[], position: string) => Promise<void>;
    joinTeam: (code: string, position: string) => Promise<void>;
    leaveTeam: () => Promise<void>;
    searchTeams: (queryStr: string) => Promise<Team[]>;
    checkTeamName: (name: string) => Promise<boolean>;
    submitIdea: () => Promise<void>;
    submitPrototype: (data: any) => Promise<void>;
}

const TeamContext = createContext<TeamContextType>({
    team: null,
    loading: true,
    createTeam: async () => { },
    joinTeam: async () => { },
    leaveTeam: async () => { },
    searchTeams: async () => [],
    checkTeamName: async () => false,
    submitIdea: async () => { },
    submitPrototype: async () => { },
});

export function TeamProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 1. Listen to User's Team ID changes
    useEffect(() => {
        if (!user) {
            setTeam(null);
            setLoading(false);
            return;
        }

        // Listener on the User doc to see if they join/leave a team
        const userUnsub = onSnapshot(doc(db, "users", user.uid), async (userSnap) => {
            const userData = userSnap.data();
            const teamId = userData?.teamId;

            if (teamId) {
                // If they have a team, listen to the Team doc for real-time updates
                const teamUnsub = onSnapshot(doc(db, "teams", teamId), (teamSnap) => {
                    if (teamSnap.exists()) {
                        setTeam({ id: teamSnap.id, ...teamSnap.data() } as Team);
                    } else {
                        setTeam(null); // Team deleted?
                    }
                    setLoading(false);
                });
                return () => teamUnsub();
            } else {
                setTeam(null);
                setLoading(false);
            }
        });

        return () => userUnsub();
    }, [user]);

    // Utilities
    const generateInviteCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const checkTeamName = async (name: string) => {
        const q = query(collection(db, "teams"), where("name_lower", "==", name.toLowerCase()));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    };

    const createTeam = async (name: string, theme: { color: string, emoji: string }, tags: string[], position: string) => {
        if (!user) return;
        if (await checkTeamName(name)) throw new Error("Team name taken");

        const teamRef = doc(collection(db, "teams"));
        const userRef = doc(db, "users", user.uid);
        const inviteCode = generateInviteCode();

        // Transaction to ensure atomicity (name unique check ideally inside, but kept simple here)
        await runTransaction(db, async (transaction) => {
            transaction.set(teamRef, {
                id: teamRef.id,
                name,
                name_lower: name.toLowerCase(),
                inviteCode,
                leaderId: user.uid,
                members: [user.uid],
                positions: { [user.uid]: position || "Leader" },
                openToRequests: true,
                tags: tags || [],
                theme: theme || { color: '#2979FF', emoji: '🚀' },
                submissionStatus: 'pending',
                createdAt: serverTimestamp()
            });

            transaction.update(userRef, {
                teamId: teamRef.id
            });
        });
    };

    const joinTeam = async (code: string, position: string) => {
        if (!user) return;

        const q = query(collection(db, "teams"), where("inviteCode", "==", code.toUpperCase()));
        const snapshot = await getDocs(q);

        if (snapshot.empty) throw new Error("Invalid invite code");

        const teamDoc = snapshot.docs[0];
        const teamRef = doc(db, "teams", teamDoc.id);
        const userRef = doc(db, "users", user.uid);

        if (teamDoc.data().members.includes(user.uid)) return; // Already in

        await runTransaction(db, async (transaction) => {
            // Check if positions field exists, if not create it (logic simplified: just assume update works if we use set with merge or update with dot notation if guaranteed)
            // Ideally we read it first. We did read teamDoc.
            // Let's us update. 
            transaction.update(teamRef, {
                members: arrayUnion(user.uid),
                [`positions.${user.uid}`]: position || "Member"
            });
            transaction.update(userRef, {
                teamId: teamDoc.id
            });
        });
    };

    const leaveTeam = async () => {
        if (!user || !team) return;

        const teamRef = doc(db, "teams", team.id);
        const userRef = doc(db, "users", user.uid);

        await runTransaction(db, async (transaction) => {
            transaction.update(teamRef, {
                members: arrayRemove(user.uid)
            });
            transaction.update(userRef, {
                teamId: null
            });
        });
    };

    const searchTeams = async (queryStr: string) => {
        if (!queryStr || queryStr.length < 3) return [];
        const q = query(
            collection(db, "teams"),
            where("name_lower", ">=", queryStr.toLowerCase()),
            where("name_lower", "<=", queryStr.toLowerCase() + '\uf8ff')
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Team));
    };

    const submitIdea = async () => {
        if (!team) return;
        const teamRef = doc(db, "teams", team.id);
        await updateDoc(teamRef, {
            submissionStatus: 'submitted'
        });
    };

    const submitPrototype = async (data: any) => {
        if (!team) return;
        const teamRef = doc(db, "teams", team.id);
        await updateDoc(teamRef, {
            prototype: data,
            prototypeSubmittedAt: serverTimestamp()
        });
    }

    return (
        <TeamContext.Provider value={{ team, loading, createTeam, joinTeam, leaveTeam, searchTeams, checkTeamName, submitIdea, submitPrototype }}>
            {children}
        </TeamContext.Provider>
    );
}

export const useTeam = () => useContext(TeamContext);
