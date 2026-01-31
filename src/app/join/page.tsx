"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TeamProvider, useTeam } from "@/context/TeamContext";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function JoinPageContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const { user, signInWithGoogle, loading: authLoading } = useAuth();
    const { joinTeam, team } = useTeam(); // team is user's CURRENT team
    const router = useRouter();

    const [status, setStatus] = useState<"idle" | "joining" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!code) {
            setStatus("error");
            setErrorMsg("No invite code provided.");
        }
    }, [code]);

    const handleJoin = async () => {
        if (!code) return;
        setStatus("joining");
        try {
            await joinTeam(code, "Member");
            setStatus("success");
            setTimeout(() => router.push("/dashboard"), 1500);
        } catch (err: any) {
            setStatus("error");
            setErrorMsg(err.message || "Failed to join team. Code may be invalid or you are already in a team.");
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center text-text-muted">Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-bg-primary text-center">
            <div className="max-w-md w-full space-y-8 bg-bg-secondary p-8 border border-stroke-primary rounded-sm">

                <h1 className="text-2xl font-display font-bold">Team Invite</h1>

                {/* STATE: SUCCESS */}
                {status === "success" && (
                    <div className="text-accent space-y-2">
                        <div className="text-4xl">🎉</div>
                        <p>Successfully joined the squad!</p>
                        <p className="text-sm text-text-muted">Redirecting to Base Camp...</p>
                    </div>
                )}

                {/* STATE: ERROR */}
                {status === "error" && (
                    <div className="space-y-4">
                        <div className="text-4xl">⚠️</div>
                        <p className="text-red-500">{errorMsg}</p>
                        <Link href="/dashboard">
                            <Button variant="secondary" className="w-full">Go to Dashboard</Button>
                        </Link>
                    </div>
                )}

                {/* STATE: IDLE / JOINING */}
                {(status === "idle" || status === "joining") && (
                    <div className="space-y-6">
                        <div className="p-4 bg-bg-tertiary border border-stroke-divider font-mono text-xl tracking-widest uppercase">
                            {code}
                        </div>

                        {!user ? (
                            <div className="space-y-4">
                                <p className="text-text-secondary">You must be signed in to join this team.</p>
                                <Button onClick={() => signInWithGoogle()} size="lg" className="w-full">
                                    Sign In with Google
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {team ? (
                                    <p className="text-yellow-500 text-sm">
                                        Warning: You are already in a team ({team.name}). Joining a new team requires leaving your current one first.
                                    </p>
                                ) : (
                                    <p className="text-text-secondary">Ready to join this squad?</p>
                                )}

                                <Button onClick={handleJoin} disabled={status === "joining"} className="w-full">
                                    {status === "joining" ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Joining...
                                        </>
                                    ) : (
                                        <>
                                            Accept Invite
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default function JoinPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TeamProvider>
                <JoinPageContent />
            </TeamProvider>
        </Suspense>
    );
}
