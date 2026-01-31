"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ArrowLeft, BookOpen, Users, Lightbulb, FileText, Shield, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

const rules = [
    {
        icon: Users,
        title: "Team Formation",
        rules: [
            "Teams must have 1-4 members",
            "Each participant can only be part of one team",
            "Team members can be from different colleges/universities",
            "Team leader is responsible for all submissions"
        ]
    },
    {
        icon: Lightbulb,
        title: "Idea Submission",
        rules: [
            "Ideas must be original and not previously submitted elsewhere",
            "Solutions should address real-world problems",
            "All submissions must be in English",
            "Late submissions will not be accepted"
        ]
    },
    {
        icon: FileText,
        title: "Project Requirements",
        rules: [
            "Projects must be built during the hackathon period",
            "Use of open-source libraries is allowed with proper attribution",
            "Pre-existing code must be disclosed",
            "All intellectual property remains with the team"
        ]
    },
    {
        icon: Shield,
        title: "AI Usage Policy ✅",
        highlight: true,
        rules: [
            "Using AI tools (ChatGPT, GitHub Copilot, Claude, etc.) for coding is ALLOWED",
            "Using AI for prototyping and design is ALLOWED",
            "Just mention in your submission that you used AI assistance",
            "Disclosing AI usage will NOT affect your marks or evaluation",
            "We encourage smart use of modern tools to build better solutions!"
        ]
    },
    {
        icon: Clock,
        title: "Timeline & Deadlines",
        rules: [
            "Follow all phase deadlines strictly",
            "Submit before the deadline to avoid technical issues",
            "Attend mandatory pitch sessions if shortlisted",
            "Winners will be announced as per the schedule"
        ]
    },
    {
        icon: AlertTriangle,
        title: "Disqualification",
        rules: [
            "Submitting work that infringes on others' IP",
            "Harassment or inappropriate behavior",
            "Multiple registrations or fake accounts",
            "Claiming AI work as 100% original without disclosure"
        ]
    }
];

export default function RulesPage() {
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
                            <BookOpen size={20} className="text-accent" />
                            <h1 className="text-2xl md:text-3xl font-display font-bold">Rules & Guidelines</h1>
                        </div>
                        <p className="text-text-secondary text-sm">
                            Please read all rules carefully before participating
                        </p>
                    </div>
                </header>

                {/* Important Notice */}
                <div className="mb-8 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="text-accent mt-0.5" />
                        <div>
                            <h3 className="font-bold text-accent mb-1">Important Notice</h3>
                            <p className="text-sm text-text-secondary">
                                By participating in FixForward, you agree to abide by all rules and guidelines.
                                Violation of any rule may result in disqualification.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rules Grid */}
                <div className="space-y-6">
                    {rules.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-bg-secondary border border-stroke-primary p-6 rounded-lg"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-center">
                                        <Icon size={20} className="text-accent" />
                                    </div>
                                    <h2 className="text-xl font-display font-bold">{section.title}</h2>
                                </div>
                                <ul className="space-y-3">
                                    {section.rules.map((rule, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                <div className="mt-8 p-6 bg-bg-tertiary border border-stroke-divider rounded-lg text-center">
                    <p className="text-text-secondary mb-4">
                        Have questions about the rules? Contact our support team.
                    </p>
                    <Link href="/contact">
                        <Button>Get Support</Button>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
