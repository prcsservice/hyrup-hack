"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circle' | 'card' | 'button';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className = "",
    variant = 'text',
    width,
    height
}: SkeletonProps) {
    const baseClasses = "bg-bg-tertiary animate-pulse";

    const variantClasses = {
        text: "h-4 rounded-sm",
        circle: "rounded-full",
        card: "rounded-sm",
        button: "h-10 rounded-sm",
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{
                width: width || (variant === 'circle' ? 40 : '100%'),
                height: height || (variant === 'circle' ? 40 : variant === 'card' ? 200 : undefined)
            }}
        />
    );
}

// Common skeleton patterns
export function TeamCardSkeleton() {
    return (
        <div className="bg-bg-secondary border border-stroke-primary p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-2 flex-1">
                    <Skeleton width="60%" height={20} />
                    <Skeleton width="40%" height={12} />
                </div>
                <Skeleton variant="circle" width={40} height={40} />
            </div>
            <div className="space-y-3">
                <div className="flex gap-2">
                    <Skeleton width={60} height={24} />
                    <Skeleton width={80} height={24} />
                </div>
                <Skeleton height={40} />
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Progress bar skeleton */}
            <div className="bg-bg-secondary border border-stroke-primary p-6">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton width={120} height={16} />
                    <Skeleton width={60} height={12} />
                </div>
                <Skeleton height={4} className="mb-6" />
                <div className="flex justify-between">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <Skeleton variant="circle" width={32} height={32} />
                            <Skeleton width={40} height={10} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Countdown skeleton */}
            <div className="bg-bg-secondary border border-stroke-primary p-4">
                <Skeleton width={150} height={14} className="mb-3" />
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex flex-col items-center">
                            <Skeleton width={48} height={36} />
                            <Skeleton width={30} height={10} className="mt-1" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Team card skeleton */}
            <TeamCardSkeleton />
        </div>
    );
}

export function NotificationSkeleton() {
    return (
        <div className="p-4 border-b border-stroke-divider">
            <div className="flex gap-3">
                <Skeleton variant="circle" width={32} height={32} />
                <div className="flex-1 space-y-2">
                    <Skeleton width="80%" height={14} />
                    <Skeleton width="50%" height={12} />
                </div>
            </div>
        </div>
    );
}

export function MessageSkeleton() {
    return (
        <div className="flex gap-2">
            <Skeleton variant="circle" width={24} height={24} />
            <Skeleton width="60%" height={40} className="rounded-sm" />
        </div>
    );
}
