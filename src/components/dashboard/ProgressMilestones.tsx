"use client";

import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Check, Circle, Lock, Trophy, Users, Lightbulb, Rocket, Award } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface Milestone {
    id: string;
    label: string;
    icon: React.ReactNode;
    completed: boolean;
    active: boolean;
}

export function ProgressMilestones() {
    const { user, onboarded } = useAuth();
    const { team } = useTeam();
    const [showConfetti, setShowConfetti] = useState(false);
    const prevCompletedRef = useRef(0);

    const milestones: Milestone[] = [
        {
            id: "register",
            label: "Register",
            icon: <Users size={16} />,
            completed: !!user,
            active: !user,
        },
        {
            id: "onboard",
            label: "Profile",
            icon: <Circle size={16} />,
            completed: onboarded,
            active: !!user && !onboarded,
        },
        {
            id: "team",
            label: "Team",
            icon: <Users size={16} />,
            completed: !!team,
            active: onboarded && !team,
        },
        {
            id: "idea",
            label: "Idea",
            icon: <Lightbulb size={16} />,
            completed: team?.submissionStatus === 'submitted',
            active: !!team && team?.submissionStatus !== 'submitted',
        },
        {
            id: "prototype",
            label: "Prototype",
            icon: <Rocket size={16} />,
            completed: !!team?.prototype,
            active: team?.submissionStatus === 'submitted' && !team?.prototype,
        },
        {
            id: "complete",
            label: "Complete",
            icon: <Award size={16} />,
            completed: !!team?.prototype,
            active: false,
        },
    ];

    const completedCount = milestones.filter(m => m.completed).length;
    const progress = (completedCount / milestones.length) * 100;

    // Trigger confetti when a new milestone is completed
    useEffect(() => {
        if (completedCount > prevCompletedRef.current) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
        }
        prevCompletedRef.current = completedCount;
    }, [completedCount]);

    return (
        <div className="relative bg-bg-secondary border border-stroke-primary p-6 mb-6">
            {/* Confetti Effect */}
            {showConfetti && <ConfettiEffect />}

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-display font-bold text-sm uppercase tracking-wider">
                    Your Journey
                </h3>
                <span className="text-xs text-text-muted font-mono">
                    {completedCount}/{milestones.length} Complete
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1 bg-bg-tertiary mb-6 overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {/* Glow effect */}
                <motion.div
                    className="absolute inset-y-0 w-8 bg-linear-to-r from-transparent via-accent/50 to-transparent"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ opacity: progress > 0 && progress < 100 ? 1 : 0 }}
                />
            </div>

            {/* Milestones */}
            <div className="flex items-center justify-between">
                {milestones.map((milestone, index) => (
                    <MilestoneNode
                        key={milestone.id}
                        milestone={milestone}
                        index={index}
                        isLast={index === milestones.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}

function MilestoneNode({
    milestone,
    index,
    isLast
}: {
    milestone: Milestone;
    index: number;
    isLast: boolean;
}) {
    return (
        <div className="flex flex-col items-center relative">
            {/* Connection Line */}
            {!isLast && (
                <div
                    className="absolute top-4 left-1/2 w-full h-px bg-stroke-divider"
                    style={{ width: 'calc(100% + 20px)' }}
                />
            )}

            {/* Node */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`
                    relative z-10 w-8 h-8 flex items-center justify-center
                    border transition-all duration-300
                    ${milestone.completed
                        ? 'bg-accent border-accent text-black'
                        : milestone.active
                            ? 'bg-accent/10 border-accent/50 text-accent animate-pulse'
                            : 'bg-bg-tertiary border-stroke-primary text-text-muted'
                    }
                `}
            >
                {milestone.completed ? (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                        <Check size={14} strokeWidth={3} />
                    </motion.div>
                ) : (
                    milestone.icon
                )}
            </motion.div>

            {/* Label */}
            <span className={`
                mt-2 text-[10px] font-mono uppercase tracking-wider
                ${milestone.completed ? 'text-accent' : milestone.active ? 'text-white' : 'text-text-muted'}
            `}>
                {milestone.label}
            </span>
        </div>
    );
}

function ConfettiEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            color: string;
            size: number;
            rotation: number;
            rotationSpeed: number;
        }> = [];

        const colors = ['#FF4D00', '#FF6B2C', '#FFFFFF', '#FFB800'];

        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 6 + 2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
            });
        }

        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.3; // gravity
                p.rotation += p.rotationSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();

                // Fade out
                if (p.y > canvas.height) {
                    particles.splice(index, 1);
                }
            });

            if (particles.length > 0) {
                animationId = requestAnimationFrame(animate);
            }
        };

        animate();

        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-20"
            style={{ width: '100%', height: '100%' }}
        />
    );
}
