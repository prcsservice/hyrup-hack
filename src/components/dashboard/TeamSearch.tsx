"use client";

import { useState } from "react";
import { Search, Users, Rocket, Zap, Shield, Cpu, Flame, Target, Anchor, Gem } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTeam, Team } from "@/context/TeamContext";

const ICONS: Record<string, any> = {
    rocket: Rocket,
    zap: Zap,
    shield: Shield,
    cpu: Cpu,
    flame: Flame,
    target: Target,
    anchor: Anchor,
    gem: Gem
};

export function TeamSearch() {
    const { searchTeams } = useTeam();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Team[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (val: string) => {
        setQuery(val);
        if (val.length > 2) {
            const res = await searchTeams(val);
            setResults(res);
            setShowResults(true);
        } else {
            setResults([]);
            setShowResults(false);
        }
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-bg-tertiary border border-stroke-divider p-2 pl-9 rounded-sm text-sm focus:border-accent outline-none"
                    placeholder="Search teams by name..."
                />
            </div>

            {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-stroke-primary rounded-sm shadow-2xl z-20 max-h-60 overflow-y-auto">
                    {results.length === 0 ? (
                        <div className="p-4 text-center text-text-muted text-sm">No teams found.</div>
                    ) : (
                        results.map(team => {
                            const TeamIcon = ICONS[team.theme.emoji] || Rocket;
                            return (
                                <div key={team.id} className="p-3 border-b border-stroke-divider flex items-center justify-between hover:bg-bg-tertiary">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-bg-primary border border-stroke-primary" style={{ borderColor: team.theme.color }}>
                                            <TeamIcon size={14} style={{ color: team.theme.color }} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">{team.name}</div>
                                            <div className="text-xs text-text-muted flex items-center gap-1">
                                                <Users className="w-3 h-3" /> {team.members.length}/4
                                            </div>
                                        </div>
                                    </div>
                                    {/* Request to Join button could go here - keeping it simple for now */}
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    );
}
