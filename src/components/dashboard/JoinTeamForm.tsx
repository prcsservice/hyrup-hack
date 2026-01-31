"use client";

import { useState } from "react";
import { ArrowRight, Hash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTeam } from "@/context/TeamContext";
import { competitionConfig } from "@/lib/config";

export function JoinTeamForm() {
    const { joinTeam } = useTeam();
    const [code, setCode] = useState("");
    const [position, setPosition] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            setError("Code must be 6 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await joinTeam(code, position);
        } catch (err: any) {
            setError("Invalid code or already joined.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-display font-semibold mb-1">Have an Invite?</h2>
                <p className="text-text-secondary text-sm">Enter the 6-character code.</p>
            </div>

            <form onSubmit={handleJoin} className="flex flex-col gap-3">
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="w-full bg-white/5 backdrop-blur-sm border border-stroke-primary p-3 pl-10 rounded-lg focus:border-accent outline-none font-mono text-lg uppercase placeholder:text-text-muted/60 transition-colors"
                        placeholder="XYZ123"
                    />
                </div>

                <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-sm border border-stroke-primary p-3 rounded-lg focus:border-accent outline-none text-sm text-white transition-colors"
                    required
                >
                    <option value="" disabled>Select Your Role</option>
                    {competitionConfig.squadRoles.filter(r => r.id !== 'leader').map(role => (
                        <option key={role.id} value={role.label}>{role.label}</option>
                    ))}
                </select>

                <Button disabled={loading || code.length < 6 || !position} className="w-full">
                    {loading ? "Joining..." : <>Join Squad <ArrowRight className="w-5 h-5 ml-2" /></>}
                </Button>
            </form>
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}
