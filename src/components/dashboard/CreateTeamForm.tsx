"use client";

import { useState } from "react";
import { Check, X, Zap, Rocket, Shield, Cpu, Flame, Target, Anchor, Gem } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTeam } from "@/context/TeamContext";

/**
 * Create Team Form - Compact Version
 */

const ICONS = [
    { id: "rocket", icon: Rocket, label: "Rocket" },
    { id: "zap", icon: Zap, label: "Energy" },
    { id: "shield", icon: Shield, label: "Guardian" },
    { id: "cpu", icon: Cpu, label: "Tech" },
    { id: "flame", icon: Flame, label: "Fire" },
    { id: "target", icon: Target, label: "Precision" },
    { id: "anchor", icon: Anchor, label: "Marine" },
    { id: "gem", icon: Gem, label: "Value" },
];

const COLORS = [
    "#2979FF", // Electric Blue
    "#2DFF6A", // Neon Green
    "#F4C430", // Cyber Yellow
    "#FF3D3D", // Alert Red
    "#9D00FF", // Purple
    "#FF00E5", // Magenta
    "#00E0FF", // Cyan
];

export function CreateTeamForm({ onSuccess }: { onSuccess?: () => void }) {
    const { createTeam, checkTeamName } = useTeam();

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [selectedIconId, setSelectedIconId] = useState("rocket");

    const [color, setColor] = useState(COLORS[0]);
    const [position, setPosition] = useState("");

    const handleNameCheck = async (val: string) => {
        setName(val);
        if (val.length < 3) return;

        setIsChecking(true);
        const taken = await checkTeamName(val);
        setIsChecking(false);

        if (taken) setNameError("Team name taken");
        else setNameError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nameError || !name) return;

        try {
            await createTeam(name, { color, emoji: selectedIconId }, [], position);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setNameError(err.message);
        }
    };

    const SelectedIcon = ICONS.find(i => i.id === selectedIconId)?.icon || Rocket;

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-display font-semibold mb-0.5">Create your Squad</h2>
                <p className="text-text-secondary text-xs">Define your identity.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Identity Mixer */}
                <div className="p-4 bg-bg-tertiary border border-stroke-divider rounded-sm flex flex-col items-center gap-3">
                    {/* Preview Circle - Smaller */}
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 relative"
                        style={{
                            borderColor: color,
                            backgroundColor: `${color}10`, // 10% opacity
                            boxShadow: `0 0 20px ${color}30`,
                        }}
                    >
                        <SelectedIcon
                            size={28}
                            style={{
                                color: color,
                                filter: `drop-shadow(0 0 8px ${color})`
                            }}
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-3 w-full">
                        {/* Color Palette */}
                        <div className="flex justify-center gap-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-5 h-5 rounded-full border border-stroke-primary transition-transform ${color === c ? 'scale-125 ring-2 ring-white border-transparent' : 'hover:scale-110'}`}
                                    style={{ background: c }}
                                />
                            ))}
                        </div>

                        {/* Icon Grid */}
                        <div className="grid grid-cols-4 gap-1.5 justify-items-center bg-bg-secondary p-2 rounded-sm border border-stroke-divider">
                            {ICONS.map(({ id, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setSelectedIconId(id)}
                                    className={`p-1.5 rounded-sm transition-colors hover:bg-bg-tertiary ${selectedIconId === id ? 'bg-bg-tertiary text-accent shadow-sm ring-1 ring-stroke-primary' : 'text-text-muted'}`}
                                >
                                    <Icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Name Input */}
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Unique Squad Name</label>
                    <div className="relative">
                        <input
                            value={name}
                            onChange={(e) => handleNameCheck(e.target.value)}
                            className="w-full bg-bg-secondary border border-stroke-primary p-2.5 rounded-sm focus:border-accent outline-none font-display text-base placeholder:text-text-muted"
                            placeholder="e.g. Alpha Wolf"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isChecking ? (
                                <div className="w-3 h-3 border-2 border-accent border-r-transparent animate-spin rounded-full" />
                            ) : name.length > 2 && !nameError ? (
                                <Check className="w-3 h-3 text-green-500" />
                            ) : name.length > 2 && nameError ? (
                                <X className="w-3 h-3 text-red-500" />
                            ) : null}
                        </div>
                    </div>
                    {nameError && <p className="text-red-500 text-[10px]">{nameError}</p>}
                </div>
                {/* Position Input */}
                <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono">Your Role</label>
                    <input
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full bg-bg-secondary border border-stroke-primary p-2.5 rounded-sm focus:border-accent outline-none font-display text-sm placeholder:text-text-muted/50"
                        placeholder="e.g. Full Stack Dev"
                    />
                </div>

                <Button type="submit" size="sm" className="w-full h-10" disabled={!name || !!nameError || !position}>
                    Launch Squad
                </Button>
            </form>
        </div>
    );
}
