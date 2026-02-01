"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    role: 'student' | 'judge' | 'admin';
    teamId: string | null;
    onboarded: boolean;
    loading: boolean;
    signInWithGoogle: () => Promise<User>;
    signOut: () => Promise<void>;
    claimJudgeAccess: (passkey: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: 'student',
    teamId: null,
    onboarded: false,
    loading: true,
    signInWithGoogle: async () => { throw new Error('AuthProvider not initialized'); },
    signOut: async () => { },
    claimJudgeAccess: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<'student' | 'judge' | 'admin'>('student');
    const [teamId, setTeamId] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [onboarded, setOnboarded] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let userUnsub: (() => void) | null = null;

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                await checkOrCreateUser(currentUser);

                // Fetch Role & Onboarding Status - setLoading(false) AFTER we get data
                userUnsub = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setRole(data.role || 'student');
                        setTeamId(data.teamId || null);
                        setOnboarded(!!data.onboarded);
                    }
                    setLoading(false); // Only set loading false after we have the user data
                });
            } else {
                setRole('student');
                setTeamId(null);
                setOnboarded(false);
                setLoading(false);
            }
        });

        return () => {
            unsubscribe();
            if (userUnsub) userUnsub();
        };
    }, []);

    const checkOrCreateUser = async (user: User) => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        // Check admin status from Firestore
        const { isAdminEmail } = await import('@/lib/adminCheck');
        const isAdmin = await isAdminEmail(user.email);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                teamId: null,
                role: isAdmin ? 'admin' : 'student',
                onboarded: false,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                referralCount: 0
            });

            // HANDLE REFERRAL
            const refCode = localStorage.getItem("hyrup_referral");
            if (refCode && refCode !== user.uid) { // Don't refer self
                try {
                    // 1. Mark this user as referred
                    await updateDoc(userRef, { referredBy: refCode });

                    // 2. Increment referrer's count
                    const referrerRef = doc(db, "users", refCode);
                    await updateDoc(referrerRef, {
                        referralCount: increment(1)
                    });

                    localStorage.removeItem("hyrup_referral"); // Clear after use
                } catch (err) {
                    console.error("Referral tracking failed:", err);
                }
            }
        } else {
            // Updated Last Login - Only if > 1 hour has passed
            const data = userSnap.data();
            const lastLogin = data.lastLogin?.toDate();
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            if (!lastLogin || lastLogin < oneHourAgo) {
                await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
            }
        }
        // Note: setLoading(false) is now handled in onSnapshot callback
    };

    const claimJudgeAccess = async (passkey: string) => {
        if (!user || (!user.email)) return false;

        try {
            const q = query(
                collection(db, "judgeInvites"),
                where("email", "==", user.email.toLowerCase()),
                where("passkey", "==", passkey),
                where("used", "==", false)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) return false;

            const inviteDoc = snapshot.docs[0];

            await setDoc(doc(db, "judgeInvites", inviteDoc.id), {
                used: true,
                usedAt: serverTimestamp(),
                claimedByUid: user.uid
            }, { merge: true });

            await setDoc(doc(db, "users", user.uid), { role: 'judge' }, { merge: true });
            setRole('judge');

            return true;
        } catch (error) {
            console.error("Error claiming judge access:", error);
            return false;
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user; // Return user so caller can handle navigation
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, teamId, onboarded, loading, signInWithGoogle, signOut, claimJudgeAccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
