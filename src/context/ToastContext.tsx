"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            min-w-[300px] p-4 rounded-sm border shadow-lg flex items-start gap-3
                            animate-in slide-in-from-top-full duration-300
                            ${toast.type === 'success' ? 'bg-bg-secondary border-green-500/50 text-green-100' : ''}
                            ${toast.type === 'error' ? 'bg-bg-secondary border-red-500/50 text-red-100' : ''}
                            ${toast.type === 'info' ? 'bg-bg-secondary border-stroke-primary text-text-primary' : ''}
                        `}
                    >
                        <span className="mt-0.5">
                            {toast.type === 'success' && <CheckCircle size={16} className="text-green-500" />}
                            {toast.type === 'error' && <AlertCircle size={16} className="text-red-500" />}
                            {toast.type === 'info' && <Info size={16} className="text-accent" />}
                        </span>
                        <div className="flex-1 text-sm font-medium">{toast.message}</div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-text-muted hover:text-text-primary transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}
