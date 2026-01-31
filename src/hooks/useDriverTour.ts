"use client";

import { useEffect, useState, useCallback } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const TOUR_STEPS = [
    {
        element: '[data-tour="welcome"]',
        popover: {
            title: "Welcome to FixForward! 🚀",
            description: "Let's take a quick tour to help you navigate and make the most of your hackathon experience.",
            side: "bottom" as const,
            align: "center" as const,
        },
    },
    {
        element: '[data-tour="progress"]',
        popover: {
            title: "Your Progress Tracker",
            description: "Track your journey through the hackathon stages. Complete each milestone to advance.",
            side: "bottom" as const,
            align: "center" as const,
        },
    },
    {
        element: '[data-tour="countdown"]',
        popover: {
            title: "Deadline Timer ⏱️",
            description: "Keep an eye on upcoming deadlines. The timer changes color as deadlines approach.",
            side: "bottom" as const,
            align: "center" as const,
        },
    },
    {
        element: '[data-tour="team"]',
        popover: {
            title: "Your Team",
            description: "Create or join a team to collaborate. Invite friends using your team's invite code!",
            side: "top" as const,
            align: "center" as const,
        },
    },
    {
        element: '[data-tour="actions"]',
        popover: {
            title: "Quick Actions",
            description: "Access common actions like inviting members, submitting ideas, and getting support.",
            side: "top" as const,
            align: "center" as const,
        },
    },
    {
        element: '[data-tour="chat"]',
        popover: {
            title: "Team Chat 💬",
            description: "Communicate with your team members in real-time using the chat feature.",
            side: "left" as const,
            align: "center" as const,
        },
    },
    {
        element: '[data-tour="faq"]',
        popover: {
            title: "FAQ Assistant 🤖",
            description: "Got questions? Our AI-powered FAQ bot can help you find answers instantly!",
            side: "left" as const,
            align: "center" as const,
        },
    },
];

export function useDriverTour() {
    const { user } = useAuth();
    const [tourCompleted, setTourCompleted] = useState<boolean | null>(null);
    const [driverObj, setDriverObj] = useState<Driver | null>(null);

    // Check if tour is completed in Firebase
    useEffect(() => {
        const checkTourStatus = async () => {
            if (!user) return;

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setTourCompleted(data.tourCompleted || false);
                } else {
                    setTourCompleted(false);
                }
            } catch (error) {
                console.error("Error checking tour status:", error);
                setTourCompleted(false);
            }
        };

        checkTourStatus();
    }, [user]);

    // Mark tour as complete in Firebase
    const completeTour = useCallback(async () => {
        if (!user) return;

        try {
            await updateDoc(doc(db, "users", user.uid), {
                tourCompleted: true,
            });
            setTourCompleted(true);
        } catch (error) {
            console.error("Error saving tour completion:", error);
        }
    }, [user]);

    // Initialize Driver.js
    useEffect(() => {
        if (tourCompleted !== false) return;

        // Small delay to ensure DOM elements are ready
        const timer = setTimeout(() => {
            const driverInstance = driver({
                showProgress: true,
                animate: true,
                overlayColor: "rgba(0, 0, 0, 0.75)",
                stagePadding: 8,
                stageRadius: 8,
                popoverClass: "driver-popover-custom",
                nextBtnText: "Next →",
                prevBtnText: "← Back",
                doneBtnText: "Let's Go! 🚀",
                showButtons: ["next", "previous"],
                steps: TOUR_STEPS,
                onDestroyStarted: () => {
                    completeTour();
                    driverInstance.destroy();
                },
            });

            setDriverObj(driverInstance);
            driverInstance.drive();
        }, 1500);

        return () => clearTimeout(timer);
    }, [tourCompleted, completeTour]);

    // Manual restart function
    const restartTour = useCallback(async () => {
        if (!user) return;

        try {
            await updateDoc(doc(db, "users", user.uid), {
                tourCompleted: false,
            });
            setTourCompleted(false);
        } catch (error) {
            console.error("Error restarting tour:", error);
        }
    }, [user]);

    return { tourCompleted, restartTour, driverObj };
}
