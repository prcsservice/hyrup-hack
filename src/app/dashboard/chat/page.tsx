"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, ArrowLeft, Users } from "lucide-react";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage, sendMessage, subscribeToMessages } from "@/lib/chatService";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ChatPage() {
    return <ChatContent />;
}

function ChatContent() {
    const { team } = useTeam();
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!team?.id) return;

        const unsubscribe = subscribeToMessages(team.id, (newMessages) => {
            setMessages(newMessages);
        });

        return () => unsubscribe();
    }, [team?.id]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!team?.id || !user || !input.trim()) return;

        setSending(true);
        try {
            await sendMessage(team.id, user, input);
            setInput("");
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // No team state
    if (!team) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 bg-bg-tertiary border border-stroke-primary flex items-center justify-center mb-6">
                    <Users size={32} className="text-text-muted" />
                </div>
                <h2 className="text-xl font-display font-bold mb-2">No Team Yet</h2>
                <p className="text-text-secondary mb-6">Join or create a team to start chatting with your teammates.</p>
                <Link href="/dashboard/team">
                    <Button>Join a Team</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-100px)]">
            {/* Header */}
            <header className="flex items-center gap-4 mb-4">
                <Link href="/dashboard">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 border-stroke-divider"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 border border-accent/30 flex items-center justify-center">
                        <Users size={20} className="text-accent" />
                    </div>
                    <div>
                        <h1 className="text-xl font-display font-bold">Team Chat</h1>
                        <p className="text-xs text-text-muted font-mono">
                            {team.name} • {messages.length} messages
                        </p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto bg-bg-secondary border border-stroke-primary p-4 space-y-4"
                data-lenis-prevent
            >
                {messages.length === 0 && (
                    <div className="text-center text-text-muted py-16">
                        <div className="w-20 h-20 mx-auto mb-4 bg-bg-tertiary border border-stroke-primary flex items-center justify-center">
                            <MessageCircle size={32} className="opacity-50" />
                        </div>
                        <p className="text-lg font-medium">No messages yet</p>
                        <p className="text-sm mt-1">Be the first to say something!</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isOwn = msg.senderId === user?.uid;
                    const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;

                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Avatar */}
                            <div className={`w-10 shrink-0 ${showAvatar ? '' : 'invisible'}`}>
                                <div className={`
                                    w-10 h-10 flex items-center justify-center text-sm font-bold
                                    ${isOwn
                                        ? 'bg-accent text-black'
                                        : 'bg-bg-tertiary border border-stroke-primary text-white'
                                    }
                                `}>
                                    {getInitials(msg.senderName || 'U')}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                                {!isOwn && showAvatar && (
                                    <span className="text-xs text-accent font-medium mb-1 px-1">
                                        {msg.senderName}
                                    </span>
                                )}

                                <div className={`
                                    px-4 py-3 text-sm leading-relaxed
                                    ${isOwn
                                        ? 'bg-accent text-black'
                                        : 'bg-bg-tertiary text-white border border-stroke-primary'
                                    }
                                `}>
                                    {msg.text}
                                </div>

                                <span className={`text-[10px] text-text-muted mt-1 px-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                                    {formatMessageTime(msg.createdAt?.toDate())}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-bg-secondary border border-t-0 border-stroke-primary">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1 bg-bg-tertiary border border-stroke-primary px-4 py-3 text-sm text-white placeholder:text-text-muted focus:border-accent outline-none transition-colors"
                        disabled={sending}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        className="w-12 h-12 bg-accent text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function formatMessageTime(date: Date | undefined): string {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
