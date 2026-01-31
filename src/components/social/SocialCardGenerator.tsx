"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Linkedin, Share2, Check, Copy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import { Button } from "@/components/ui/Button";

type CardType = 'participation' | 'team' | 'achievement';

interface SocialCardProps {
    type?: CardType;
    customTitle?: string;
    customSubtitle?: string;
}

export function SocialCardGenerator({ type = 'participation', customTitle, customSubtitle }: SocialCardProps) {
    const { user } = useAuth();
    const { team } = useTeam();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [copied, setCopied] = useState(false);

    const generateCard = async (): Promise<string | null> => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Card dimensions (LinkedIn recommended: 1200x627)
        canvas.width = 1200;
        canvas.height = 627;

        // Background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0A0A0A');
        gradient.addColorStop(1, '#1A1A1A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Accent strip
        ctx.fillStyle = '#FF4D00';
        ctx.fillRect(0, 0, 8, canvas.height);

        // Corner accent
        ctx.beginPath();
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(canvas.width - 200, 0);
        ctx.lineTo(canvas.width, 200);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 77, 0, 0.1)';
        ctx.fill();

        // Title
        ctx.font = 'bold 72px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        const title = customTitle || (type === 'participation'
            ? "I'm participating in"
            : type === 'team'
                ? `Team ${team?.name || 'Innovation'}`
                : "Achievement Unlocked");
        ctx.fillText(title, 60, 180);

        // FixForward branding
        ctx.font = 'bold 96px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#FF4D00';
        ctx.fillText('FIXFORWARD', 60, 300);

        // Subtitle
        ctx.font = '32px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#888888';
        const subtitle = customSubtitle || 'by HYRUP - The National Innovation Challenge';
        ctx.fillText(subtitle, 60, 370);

        // User info
        if (user) {
            ctx.font = '28px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(user.displayName || 'Participant', 60, 480);

            ctx.font = '24px Inter, system-ui, sans-serif';
            ctx.fillStyle = '#666666';
            ctx.fillText(user.email || '', 60, 520);
        }

        // Team badge if applicable
        if (team && type !== 'team') {
            ctx.fillStyle = 'rgba(255, 77, 0, 0.1)';
            ctx.fillRect(60, 540, 300, 40);
            ctx.fillStyle = '#FF4D00';
            ctx.font = '20px Inter, system-ui, sans-serif';
            ctx.fillText(`Team: ${team.name}`, 75, 568);
        }

        // Footer
        ctx.font = '20px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#444444';
        ctx.fillText('fixforward.hyrup.in', canvas.width - 240, canvas.height - 30);

        // Grid pattern overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        return canvas.toDataURL('image/png');
    };

    const handleDownload = async () => {
        const dataUrl = await generateCard();
        if (!dataUrl) return;

        const link = document.createElement('a');
        link.download = `fixforward-${type}-card.png`;
        link.href = dataUrl;
        link.click();
    };

    const handleLinkedInShare = () => {
        const text = encodeURIComponent(
            type === 'participation'
                ? `I'm participating in @FixForward by @HYRUP - India's first Pay-It-Forward Innovation Challenge! 🚀\n\nJoin the movement: https://fixforward.hyrup.in\n\n#FixForward #HYRUP #Innovation #Hackathon #StudentInnovation`
                : type === 'team'
                    ? `Our team "${team?.name || 'Innovation Squad'}" is ready to innovate at @FixForward by @HYRUP! 💡\n\nJoin us: https://fixforward.hyrup.in\n\n#FixForward #HYRUP #TeamInnovation #Hackathon`
                    : `Achievement unlocked at @FixForward by @HYRUP! 🏆\n\n#FixForward #HYRUP #AchievementUnlocked`
        );
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://fixforward.hyrup.in&summary=${text}`, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://fixforward.hyrup.in');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-bg-secondary border border-stroke-primary p-6">
            <div className="flex items-center gap-2 mb-4">
                <Share2 size={18} className="text-accent" />
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                    Share Your Journey
                </h3>
            </div>

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Preview */}
            <div className="aspect-video bg-bg-tertiary border border-stroke-primary mb-4 flex items-center justify-center overflow-hidden">
                <div className="text-center p-6">
                    <div className="text-text-muted text-sm mb-2">
                        {type === 'participation' ? "I'm participating in" : type === 'team' ? `Team ${team?.name}` : 'Achievement'}
                    </div>
                    <div className="text-accent text-2xl font-display font-bold mb-1">
                        FIXFORWARD
                    </div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">
                        by HYRUP
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={handleDownload} className="flex-1">
                    <Download size={14} className="mr-1" /> Download
                </Button>
                <Button size="sm" variant="secondary" onClick={handleLinkedInShare} className="flex-1">
                    <Linkedin size={14} className="mr-1" /> LinkedIn
                </Button>
                <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-bg-tertiary border border-stroke-primary text-text-muted hover:text-white hover:border-accent transition-colors text-sm"
                >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
            </div>
        </div>
    );
}
