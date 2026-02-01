"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface GlobalSettings {
    registrationDeadline?: string;
    hackathonDate?: string;
    showWinners?: boolean;
    announcement?: string;
    [key: string]: any;
}

interface SettingsContextType {
    settings: GlobalSettings;
    loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: {},
    loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<GlobalSettings>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Single listener for global settings
        const unsub = onSnapshot(doc(db, "settings", "public"), (docSnap) => {
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            } else {
                setSettings({});
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching settings:", error);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
