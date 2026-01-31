"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { competitionConfig } from "@/lib/config";
import { Filter, Loader2, CheckCircle, Clock, Users } from "lucide-react";

interface TeamSubmission {
    id: string;
    name: string;
    track: string;
    domain: string;
    submissionStatus: string;
    problemStatement: string;
    memberCount: number;
}

export default function AdminSubmissionsPage() {
    const [teams, setTeams] = useState<TeamSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrack, setSelectedTrack] = useState<string>("all");

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const snapshot = await getDocs(collection(db, "teams"));
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name || "Unnamed",
                    track: doc.data().track || "unassigned",
                    domain: doc.data().domain || "—",
                    submissionStatus: doc.data().submissionStatus || "pending",
                    problemStatement: doc.data().problemStatement || "",
                    memberCount: (doc.data().members || []).length,
                }));
                setTeams(data);
            } catch (error) {
                console.error("Error fetching submissions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const filteredTeams = selectedTrack === "all"
        ? teams
        : teams.filter(t => t.track === selectedTrack);

    const getTrackLabel = (trackId: string) => {
        const track = competitionConfig.solutionTracks.find(t => t.id === trackId);
        return track?.label || "Unassigned";
    };

    const getTrackColor = (trackId: string) => {
        const colors: Record<string, string> = {
            tech: "text-blue-400 bg-blue-500/10",
            medical: "text-green-400 bg-green-500/10",
            business: "text-yellow-400 bg-yellow-500/10",
            design: "text-pink-400 bg-pink-500/10",
        };
        return colors[trackId] || "text-gray-400 bg-gray-500/10";
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold mb-2">Submissions</h1>
                <p className="text-text-secondary">Review and filter team submissions by Solution Track.</p>
            </div>

            {/* Track Filter */}
            <div className="flex items-center gap-4 bg-bg-secondary border border-stroke-primary p-4 rounded-sm">
                <Filter size={18} className="text-text-muted" />
                <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="bg-bg-tertiary border border-stroke-primary p-2 rounded-sm text-white text-sm outline-none focus:border-accent"
                >
                    <option value="all">All Tracks ({teams.length})</option>
                    {competitionConfig.solutionTracks.map(track => (
                        <option key={track.id} value={track.id}>
                            {track.label} ({teams.filter(t => t.track === track.id).length})
                        </option>
                    ))}
                    <option value="unassigned">Unassigned ({teams.filter(t => !t.track || t.track === "unassigned").length})</option>
                </select>

                <div className="ml-auto text-xs text-text-muted font-mono">
                    Showing {filteredTeams.length} of {teams.length} teams
                </div>
            </div>

            {/* Teams Table */}
            {loading ? (
                <div className="flex items-center justify-center py-16 text-text-muted">
                    <Loader2 className="animate-spin mr-2" /> Loading submissions...
                </div>
            ) : filteredTeams.length === 0 ? (
                <div className="text-center py-16 text-text-muted bg-bg-secondary border border-stroke-divider rounded-sm">
                    No submissions found for this filter.
                </div>
            ) : (
                <div className="bg-bg-secondary border border-stroke-primary rounded-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-bg-tertiary border-b border-stroke-primary">
                            <tr>
                                <th className="text-left px-4 py-3 font-mono text-xs text-text-muted uppercase">Team</th>
                                <th className="text-left px-4 py-3 font-mono text-xs text-text-muted uppercase">Track</th>
                                <th className="text-left px-4 py-3 font-mono text-xs text-text-muted uppercase">Domain</th>
                                <th className="text-left px-4 py-3 font-mono text-xs text-text-muted uppercase">Status</th>
                                <th className="text-left px-4 py-3 font-mono text-xs text-text-muted uppercase">Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeams.map((team) => (
                                <tr key={team.id} className="border-b border-stroke-divider hover:bg-bg-tertiary/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-white">{team.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded ${getTrackColor(team.track)}`}>
                                            {getTrackLabel(team.track)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-text-secondary">{team.domain}</td>
                                    <td className="px-4 py-3">
                                        {team.submissionStatus === "submitted" ? (
                                            <span className="flex items-center gap-1 text-green-400 text-xs">
                                                <CheckCircle size={12} /> Submitted
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-yellow-400 text-xs">
                                                <Clock size={12} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 text-text-muted">
                                            <Users size={12} /> {team.memberCount}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
