"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeft, Mail, MessageCircle, Headphones, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
    const openWhatsApp = () => {
        const message = encodeURIComponent("Hi! I need help with FixForward hackathon.");
        window.open(`https://wa.me/918730935265?text=${message}`, '_blank');
    };

    const openEmail = () => {
        window.location.href = "mailto:fixforward.hyrup@gmail.com?subject=FixForward Support Request";
    };

    return (
        <DashboardLayout showChat={false}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0 border-stroke-divider"
                        >
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <Headphones size={20} className="text-accent" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold">Get Support</h1>
                        </div>
                        <p className="text-text-secondary text-sm">
                            We're here to help you succeed
                        </p>
                    </div>
                </header>

                {/* Contact Cards Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Email Support - Large Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 bg-bg-secondary border border-stroke-primary p-6 rounded-lg"
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center shrink-0">
                                <Mail size={32} className="text-black" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-display font-bold mb-1">Email Support</h2>
                                <a
                                    href="mailto:fixforward.hyrup@gmail.com"
                                    className="text-accent hover:underline font-mono text-lg"
                                >
                                    fixforward.hyrup@gmail.com
                                </a>
                                <p className="text-text-secondary text-sm mt-2">
                                    For onboarding help, technical issues, submission queries, and feature requests.
                                    We respond within 24 hours.
                                </p>
                            </div>
                            <Button onClick={openEmail} className="shrink-0">
                                <Send size={16} className="mr-2" />
                                Send Email
                            </Button>
                        </div>
                    </motion.div>

                    {/* Live Support Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-bg-secondary border border-stroke-primary p-6 rounded-lg relative overflow-hidden"
                    >
                        {/* Live Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-green-500 font-mono uppercase">Live</span>
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-accent/20 border-2 border-dashed border-accent/40 rounded-full flex items-center justify-center">
                                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                                        <Headphones size={24} className="text-black" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-bg-secondary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-display font-bold">Live Support</h2>
                                <span className="text-accent text-sm">Online Now</span>
                            </div>
                        </div>

                        <p className="text-text-secondary text-sm mb-4">
                            Talk to our support team in real-time. Average response time under 5 minutes.
                        </p>

                        <Button
                            onClick={openWhatsApp}
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                        >
                            <MessageCircle size={18} className="mr-2" />
                            Chat on WhatsApp
                        </Button>
                    </motion.div>

                    {/* Response Time Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-bg-secondary border border-stroke-primary p-6 rounded-lg"
                    >
                        <div className="w-12 h-12 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-center mb-4">
                            <Clock size={24} className="text-accent" />
                        </div>
                        <h2 className="text-xl font-display font-bold mb-2">Support Hours</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-muted">Email Response</span>
                                <span className="text-white">Within 24 hours</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">WhatsApp</span>
                                <span className="text-white">10 AM - 7 PM (IST)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">Working Days</span>
                                <span className="text-white">Mon - Sat</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* FAQ Redirect */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-bg-tertiary border border-stroke-divider p-6 rounded-lg text-center"
                >
                    <h3 className="font-display font-bold mb-2">Looking for quick answers?</h3>
                    <p className="text-text-secondary text-sm mb-4">
                        Check out our FAQ section for commonly asked questions about the hackathon.
                    </p>
                    <Link href="/faq">
                        <Button variant="secondary">View FAQ</Button>
                    </Link>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
