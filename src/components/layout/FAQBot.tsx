"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Bot, User, Sparkles } from "lucide-react";
import { findFAQMatches, FAQItem, faqData } from "@/lib/faqData";

interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    faqItem?: FAQItem;
    suggestions?: { label: string; query: string }[];
}

// Suggested follow-up questions based on category
const categorySuggestions: Record<string, { label: string; query: string }[]> = {
    registration: [
        { label: "Registration fee?", query: "registration fee" },
        { label: "Who can participate?", query: "eligibility" },
        { label: "Create a team", query: "create team" },
    ],
    teams: [
        { label: "Join a team", query: "join team" },
        { label: "Team size limit?", query: "team size" },
        { label: "Who can submit?", query: "who submit idea" },
    ],
    submission: [
        { label: "What's in Phase 2?", query: "phase 2" },
        { label: "File formats?", query: "file formats" },
        { label: "Can I edit after?", query: "edit submission" },
    ],
    judging: [
        { label: "When are results?", query: "results announce" },
        { label: "Who are judges?", query: "who judges" },
        { label: "What are prizes?", query: "prizes" },
    ],
    prizes: [
        { label: "Do all get certificates?", query: "certificate" },
        { label: "Judging criteria?", query: "judging criteria" },
        { label: "How to win?", query: "how judged" },
    ],
    technical: [
        { label: "Submission not saving?", query: "submission not saving" },
        { label: "Login issues?", query: "login trouble" },
        { label: "Contact support", query: "contact support" },
    ],
};

const quickActions = [
    { label: "How to register?", query: "register" },
    { label: "Team size", query: "team size limit" },
    { label: "Submission deadline", query: "deadline" },
    { label: "Prize info", query: "prizes" },
    { label: "Judging criteria", query: "how judged" },
    { label: "Contact support", query: "contact support" },
];

interface FAQBotProps {
    isOpen?: boolean;
    onToggle?: () => void;
}

export function FAQBot({ isOpen: externalIsOpen, onToggle }: FAQBotProps = {}) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Use external control if provided, otherwise use internal state
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const toggleOpen = onToggle || (() => setInternalIsOpen(!internalIsOpen));

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            type: 'bot',
            content: "Hi! I'm the FixForward assistant. Ask me anything about the hackathon, or tap a quick action below.",
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Reset chat function
    const resetChat = () => {
        setMessages([{
            id: 'welcome',
            type: 'bot',
            content: "Chat reset! 🔄 Hi again! I'm the FixForward assistant. Ask me anything about the hackathon.",
        }]);
    };

    const handleSend = async (query: string) => {
        if (!query.trim()) return;

        // Check for reset command
        if (query.trim().toLowerCase() === 'hyrup') {
            setInput("");
            resetChat();
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: query.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

        const matches = findFAQMatches(query);

        let botMessage: Message;

        if (matches.length > 0) {
            const topMatch = matches[0];
            // Get suggestions based on the answer's category
            const suggestions = categorySuggestions[topMatch.category] || [];
            botMessage = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: topMatch.answer,
                faqItem: topMatch,
                suggestions: suggestions.filter(s =>
                    s.query.toLowerCase() !== query.toLowerCase()
                ).slice(0, 3),
            };
        } else {
            botMessage = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: "I couldn't find a specific answer for that. Try rephrasing your question, or contact us at fixforward.hyrup@gmail.com for help.",
                suggestions: [
                    { label: "How to register?", query: "register" },
                    { label: "Team info", query: "team size" },
                    { label: "Contact support", query: "contact support" },
                ],
            };
        }

        setIsTyping(false);
        setMessages(prev => [...prev, botMessage]);
    };

    const handleQuickAction = (query: string) => {
        handleSend(query);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(input);
        }
    };

    return (
        <>
            {/* Toggle Button - Desktop only */}
            <motion.button
                onClick={toggleOpen}
                className="hidden md:flex fixed bottom-24 right-6 w-12 h-12 bg-bg-secondary border border-stroke-primary text-accent items-center justify-center z-40 shadow-lg hover:border-accent transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-tour="faq"
            >
                {isOpen ? <X size={20} /> : <Bot size={20} />}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-40 right-6 w-[420px] h-[360px] bg-bg-secondary border border-stroke-primary flex flex-col z-50 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-3 border-b border-stroke-primary bg-bg-tertiary/50 flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent/10 border border-accent/30 flex items-center justify-center">
                                <Bot size={16} className="text-accent" />
                            </div>
                            <div>
                                <span className="text-sm font-bold text-white">FAQ Assistant</span>
                                <span className="text-[10px] text-text-muted block">Ask me anything</span>
                            </div>
                            <button
                                onClick={toggleOpen}
                                className="ml-auto text-text-muted hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    onSuggestionClick={handleQuickAction}
                                />
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-text-muted text-sm"
                                >
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map(i => (
                                            <motion.div
                                                key={i}
                                                className="w-2 h-2 bg-accent/50 rounded-full"
                                                animate={{ y: [0, -4, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                            />
                                        ))}
                                    </div>
                                    <span>Thinking...</span>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        {messages.length <= 2 && (
                            <div className="px-3 pb-2">
                                <div className="flex flex-wrap gap-1">
                                    {quickActions.map((action) => (
                                        <button
                                            key={action.label}
                                            onClick={() => handleQuickAction(action.query)}
                                            className="text-[10px] px-2 py-1 bg-bg-tertiary border border-stroke-primary text-text-muted hover:text-white hover:border-accent transition-colors"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-3 border-t border-stroke-primary">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your question... (type 'hyrup' to reset)"
                                    className="flex-1 bg-bg-tertiary border border-stroke-primary px-3 py-2 text-sm text-white placeholder:text-text-muted focus:border-accent outline-none"
                                    disabled={isTyping}
                                />
                                <button
                                    onClick={() => handleSend(input)}
                                    disabled={!input.trim() || isTyping}
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

function MessageBubble({
    message,
    onSuggestionClick
}: {
    message: Message;
    onSuggestionClick?: (query: string) => void;
}) {
    const isBot = message.type === 'bot';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            <div className={`max-w-[85%] flex gap-2 ${isBot ? '' : 'flex-row-reverse'}`}>
                <div className={`
                    w-6 h-6 shrink-0 flex items-center justify-center
                    ${isBot
                        ? 'bg-accent/10 border border-accent/30 text-accent'
                        : 'bg-bg-tertiary border border-stroke-primary text-text-muted'
                    }
                `}>
                    {isBot ? <Sparkles size={12} /> : <User size={12} />}
                </div>
                <div className="flex flex-col gap-2">
                    <div className={`
                        px-3 py-2 text-sm
                        ${isBot
                            ? 'bg-bg-tertiary text-white border border-stroke-primary'
                            : 'bg-accent/10 text-white border border-accent/30'
                        }
                    `}>
                        {message.content}
                        {message.faqItem && (
                            <span className="block mt-1 text-[9px] text-text-muted">
                                Category: {message.faqItem.category}
                            </span>
                        )}
                    </div>
                    {/* Suggested follow-up questions */}
                    {isBot && message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion) => (
                                <button
                                    key={suggestion.query}
                                    onClick={() => onSuggestionClick?.(suggestion.query)}
                                    className="text-[10px] px-2 py-1 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors"
                                >
                                    {suggestion.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
