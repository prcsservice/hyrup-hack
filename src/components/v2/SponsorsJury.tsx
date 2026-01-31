"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { ExternalLink, Linkedin } from "lucide-react";
import Image from "next/image";

interface SponsorItem {
    id: string;
    name: string;
    logo: string;
    tier: 'platinum' | 'gold' | 'silver' | 'bronze';
    website?: string;
    revealed: boolean;
}

interface JuryItem {
    id: string;
    name: string;
    photo: string;
    designation: string;
    company: string;
    linkedIn?: string;
    revealed: boolean;
}

const TIER_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export function SponsorsSection() {
    const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "content", "sponsors"), (d) => {
            if (d.exists()) {
                const items = (d.data().items || []) as SponsorItem[];
                // Only show revealed sponsors, sorted by tier
                const revealed = items
                    .filter(s => s.revealed)
                    .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));
                setSponsors(revealed);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) return <div className="py-20 text-center text-text-muted">Loading sponsors...</div>;
    if (sponsors.length === 0) return null;

    const tierStyles = {
        platinum: { size: 'w-40 h-20', border: 'border-purple-500/30' },
        gold: { size: 'w-32 h-16', border: 'border-yellow-500/30' },
        silver: { size: 'w-28 h-14', border: 'border-gray-400/30' },
        bronze: { size: 'w-24 h-12', border: 'border-orange-500/30' },
    };

    return (
        <section className="py-20 bg-bg-secondary">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Sponsors</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Backed by industry leaders who believe in student innovation
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center items-center gap-8">
                    {sponsors.map((sponsor, i) => (
                        <motion.a
                            key={sponsor.id}
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative ${tierStyles[sponsor.tier].size} bg-bg-tertiary border ${tierStyles[sponsor.tier].border} rounded-lg p-4 flex items-center justify-center hover:border-accent/50 transition-colors group`}
                        >
                            {sponsor.logo ? (
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all"
                                />
                            ) : (
                                <span className="text-sm text-text-muted">{sponsor.name}</span>
                            )}
                            {sponsor.website && (
                                <ExternalLink size={12} className="absolute top-1 right-1 text-text-muted opacity-0 group-hover:opacity-50" />
                            )}
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function JurySection() {
    const [jury, setJury] = useState<JuryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "content", "jury"), (d) => {
            if (d.exists()) {
                const items = (d.data().items || []) as JuryItem[];
                setJury(items.filter(j => j.revealed));
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) return <div className="py-20 text-center text-text-muted">Loading jury...</div>;
    if (jury.length === 0) return null;

    return (
        <section className="py-20">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Meet the Jury</h2>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                        Industry experts who will evaluate and guide your solutions
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {jury.map((judge, i) => (
                        <motion.div
                            key={judge.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-bg-secondary border border-stroke-primary rounded-lg overflow-hidden group"
                        >
                            <div className="aspect-square relative bg-bg-tertiary">
                                {judge.photo ? (
                                    <img
                                        src={judge.photo}
                                        alt={judge.name}
                                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                                )}
                                {judge.linkedIn && (
                                    <a
                                        href={judge.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute bottom-2 right-2 w-8 h-8 bg-[#0077B5] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Linkedin size={16} className="text-white" />
                                    </a>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-display font-bold text-white">{judge.name}</h3>
                                <p className="text-sm text-accent">{judge.designation}</p>
                                <p className="text-xs text-text-muted">{judge.company}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
