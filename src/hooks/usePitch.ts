import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, Timestamp, orderBy, addDoc } from 'firebase/firestore';
import { useTeam } from '@/context/TeamContext';
import { useToast } from '@/context/ToastContext';

export interface PitchSlot {
    id: string;
    startTime: Date;
    endTime: Date;
    teamId: string | null;
    meetLink: string;
    type: 'virtual';
    status: 'open' | 'booked' | 'completed';
}

export function usePitch() {
    const { team } = useTeam();
    const { showToast } = useToast();
    const [slots, setSlots] = useState<PitchSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [mySlot, setMySlot] = useState<PitchSlot | null>(null);

    // Fetch all slots (or specifically open/booked ones)
    const fetchSlots = async () => {
        setLoading(true);
        try {
            // Get all slots ordered by start time
            const q = query(collection(db, "presentationSlots"), orderBy("startTime", "asc"));
            const snapshot = await getDocs(q);

            const fetchedSlots: PitchSlot[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    startTime: data.startTime.toDate(),
                    endTime: data.endTime.toDate(),
                } as PitchSlot;
            });

            setSlots(fetchedSlots);

            // Check if team already has a slot
            if (team) {
                const booked = fetchedSlots.find(s => s.teamId === team.id);
                setMySlot(booked || null);
            }

        } catch (error) {
            console.error("Error fetching slots:", error);
            showToast("Failed to load pitch slots", "error");
        } finally {
            setLoading(false);
        }
    };

    const bookSlot = async (slotId: string) => {
        if (!team) return;

        try {
            const slotRef = doc(db, "presentationSlots", slotId);
            const teamRef = doc(db, "teams", team.id);

            // TODO: Ideally use a transaction here to prevent race conditions
            await updateDoc(slotRef, {
                teamId: team.id,
                status: 'booked'
            });

            await updateDoc(teamRef, {
                pitchSlotId: slotId
            });

            showToast("Slot successfully booked!", "success");
            await fetchSlots(); // Refresh

        } catch (error) {
            console.error("Error booking slot:", error);
            showToast("Failed to book slot. It might be taken.", "error");
        }
    };

    const seedSlots = async () => {
        // Dev tool to create some dummy slots
        const baseTime = new Date();
        baseTime.setDate(baseTime.getDate() + 1); // Tomorrow
        baseTime.setHours(10, 0, 0, 0); // Start at 10 AM

        try {
            for (let i = 0; i < 5; i++) {
                const start = new Date(baseTime.getTime() + i * 20 * 60000); // 20 min intervals
                const end = new Date(start.getTime() + 15 * 60000); // 15 min duration

                await addDoc(collection(db, "presentationSlots"), {
                    startTime: Timestamp.fromDate(start),
                    endTime: Timestamp.fromDate(end),
                    teamId: null,
                    meetLink: "https://meet.google.com/abc-defg-hij",
                    type: "virtual",
                    status: "open"
                });
            }
            showToast("Test slots created!", "success");
            fetchSlots();
        } catch (error) {
            console.error("Error seeding:", error);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [team?.id]);

    return {
        slots,
        loading,
        mySlot,
        bookSlot,
        seedSlots,
        formattedTime: (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        formattedDate: (date: Date) => date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
    };
}
