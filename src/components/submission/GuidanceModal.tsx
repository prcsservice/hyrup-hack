"use client";

import { X, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface GuidanceContent {
    title: string;
    description: string;
    goodExample: string;
    badExample: string;
    tips: string[];
}

interface GuidanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: GuidanceContent;
}

export function GuidanceModal({ isOpen, onClose, content }: GuidanceModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#2A2F36] shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#2A2F36] bg-[#111111]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#F4C430]/10 rounded-sm">
                            <Lightbulb size={20} className="text-[#F4C430]" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-white content-center">
                            {content.title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div data-lenis-prevent className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Description */}
                    <div className="text-base text-white/80 leading-relaxed">
                        {content.description}
                    </div>

                    {/* Examples Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Good Example */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[#2DFF6A] text-xs font-mono font-bold uppercase tracking-wider">
                                <CheckCircle size={14} />
                                Good Example
                            </div>
                            <div className="p-4 bg-[#2DFF6A]/5 border border-[#2DFF6A]/20 rounded-sm text-sm text-white/90 leading-relaxed relative group">
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#2DFF6A]/40 group-hover:border-[#2DFF6A] transition-colors" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#2DFF6A]/40 group-hover:border-[#2DFF6A] transition-colors" />
                                {content.goodExample}
                            </div>
                        </div>

                        {/* Bad Example */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[#FF3D3D] text-xs font-mono font-bold uppercase tracking-wider">
                                <XCircle size={14} />
                                Bad Example
                            </div>
                            <div className="p-4 bg-[#FF3D3D]/5 border border-[#FF3D3D]/20 rounded-sm text-sm text-white/90 leading-relaxed italic opacity-80">
                                "{content.badExample}"
                            </div>
                        </div>
                    </div>

                    {/* Pro Tips */}
                    <div className="bg-[#111111] border border-[#2A2F36] p-5 rounded-sm">
                        <h4 className="text-sm font-mono font-bold uppercase text-white/60 mb-3 tracking-wider">Top Tips</h4>
                        <ul className="space-y-2">
                            {content.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-white/70">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F4C430] mt-1.5 shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-[#111111] border-t border-[#2A2F36] text-center">
                    <button
                        onClick={onClose}
                        className="text-xs font-mono text-white/40 hover:text-white transition-colors"
                    >
                        Press ESC to close
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}
