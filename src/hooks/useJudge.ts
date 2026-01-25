import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Team } from '@/context/TeamContext';

export interface ScoreData {
    criteria: {
        problem: number;
        originality: number;
        feasibility: number;
        prototype: number;
        impact: number;
        pitch: number;
    };
    total: number;
    feedback: string;
}

export function useJudge() {
    const { user, role } = useAuth();
    const { showToast } = useToast();
    const [assignedTeams, setAssignedTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAssignedTeams = async () => {
        if (!user || (role !== 'judge' && role !== 'admin')) return;
        setLoading(true);
        try {
            // MVP: Judges see ALL shortlisted teams for now
            // In full prod, we'd have a 'judgeAssignments' collection
            const q = query(collection(db, "teams"), where("shortlisted", "==", true));
            const snap = await getDocs(q);
            const teams = snap.docs.map(d => ({ id: d.id, ...d.data() } as Team));
            setAssignedTeams(teams);
        } catch (error) {
            console.error(error);
            showToast("Failed to load teams", "error");
        } finally {
            setLoading(false);
        }
    };

    const submitScore = async (teamId: string, data: ScoreData) => {
        if (!user) return;
        try {
            // Write to 'scores' collection
            const scoreRef = doc(collection(db, "scores"));
            await setDoc(scoreRef, {
                teamId,
                judgeId: user.uid,
                judgeName: user.displayName,
                ...data,
                submittedAt: serverTimestamp()
            });

            // Update team status to 'graded' (simplified logic - ideally checks if all judges graded)
            // For now, we don't change team status to keep it simple, or maybe just flag it internally

            showToast("Scorecard submitted successfully", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to submit score", "error");
            throw error;
        }
    };

    const getExistingScore = async (teamId: string) => {
        if (!user) return null;
        const q = query(
            collection(db, "scores"),
            where("teamId", "==", teamId),
            where("judgeId", "==", user.uid)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
            return snap.docs[0].data() as ScoreData;
        }
        return null;
    };

    const fetchTeamById = async (teamId: string) => {
        if (!user) return null;
        const snap = await getDoc(doc(db, "teams", teamId));
        if (snap.exists()) {
            return { id: snap.id, ...snap.data() } as Team;
        }
        return null;
    };

    useEffect(() => {
        if (role === 'judge' || role === 'admin') {
            fetchAssignedTeams();
        }
    }, [user, role]);

    return {
        assignedTeams,
        loading,
        submitScore,
        getExistingScore,
        fetchTeamById
    };
}
