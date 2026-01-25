import { PitchSlot } from "@/hooks/usePitch";
import { Button } from "../ui/Button";
import { Video, Calendar, Clock, Copy, ExternalLink, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";

interface PitchDashboardProps {
    slot: PitchSlot;
    formatTime: (d: Date) => string;
    formatDate: (d: Date) => string;
}

export function PitchDashboard({ slot, formatTime, formatDate }: PitchDashboardProps) {
    const { showToast } = useToast();
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [canJoin, setCanJoin] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const start = slot.startTime.getTime();
            const distance = start - now;

            if (distance < 0) {
                // Pitch started or passed
                const endDistance = slot.endTime.getTime() - now;
                if (endDistance < 0) {
                    setTimeLeft("SESSION ENDED");
                    setCanJoin(false);
                } else {
                    setTimeLeft("LIVE NOW");
                    setCanJoin(true);
                }
            } else {
                // Future
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft(`${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m ${seconds}s`);

                // Allow join 5 mins before
                if (distance < 5 * 60 * 1000) {
                    setCanJoin(true);
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [slot]);

    const copyLink = () => {
        navigator.clipboard.writeText(slot.meetLink);
        showToast("Meeting link copied!", "success");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Countdown Card */}
            <div className="bg-bg-secondary border border-stroke-primary p-8 rounded-sm text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent to-transparent opacity-50" />

                <h2 className="text-text-secondary font-mono text-sm uppercase mb-6 tracking-widest">Time Until Pitch</h2>

                <div className="font-display font-bold text-5xl md:text-7xl tabular-nums tracking-tight text-white mb-8">
                    {timeLeft || "LOADING..."}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        className={`min-w-[200px] h-12 ${canJoin ? 'animate-pulse' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!canJoin}
                        onClick={() => window.open(slot.meetLink, '_blank')}
                    >
                        <Video size={18} className="mr-2" />
                        Join Meeting
                    </Button>
                    <Button variant="secondary" size="lg" className="h-12" onClick={copyLink}>
                        <Copy size={16} className="mr-2" />
                        Copy Link
                    </Button>
                </div>

                {!canJoin && timeLeft !== "SESSION ENDED" && (
                    <p className="text-xs text-text-muted mt-4 font-mono">
                        Link activates 5 minutes before start time
                    </p>
                )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bg-secondary p-6 border border-stroke-primary flex items-start gap-4">
                    <div className="p-3 bg-bg-tertiary rounded-sm text-accent">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-text-muted font-mono uppercase mb-1">Date</div>
                        <div className="text-lg font-bold text-white">{formatDate(slot.startTime)}</div>
                    </div>
                </div>

                <div className="bg-bg-secondary p-6 border border-stroke-primary flex items-start gap-4">
                    <div className="p-3 bg-bg-tertiary rounded-sm text-accent">
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-text-muted font-mono uppercase mb-1">Window</div>
                        <div className="text-lg font-bold text-white">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-bg-tertiary/30 border border-stroke-divider p-6 rounded-sm">
                <h3 className="flex items-center gap-2 text-white font-bold mb-4">
                    <AlertTriangle size={16} className="text-yellow-500" />
                    Before you join:
                </h3>
                <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5">
                    <li>Ensure your mic and camera are working.</li>
                    <li>Have your slide deck open and ready to share.</li>
                    <li>Only one team member needs to share the screen.</li>
                    <li>Join 5 minutes early to test connection.</li>
                </ul>
            </div>
        </div>
    );
}
