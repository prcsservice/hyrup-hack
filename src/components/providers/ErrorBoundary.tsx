"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
        // Could send to error tracking service here
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
                        <AlertTriangle size={28} className="text-red-500" />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-text-secondary text-sm max-w-md mb-6">
                        An unexpected error occurred. Don't worry, your data is safe.
                        Try refreshing or going back to the home page.
                    </p>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mb-6 p-4 bg-bg-tertiary border border-stroke-primary text-left max-w-md overflow-auto">
                            <code className="text-xs text-red-400 break-all">
                                {this.state.error.message}
                            </code>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button onClick={this.handleRetry} variant="secondary">
                            <RefreshCw size={14} className="mr-1" /> Try Again
                        </Button>
                        <Button onClick={this.handleGoHome}>
                            <Home size={14} className="mr-1" /> Go Home
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook-based error boundary wrapper for easier use
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: React.ReactNode
) {
    return function WrappedComponent(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}
