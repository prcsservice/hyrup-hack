import { useState } from "react";

interface RubricInputProps {
    label: string;
    description: string;
    max: number;
    value: number;
    onChange: (val: number) => void;
}

export function RubricInput({ label, description, max, value, onChange }: RubricInputProps) {
    return (
        <div className="bg-bg-tertiary/50 border border-stroke-primary p-4 rounded-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-white text-sm">{label}</h4>
                    <p className="text-xs text-text-secondary mt-1">{description}</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-display font-bold text-accent">{value}</span>
                    <span className="text-text-muted text-xs font-mono ml-1">/ {max}</span>
                </div>
            </div>

            <input
                type="range"
                min="0"
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
            />

            <div className="flex justify-between text-[10px] text-text-muted font-mono mt-2">
                <span>0</span>
                <span>{max}</span>
            </div>
        </div>
    );
}
