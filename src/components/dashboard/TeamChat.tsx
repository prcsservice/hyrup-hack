"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, ChevronDown, Users } from "lucide-react";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage, sendMessage, subscribeToMessages } from "@/lib/chatService";

export function TeamChat() {
    const { team } = useTeam();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
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

    if (!team) return null;

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-black flex items-center justify-center z-50 shadow-lg hover:bg-accent/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? <ChevronDown size={24} /> : <MessageCircle size={24} />}
                {!isOpen && messages.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {messages.length > 9 ? '9+' : messages.length}
                    </span>
                )}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-80 h-96 bg-bg-secondary border border-stroke-primary flex flex-col z-50 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-3 border-b border-stroke-primary bg-bg-tertiary/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-accent" />
                                <span className="text-sm font-bold text-white truncate max-w-[150px]">
                                    {team.name}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-text-muted hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-center text-text-muted text-sm py-8">
                                    <MessageCircle size={24} className="mx-auto mb-2 opacity-50" />
                                    <p>No messages yet</p>
                                    <p className="text-xs mt-1">Start the conversation!</p>
                                </div>
                            )}

                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    isOwn={msg.senderId === user?.uid}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-stroke-primary">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-bg-tertiary border border-stroke-primary px-3 py-2 text-sm text-white placeholder:text-text-muted focus:border-accent outline-none"
                                    disabled={sending}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || sending}
                                    className="w-9 h-9 bg-accent text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function MessageBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
        >
            <div className={`max-w-[80%] ${isOwn ? 'order-2' : ''}`}>
                {!isOwn && (
                    <span className="text-[10px] text-text-muted font-mono mb-1 block">
                        {message.senderName}
                    </span>
                )}
                <div className={`
                    px-3 py-2 text-sm
                    ${isOwn
                        ? 'bg-accent text-black'
                        : 'bg-bg-tertiary text-white border border-stroke-primary'
                    }
                `}>
                    {message.text}
                </div>
                <span className="text-[9px] text-text-muted mt-1 block text-right">
                    {formatMessageTime(message.createdAt?.toDate())}
                </span>
            </div>
        </motion.div>
    );
}

function formatMessageTime(date: Date | undefined): string {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}
