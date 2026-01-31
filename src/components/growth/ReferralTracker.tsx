"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            console.log("Referral code captured:", ref);
            localStorage.setItem("hyrup_referral", ref);
        }
    }, [searchParams]);

    return null;
}
