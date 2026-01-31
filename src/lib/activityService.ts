import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';

export type ActivityType =
    | 'team_created'
    | 'idea_submitted'
    | 'user_joined'
    | 'prototype_submitted'
    | 'milestone_unlocked';

export interface Activity {
    id: string;
    type: ActivityType;
    message: string;
    teamName?: string;
    userName?: string;
    createdAt: Timestamp;
}

/**
 * Log an activity to the global feed
 */
export async function logActivity(
    type: ActivityType,
    payload: { teamName?: string; userName?: string; customMessage?: string }
): Promise<void> {
    const messages: Record<ActivityType, string> = {
        team_created: `Team "${payload.teamName}" just formed!`,
        idea_submitted: `${payload.teamName || 'A team'} submitted their idea`,
        user_joined: `${payload.userName || 'Someone'} joined the hackathon`,
        prototype_submitted: `${payload.teamName || 'A team'} submitted their prototype`,
        milestone_unlocked: payload.customMessage || 'Milestone unlocked!',
    };

    try {
        await addDoc(collection(db, 'activities'), {
            type,
            message: messages[type],
            teamName: payload.teamName || null,
            userName: payload.userName || null,
            createdAt: serverTimestamp(),
            // TTL: Auto-delete after 24 hours (requires Firestore TTL policy)
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
}

/**
 * Subscribe to recent activities
 */
export function subscribeToActivities(
    callback: (activities: Activity[]) => void,
    limitCount: number = 10
): () => void {
    const q = query(
        collection(db, 'activities'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Activity[];
        callback(activities);
    });
}

/**
 * Get aggregate stats for the activity feed
 */
export function subscribeToStats(
    callback: (stats: { teamsToday: number; usersToday: number }) => void
): () => void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
        collection(db, 'activities'),
        where('createdAt', '>=', Timestamp.fromDate(today))
    );

    return onSnapshot(q, (snapshot) => {
        let teamsToday = 0;
        let usersToday = 0;

        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.type === 'team_created') teamsToday++;
            if (data.type === 'user_joined') usersToday++;
        });

        callback({ teamsToday, usersToday });
    });
}
