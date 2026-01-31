import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Firestore document path: settings/admins
// Structure: { emails: ['admin1@email.com', 'admin2@email.com'] }

const ADMINS_DOC = doc(db, 'settings', 'admins');

// Default admin email (fallback if Firestore not initialized)
const DEFAULT_ADMIN = 'info.hyrup@gmail.com';

/**
 * Check if an email is in the admin list
 * First checks Firestore, falls back to default admin
 */
export async function isAdminEmail(email: string | null | undefined): Promise<boolean> {
    if (!email) return false;

    try {
        const docSnap = await getDoc(ADMINS_DOC);

        if (docSnap.exists()) {
            const adminEmails: string[] = docSnap.data().emails || [];
            return adminEmails.includes(email.toLowerCase());
        }

        // Fallback: check default admin and initialize Firestore doc
        if (email.toLowerCase() === DEFAULT_ADMIN) {
            // Initialize the admins document with default admin
            await setDoc(ADMINS_DOC, { emails: [DEFAULT_ADMIN] });
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking admin status:', error);
        // Fallback to default admin on error
        return email.toLowerCase() === DEFAULT_ADMIN;
    }
}

/**
 * Add an email to the admin list (admin only operation)
 */
export async function addAdmin(email: string): Promise<boolean> {
    try {
        await setDoc(ADMINS_DOC, {
            emails: arrayUnion(email.toLowerCase())
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error adding admin:', error);
        return false;
    }
}

/**
 * Remove an email from the admin list (admin only operation)
 */
export async function removeAdmin(email: string): Promise<boolean> {
    try {
        await setDoc(ADMINS_DOC, {
            emails: arrayRemove(email.toLowerCase())
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error removing admin:', error);
        return false;
    }
}

/**
 * Get all admin emails
 */
export async function getAdminEmails(): Promise<string[]> {
    try {
        const docSnap = await getDoc(ADMINS_DOC);
        if (docSnap.exists()) {
            return docSnap.data().emails || [];
        }
        return [DEFAULT_ADMIN];
    } catch (error) {
        console.error('Error fetching admins:', error);
        return [DEFAULT_ADMIN];
    }
}
