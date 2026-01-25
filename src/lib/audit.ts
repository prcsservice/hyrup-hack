import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AuditAction =
    | 'UPDATE_SETTINGS'
    | 'BAN_USER'
    | 'PROMOTE_USER'
    | 'SHORTLIST_TEAM'
    | 'SEND_NOTIFICATION'
    | 'GENERATE_INVITE';

export async function logAction(adminEmail: string | null | undefined, action: AuditAction, target: string, metadata: any = {}) {
    if (!adminEmail) return;

    try {
        await addDoc(collection(db, "auditLogs"), {
            adminEmail,
            action,
            target,
            metadata,
            createdAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Audit Log Failed", e);
    }
}
