import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    limit,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderPhoto?: string;
    text: string;
    createdAt: Timestamp;
}

/**
 * Send a message to a team's chat
 */
export async function sendMessage(
    teamId: string,
    user: { uid: string; displayName: string | null; photoURL: string | null },
    text: string
): Promise<void> {
    if (!text.trim()) return;

    await addDoc(collection(db, 'teams', teamId, 'messages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        senderPhoto: user.photoURL || null,
        text: text.trim(),
        createdAt: serverTimestamp(),
    });
}

/**
 * Subscribe to a team's chat messages
 */
export function subscribeToMessages(
    teamId: string,
    callback: (messages: ChatMessage[]) => void,
    limitCount: number = 50
): () => void {
    const q = query(
        collection(db, 'teams', teamId, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as ChatMessage[];
        callback(messages);
    });
}
