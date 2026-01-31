"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TourStep {
    id: string;
    target: string; // CSS selector
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
    {
        id: 'welcome',
        target: 'body',
        title: 'Welcome to FixForward!',
        content: "Let's take a quick tour to help you get started on your innovation journey.",
        position: 'bottom',
    },
    {
        id: 'progress',
        target: '[data-tour="progress"]',
        title: 'Your Journey Tracker',
        content: "Track your progress through the hackathon stages. Complete each milestone to unlock the next.",
        position: 'bottom',
    },
    {
        id: 'countdown',
        target: '[data-tour="countdown"]',
        title: 'Deadline Timer',
        content: "Keep an eye on upcoming deadlines. The timer changes color as deadlines approach.",
        position: 'bottom',
    },
    {
        id: 'team',
        target: '[data-tour="team"]',
        title: 'Your Team',
        content: "Manage your team here. Create a new team or join an existing one to collaborate.",
        position: 'top',
    },
    {
        id: 'submit',
        target: '[data-tour="submit"]',
        title: 'Submit Your Idea',
        content: "When you're ready, submit your innovation idea here. The leader can edit until the deadline.",
        position: 'top',
    },
    {
        id: 'chat',
        target: '[data-tour="chat"]',
        title: 'Team Chat',
        content: "Use the chat button to communicate with your team members in real-time.",
        position: 'left',
    },
    {
        id: 'faq',
        target: '[data-tour="faq"]',
        title: 'FAQ Assistant',
        content: "Got questions? Our FAQ bot can help you find answers quickly.",
        position: 'right',
    },
];

const TOUR_STORAGE_KEY = 'fixforward_tour_completed';

export function OnboardingTour() {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Check if tour should show
    useEffect(() => {
        const completed = localStorage.getItem(TOUR_STORAGE_KEY);
        if (!completed) {
            // Delay to ensure DOM is ready
            setTimeout(() => setIsActive(true), 1000);
        }
    }, []);

    // Update target element position
    useEffect(() => {
        if (!isActive) return;

        const step = tourSteps[currentStep];
        const element = document.querySelector(step.target);

        if (element) {
            setTargetRect(element.getBoundingClientRect());
        } else {
            setTargetRect(null);
        }

        // Handle resize
        const handleResize = () => {
            if (element) {
                setTargetRect(element.getBoundingClientRect());
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isActive, currentStep]);

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        setIsActive(false);
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    };

    if (!isActive) return null;

    const step = tourSteps[currentStep];

    return (
        <AnimatePresence>
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-[100]"
                onClick={handleSkip}
            />

            {/* Highlight */}
            {targetRect && step.target !== 'body' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed z-[101] pointer-events-none"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width + 8,
                        height: targetRect.height + 8,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
                        border: '2px solid #FF4D00',
                    }}
                />
            )}

            {/* Tooltip */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed z-[102] w-80 bg-bg-secondary border border-accent p-5 shadow-2xl"
                style={getTooltipPosition(targetRect, step.position)}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-accent" />
                        <span className="text-xs text-text-muted font-mono">
                            {currentStep + 1} / {tourSteps.length}
                        </span>
                    </div>
                    <button
                        onClick={handleSkip}
                        className="text-text-muted hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm mb-4">{step.content}</p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSkip}
                        className="text-xs text-text-muted hover:text-white transition-colors"
                    >
                        Skip Tour
                    </button>
                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <Button size="sm" variant="secondary" onClick={handlePrev}>
                                <ChevronLeft size={14} />
                            </Button>
                        )}
                        <Button size="sm" onClick={handleNext}>
                            {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                            {currentStep < tourSteps.length - 1 && <ChevronRight size={14} className="ml-1" />}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

function getTooltipPosition(
    targetRect: DOMRect | null,
    position: TourStep['position']
): React.CSSProperties {
    if (!targetRect) {
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const offset = 16;

    switch (position) {
        case 'top':
            return {
                bottom: window.innerHeight - targetRect.top + offset,
                left: targetRect.left + targetRect.width / 2,
                transform: 'translateX(-50%)',
            };
        case 'bottom':
            return {
                top: targetRect.bottom + offset,
                left: targetRect.left + targetRect.width / 2,
                transform: 'translateX(-50%)',
            };
        case 'left':
            return {
                top: targetRect.top + targetRect.height / 2,
                right: window.innerWidth - targetRect.left + offset,
                transform: 'translateY(-50%)',
            };
        case 'right':
            return {
                top: targetRect.top + targetRect.height / 2,
                left: targetRect.right + offset,
                transform: 'translateY(-50%)',
            };
    }
}

// Hook to restart tour
export function useOnboardingTour() {
    const restartTour = useCallback(() => {
        localStorage.removeItem(TOUR_STORAGE_KEY);
        window.location.reload();
    }, []);

    return { restartTour };
}
