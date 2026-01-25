"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    role: 'student' | 'judge' | 'admin';
    onboarded: boolean;
    loading: boolean;
    signInWithGoogle: () => Promise<User>;
    signOut: () => Promise<void>;
    claimJudgeAccess: (passkey: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: 'student',
    onboarded: false,
    loading: true,
    signInWithGoogle: async () => { throw new Error('AuthProvider not initialized'); },
    signOut: async () => { },
    claimJudgeAccess: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [role, setRole] = useState<'student' | 'judge' | 'admin'>('student');
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
                        setOnboarded(!!data.onboarded);
                    }
                    setLoading(false); // Only set loading false after we have the user data
                });
            } else {
                setRole('student');
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

        const isAdmin = user.email === 'info.hyrup@gmail.com';

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                paymentStatus: 'pending',
                teamId: null,
                role: isAdmin ? 'admin' : 'student',
                onboarded: false, // Default
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
            });
        } else {
            // Updated Last Login
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
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
        <AuthContext.Provider value={{ user, role, onboarded, loading, signInWithGoogle, signOut, claimJudgeAccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
