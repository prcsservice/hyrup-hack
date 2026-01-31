"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Download, Linkedin, Share2, Check, Copy, User, Users, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTeam } from "@/context/TeamContext";
import { Button } from "@/components/ui/Button";

type CardType = 'participation' | 'team' | 'achievement';

export function SocialCardGenerator() {
    const { user } = useAuth();
    const { team } = useTeam();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeType, setActiveType] = useState<CardType>('participation');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Card dimensions (LinkedIn recommended: 1200x627)
    const CARD_WIDTH = 1200;
    const CARD_HEIGHT = 627;

    const drawCard = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsGenerating(true);

        // Reset canvas
        canvas.width = CARD_WIDTH;
        canvas.height = CARD_HEIGHT;

        // 1. Background (Dark Gradient)
        const gradient = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
        gradient.addColorStop(0, '#050505'); // --bg-primary
        gradient.addColorStop(1, '#111111'); // --bg-tertiary
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

        // 2. Grid Pattern Overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 60;

        // Vertical lines
        for (let i = 0; i <= CARD_WIDTH; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, CARD_HEIGHT);
            ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= CARD_HEIGHT; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(CARD_WIDTH, i);
            ctx.stroke();
        }

        // 3. Accent Strip (Left Side)
        ctx.fillStyle = '#FF4D00'; // --accent
        ctx.fillRect(0, 0, 12, CARD_HEIGHT);

        // 4. Corner Geometric Accent (Right Top)
        ctx.beginPath();
        ctx.moveTo(CARD_WIDTH, 0);
        ctx.lineTo(CARD_WIDTH - 250, 0);
        ctx.lineTo(CARD_WIDTH, 250);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 77, 0, 0.08)';
        ctx.fill();

        // 5. Text Content Configuration
        let title = "";
        let subtitle = "";
        let iconChar = "";

        if (activeType === 'participation') {
            title = "I'm Building at";
            subtitle = "India's Student-Powered Innovation Challenge";
            iconChar = "🚀";
        } else if (activeType === 'team') {
            title = team ? `Team ${team.name}` : "Team Innovation";
            subtitle = "Fixing What's Broken.";
            iconChar = "🛡️";
        } else {
            title = "Achievement Unlocked";
            subtitle = "Real Problems. Real Fixes. Real Impact.";
            iconChar = "🏆";
        }

        // 6. Main Titles
        // "I'm Building at" / Team Name
        ctx.font = 'bold 64px "Inter", "system-ui", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textBaseline = 'top';
        ctx.fillText(title, 80, 140);

        // "FIXFORWARD" (Branding)
        ctx.font = '900 120px "Space Grotesk", "system-ui", sans-serif';
        ctx.fillStyle = '#FF4D00';
        ctx.fillText('FIXFORWARD', 75, 230);

        // Subtitle
        ctx.font = '500 36px "Inter", "system-ui", sans-serif';
        ctx.fillStyle = '#888888'; // --text-secondary
        ctx.fillText(subtitle, 80, 360);

        // 7. Footer / User Info area
        const footerY = 500;

        // User Avatar/Initial Circle
        const initial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'P';

        // Draw circle background
        ctx.beginPath();
        ctx.arc(120, footerY + 30, 40, 0, Math.PI * 2);
        ctx.fillStyle = '#1A1A1A';
        ctx.fill();
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Initial text
        ctx.font = 'bold 36px "Inter", sans-serif';
        ctx.fillStyle = '#FF4D00';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initial, 120, footerY + 32);

        // Helper for left-aligned text
        ctx.textAlign = 'left';

        // User Name
        ctx.font = 'bold 32px "Inter", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(user?.displayName || 'Participant', 180, footerY + 15);

        // User Role / Status
        ctx.font = '24px "Inter", sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText(user?.email || 'Hacker', 180, footerY + 55);

        // 8. Website URL (Bottom Right)
        ctx.textAlign = 'right';
        ctx.font = 'bold 24px "Space Grotesk", monospace';
        ctx.fillStyle = '#444444';
        ctx.fillText('fixforward.hyrup.in', CARD_WIDTH - 60, CARD_HEIGHT - 40);

        // 9. Generate Preview
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewUrl(dataUrl);
        setIsGenerating(false);

    }, [activeType, team, user]);

    // Redraw when dependencies change
    useEffect(() => {
        // Load fonts first if possible, or just delay slightly
        if (document.fonts) {
            document.fonts.ready.then(() => {
                drawCard();
            });
        } else {
            setTimeout(drawCard, 500);
        }
    }, [drawCard]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `fixforward-${activeType}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    const handleLinkedInShare = () => {
        const text = encodeURIComponent(
            activeType === 'participation'
                ? `I'm building at @FixForward by @HYRUP - India's Student-Powered Innovation Challenge! 🚀\n\nFixing what's broken: https://fixforward.hyrup.in\n\n#FixForward #HYRUP #Innovation #Hackathon #StudentInnovation`
                : activeType === 'team'
                    ? `My team "${team?.name || 'Innovation Squad'}" is ready to fix what's broken at @FixForward by @HYRUP! 💡\n\nJoin the movement: https://fixforward.hyrup.in\n\n#FixForward #HYRUP #TeamInnovation #Hackathon`
                    : `Just unlocked a new milestone at @FixForward by @HYRUP! Real Problems. Real Fixes. 🏆\n\n#FixForward #HYRUP #Impact`
        );
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://fixforward.hyrup.in&summary=${text}`, '_blank');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://fixforward.hyrup.in');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-bg-secondary border border-stroke-primary p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Share2 size={18} className="text-accent" />
                    <h3 className="font-display font-bold text-lg text-white">
                        Social Card
                    </h3>
                </div>

                {/* Type Selectors */}
                <div className="flex bg-bg-tertiary rounded-lg p-1 border border-stroke-divider">
                    <button
                        onClick={() => setActiveType('participation')}
                        className={`p-1.5 rounded-md transition-all ${activeType === 'participation' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                        title="Participation Card"
                    >
                        <User size={16} />
                    </button>
                    <button
                        onClick={() => setActiveType('team')}
                        className={`p-1.5 rounded-md transition-all ${activeType === 'team' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                        title="Team Card"
                        disabled={!team}
                    >
                        <Users size={16} />
                    </button>
                    <button
                        onClick={() => setActiveType('achievement')}
                        className={`p-1.5 rounded-md transition-all ${activeType === 'achievement' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                        title="Achievement Card"
                    >
                        <Trophy size={16} />
                    </button>
                </div>
            </div>

            {/* Hidden Canvas - Used for generation */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Live Preview */}
            <div className="relative aspect-[1.91/1] w-full bg-bg-tertiary border border-stroke-divider overflow-hidden mb-6 group">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Social Card Preview"
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-text-muted animate-pulse">
                        <span className="text-xs font-mono">GENERATING PREVIEW...</span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <Button size="sm" onClick={handleDownload}>
                        <Download size={14} className="mr-2" /> Download PNG
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
                <Button variant="secondary" onClick={handleLinkedInShare} className="w-full justify-center">
                    <Linkedin size={14} className="mr-2" /> Share
                </Button>
                <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center px-4 py-2 bg-bg-tertiary border border-stroke-primary text-text-secondary hover:text-white hover:border-accent transition-all text-sm font-medium"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="mr-2 text-green-500" /> Copied
                        </>
                    ) : (
                        <>
                            <Copy size={14} className="mr-2" /> Copy Link
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
