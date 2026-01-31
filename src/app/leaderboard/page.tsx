"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Trophy, Users, ArrowUp, School, Star } from "lucide-react";
import { motion } from "framer-motion";

interface CollegeStats {
    name: string;
    count: number;
    rank: number;
}

export default function LeaderboardPage() {
    const [colleges, setColleges] = useState<CollegeStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Fetch all users and aggregate by college
                const usersSnapshot = await getDocs(collection(db, "users"));
                const collegeCounts: Record<string, number> = {};

                usersSnapshot.docs.forEach(doc => {
                    const college = doc.data().college || "Unknown";
                    collegeCounts[college] = (collegeCounts[college] || 0) + 1;
                });

                // Sort by count and create ranked list
                const sortedColleges = Object.entries(collegeCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 20) // Top 20
                    .map(([name, count], index) => ({
                        name,
                        count,
                        rank: index + 1,
                    }));

                setColleges(sortedColleges);
                setTotalUsers(usersSnapshot.docs.length);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankStyle = (rank: number) => {
        if (rank === 1) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
        if (rank === 2) return "bg-gray-400/20 text-gray-300 border-gray-400/40";
        if (rank === 3) return "bg-amber-600/20 text-amber-500 border-amber-600/40";
        return "bg-bg-tertiary text-text-muted border-stroke-primary";
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy size={20} className="text-yellow-400" />;
        if (rank === 2) return <Star size={20} className="text-gray-300" />;
        if (rank === 3) return <Star size={20} className="text-amber-500" />;
        return <span className="text-sm font-mono">#{rank}</span>;
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-24 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 rounded-full mb-4">
                        <School size={16} className="text-accent" />
                        <span className="text-xs font-mono text-accent uppercase tracking-wider">College Leaderboard</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        Which Campus <span className="text-accent">Dominates</span>?
                    </h1>
                    <p className="text-text-secondary max-w-xl mx-auto">
                        Compete for glory! The college with most registrations gets featured and earns bragging rights.
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-bg-secondary border border-stroke-primary p-4 rounded-lg text-center">
                        <Users size={20} className="mx-auto text-accent mb-2" />
                        <p className="text-2xl font-bold">{totalUsers}</p>
                        <p className="text-xs text-text-muted">Total Participants</p>
                    </div>
                    <div className="bg-bg-secondary border border-stroke-primary p-4 rounded-lg text-center">
                        <School size={20} className="mx-auto text-accent mb-2" />
                        <p className="text-2xl font-bold">{colleges.length}</p>
                        <p className="text-xs text-text-muted">Colleges</p>
                    </div>
                    <div className="bg-bg-secondary border border-stroke-primary p-4 rounded-lg text-center col-span-2 md:col-span-2">
                        <Trophy size={20} className="mx-auto text-yellow-400 mb-2" />
                        <p className="text-xl font-bold text-yellow-400">{colleges[0]?.name || "—"}</p>
                        <p className="text-xs text-text-muted">Current Leader</p>
                    </div>
                </motion.div>

                {/* Leaderboard Table */}
                {loading ? (
                    <div className="text-center py-16 text-text-muted">
                        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                        Loading leaderboard...
                    </div>
                ) : colleges.length === 0 ? (
                    <div className="text-center py-16 text-text-muted bg-bg-secondary border border-stroke-divider rounded-lg">
                        No participants yet. Be the first!
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-bg-secondary border border-stroke-primary rounded-lg overflow-hidden"
                    >
                        <table className="w-full">
                            <thead className="bg-bg-tertiary border-b border-stroke-primary">
                                <tr>
                                    <th className="text-left px-6 py-4 font-mono text-xs text-text-muted uppercase">Rank</th>
                                    <th className="text-left px-6 py-4 font-mono text-xs text-text-muted uppercase">College</th>
                                    <th className="text-right px-6 py-4 font-mono text-xs text-text-muted uppercase">Participants</th>
                                </tr>
                            </thead>
                            <tbody>
                                {colleges.map((college, index) => (
                                    <motion.tr
                                        key={college.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-stroke-divider hover:bg-bg-tertiary/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getRankStyle(college.rank)}`}>
                                                {getRankIcon(college.rank)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-medium ${college.rank <= 3 ? 'text-white' : 'text-text-secondary'}`}>
                                                {college.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-mono text-lg ${college.rank === 1 ? 'text-yellow-400' : 'text-white'}`}>
                                                {college.count}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-center"
                >
                    <p className="text-text-secondary text-sm mb-4">
                        Share FixForward with your classmates to boost your college's ranking!
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg-primary px-6 py-3 rounded-lg font-bold transition-colors"
                    >
                        <ArrowUp size={16} />
                        Register & Represent
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
