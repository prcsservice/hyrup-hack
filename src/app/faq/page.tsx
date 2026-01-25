"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "content", "faq"), (d) => {
            if (d.exists()) {
                setFaqs(d.data().items || []);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    return (
        <div className="min-h-screen bg-bg-primary pt-32 pb-20">
            <div className="container max-w-3xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter">
                        F<span className="text-stroke-primary text-transparent">AQ</span>s
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Everything you need to know about FixForward.
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-bg-secondary animate-pulse rounded-sm border border-stroke-primary" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faqs.length === 0 ? (
                            <div className="text-center py-20 text-text-muted border border-dashed border-stroke-primary rounded-sm">
                                No questions added yet. Check back soon.
                            </div>
                        ) : (
                            faqs.map(item => (
                                <FAQItemView key={item.id} item={item} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function FAQItemView({ item }: { item: FAQItem }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`
                bg-bg-secondary border transition-colors rounded-sm cursor-pointer
                ${isOpen ? 'border-accent/50' : 'border-stroke-primary hover:border-stroke-secondary'}
            `}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="p-6 flex justify-between items-center gap-4">
                <h3 className={`font-bold text-lg ${isOpen ? 'text-accent' : 'text-white'}`}>
                    {item.question}
                </h3>
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center border transition-all shrink-0
                    ${isOpen ? 'bg-accent text-bg-primary border-accent' : 'bg-bg-tertiary text-text-muted border-stroke-divider'}
                `}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 text-text-secondary leading-relaxed border-t border-stroke-divider/50 pt-4">
                            {item.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
