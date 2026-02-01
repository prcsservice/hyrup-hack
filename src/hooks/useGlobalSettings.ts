import { useSettings } from "@/context/SettingsContext";

export interface GlobalSettings {
    registrationsOpen: boolean;
    submissionsOpen: boolean;
    resultsPublished: boolean;
    maintenanceMode: boolean;
    registrationDeadline?: string;
    ideaDeadline?: string;
    prototypeDeadline?: string;
}

const DEFAULT_SETTINGS: GlobalSettings = {
    registrationsOpen: true,
    submissionsOpen: true,
    resultsPublished: false,
    maintenanceMode: false,
};

/**
 * Hook to access global settings in any component
 * Settings are fetched from Firestore and updated in real-time
 */
export function useGlobalSettings() {
    // Consume context instead of local state/effect
    const { settings: contextSettings, loading } = useSettings();
    const settings = contextSettings as unknown as GlobalSettings;

    // Removed local state and useEffect
    // const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const unsub = onSnapshot(doc(db, 'settings', 'public'), (docSnap) => {
    //         if (docSnap.exists()) {
    //             setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() } as GlobalSettings);
    //         }
    //         setLoading(false);
    //     });
    //     return () => unsub();
    // }, []);

    // Helper functions
    const isRegistrationOpen = () => {
        if (!settings.registrationsOpen) return false;
        if (settings.registrationDeadline) {
            return new Date() < new Date(settings.registrationDeadline);
        }
        return true;
    };

    const isSubmissionOpen = () => {
        if (!settings.submissionsOpen) return false;
        if (settings.ideaDeadline) {
            return new Date() < new Date(settings.ideaDeadline);
        }
        return true;
    };

    const isPrototypeOpen = () => {
        if (!settings.submissionsOpen) return false;
        if (settings.prototypeDeadline) {
            return new Date() < new Date(settings.prototypeDeadline);
        }
        return true;
    };

    const getTimeRemaining = (deadline: string | undefined) => {
        if (!deadline) return null;
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff <= 0) return 'Deadline passed';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h remaining`;
        if (hours > 0) return `${hours}h remaining`;
        return 'Less than an hour remaining';
    };

    return {
        settings,
        loading,
        isRegistrationOpen,
        isSubmissionOpen,
        isPrototypeOpen,
        getTimeRemaining,
        registrationTimeRemaining: getTimeRemaining(settings.registrationDeadline),
        ideaTimeRemaining: getTimeRemaining(settings.ideaDeadline),
        prototypeTimeRemaining: getTimeRemaining(settings.prototypeDeadline),
    };
}
