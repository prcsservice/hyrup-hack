"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, ChevronDown, Users } from "lucide-react";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage, sendMessage, subscribeToMessages } from "@/lib/chatService";

interface TeamChatProps {
    isOpen?: boolean;
    onToggle?: () => void;
}

export function TeamChat({ isOpen: controlledIsOpen, onToggle }: TeamChatProps = {}) {
    const { team } = useTeam();
    const { user } = useAuth();
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastSeenRef = useRef<number>(0);

    // Use controlled state if provided, otherwise use internal state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const handleToggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));

    useEffect(() => {
        if (!team?.id) return;

        const unsubscribe = subscribeToMessages(team.id, (newMessages) => {
            setMessages(newMessages);

            // Count unread messages (messages after last seen, not from current user)
            if (!isOpen && user) {
                const newUnread = newMessages.filter(
                    msg => msg.senderId !== user.uid &&
                        msg.createdAt?.toMillis() > lastSeenRef.current
                ).length;
                setUnreadCount(newUnread);
            }
        });

        return () => unsubscribe();
    }, [team?.id, isOpen, user]);

    // Mark messages as read when chat opens
    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
            lastSeenRef.current = Date.now();
        }
    }, [isOpen]);

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
            {/* Toggle Button - Desktop only (mobile uses /dashboard/chat page) */}
            <motion.button
                onClick={handleToggle}
                className="hidden md:flex fixed bottom-6 right-6 w-14 h-14 bg-accent text-black items-center justify-center z-40 shadow-xl hover:bg-accent/90 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-tour="chat"
            >
                {isOpen ? <ChevronDown size={24} /> : <MessageCircle size={24} />}

                {/* Notification Badge - Larger with pulse animation */}
                {!isOpen && unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 min-w-6 h-6 px-1.5 bg-red-500 text-white text-xs flex items-center justify-center font-bold shadow-lg"
                    >
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.span>
                    </motion.span>
                )}
            </motion.button>

            {/* Chat Panel - Larger and improved */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-40 right-6 w-[480px] h-[380px] bg-bg-secondary border border-stroke-primary flex flex-col z-50 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-stroke-primary bg-bg-tertiary flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent/10 border border-accent/30 flex items-center justify-center">
                                    <Users size={20} className="text-accent" />
                                </div>
                                <div>
                                    <span className="text-base font-bold text-white block">
                                        Team Chat
                                    </span>
                                    <span className="text-xs text-text-muted">
                                        {team.name} • {messages.length} messages
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleToggle}
                                className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-white hover:bg-bg-tertiary transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" data-lenis-prevent>
                            {messages.length === 0 && (
                                <div className="text-center text-text-muted py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-bg-tertiary border border-stroke-primary flex items-center justify-center">
                                        <MessageCircle size={28} className="opacity-50" />
                                    </div>
                                    <p className="text-base font-medium">No messages yet</p>
                                    <p className="text-sm mt-1">Start the conversation with your team!</p>
                                </div>
                            )}

                            {messages.map((msg, index) => {
                                const isOwn = msg.senderId === user?.uid;
                                const showAvatar = index === 0 ||
                                    messages[index - 1]?.senderId !== msg.senderId;

                                return (
                                    <MessageBubble
                                        key={msg.id}
                                        message={msg}
                                        isOwn={isOwn}
                                        showAvatar={showAvatar}
                                    />
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-stroke-primary bg-bg-tertiary/50">
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
                                    className="w-11 h-11 bg-accent text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function MessageBubble({
    message,
    isOwn,
    showAvatar
}: {
    message: ChatMessage;
    isOwn: boolean;
    showAvatar: boolean;
}) {
    // Get initials from sender name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar - only show for first message in a group */}
            <div className={`w-8 shrink-0 ${showAvatar ? '' : 'invisible'}`}>
                <div className={`
                    w-8 h-8 flex items-center justify-center text-xs font-bold
                    ${isOwn
                        ? 'bg-accent text-black'
                        : 'bg-bg-tertiary border border-stroke-primary text-white'
                    }
                `}>
                    {getInitials(message.senderName || 'U')}
                </div>
            </div>

            {/* Message Content */}
            <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Sender Name - only for others and first message */}
                {!isOwn && showAvatar && (
                    <span className="text-xs text-accent font-medium mb-1 px-1">
                        {message.senderName}
                    </span>
                )}

                {/* Message Bubble */}
                <div className={`
                    px-4 py-2.5 text-sm leading-relaxed
                    ${isOwn
                        ? 'bg-accent text-black rounded-tl-lg rounded-bl-lg rounded-br-sm'
                        : 'bg-bg-tertiary text-white border border-stroke-primary rounded-tr-lg rounded-br-lg rounded-bl-sm'
                    }
                `}>
                    {message.text}
                </div>

                {/* Timestamp */}
                <span className={`text-[10px] text-text-muted mt-1 px-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {formatMessageTime(message.createdAt?.toDate())}
                </span>
            </div>
        </motion.div>
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
