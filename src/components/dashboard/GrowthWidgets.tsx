"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Briefcase, Share2, Copy, Users, Zap, Award, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function GrowthWidgets() {
    return (
        <div className="flex flex-col gap-4">
            <ViralLoopWidget />
            <HyrupPromoWidget />
        </div>
    );
}

function ViralLoopWidget() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [copied, setCopied] = useState(false);
    const [referralCount, setReferralCount] = useState(0);

    useEffect(() => {
        const fetchReferralCount = async () => {
            if (!user) return;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setReferralCount(userDoc.data().referralCount || 0);
            }
        };
        fetchReferralCount();
    }, [user]);

    const target = 3;
    const progress = Math.min((referralCount / target) * 100, 100);
    const isUnlocked = referralCount >= target;

    const referralLink = user ? `https://fixforward.xyz/register?ref=${user.uid}` : "Loading...";

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        showToast("Referral link copied!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-bg-secondary border border-stroke-primary p-5 rounded-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-display font-bold text-white flex items-center gap-2">
                        <Users size={16} className="text-accent" />
                        Unlock <span className="text-accent">VIP Badge</span>
                    </h3>
                    <span className="text-xs font-mono text-white/50">{referralCount}/{target} Friends</span>
                </div>

                <div className="w-full h-1.5 bg-bg-tertiary rounded-full mb-4 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ease-out ${isUnlocked ? 'bg-green-500' : 'bg-accent'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {isUnlocked ? (
                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 p-4 rounded-lg mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Award size={20} className="text-green-400" />
                        </div>
                        <div>
                            <p className="font-bold text-green-400 flex items-center gap-1">
                                <CheckCircle size={12} /> Reward Unlocked!
                            </p>
                            <p className="text-xs text-green-400/70">Founding Member badge + Early certificate</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-text-secondary mb-4">
                        Invite 3 friends to earn the "Founding Member" badge & early certificate access.
                    </p>
                )}

                <div className="flex gap-2">
                    <div className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white/70 truncate">
                        {referralLink}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="bg-bg-tertiary hover:bg-white/10 border border-white/10 rounded px-3 transition-colors text-white"
                        title="Copy Link"
                    >
                        {copied ? <Zap size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Join FixForward',
                                    text: 'Join me on FixForward & HYRUP!',
                                    url: referralLink,
                                });
                            }
                        }}
                        className="bg-accent text-bg-primary hover:bg-accent/90 rounded px-3 transition-colors font-bold"
                    >
                        <Share2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function HyrupPromoWidget() {
    return (
        <div className="bg-linear-to-br from-[#050505] to-[#111] border border-white/10 p-5 rounded-sm relative group overflow-hidden">
            {/* Hover Reveal Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-[#FF4D00] tracking-widest uppercase border border-[#FF4D00]/20 px-1.5 py-0.5 rounded-sm">
                        CAREER
                    </span>
                    <Briefcase size={14} className="text-white/40" />
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-1 group-hover:text-[#FF4D00] transition-colors">
                    Looking for Internships?
                </h3>

                <p className="text-xs text-white/60 mb-4 leading-relaxed">
                    FixForward is just step 1. Build your profile on HYRUP to get discovered for jobs & mentorship.
                </p>

                <a
                    href="https://hyrup.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF4D00]/50 p-3 rounded-sm transition-all group-hover:pl-4"
                >
                    <span className="text-xs font-bold text-white">Create Hyrup Profile</span>
                    <ArrowRight size={14} className="text-[#FF4D00] group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </div>
    );
}
