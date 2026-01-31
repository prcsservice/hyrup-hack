"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Rocket, Users, Target, Sparkles, ChevronRight } from "lucide-react";

/**
 * WhyHyrup - Redesigned "About HYRUP" section
 * Features: Innovative layout, scroll animations, mission-focused content
 */
export function WhyHyrup() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    return (
        <section
            ref={sectionRef}
            className="relative py-32 bg-[#050505] overflow-hidden"
            id="why-hyrup"
        >
            {/* Animated Background Elements */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: backgroundY }}
            >
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(#FF4D00 1px, transparent 1px), linear-gradient(90deg, #FF4D00 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
                {/* Floating accent */}
                <motion.div
                    className="absolute top-[20%] right-[5%] w-2 h-2 bg-[#FF4D00]"
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-[30%] left-[8%] w-1 h-1 bg-[#FF4D00]"
                    animate={{
                        y: [0, 15, 0],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
            </motion.div>

            <div className="container relative z-10">
                {/* Section Label */}
                <motion.div
                    className="flex items-center gap-4 mb-16"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-[#FF4D00] font-mono text-sm tracking-widest">00</span>
                    <div className="h-px w-12 bg-[#FF4D00]/30" />
                    <span className="text-white/40 font-mono text-xs tracking-widest uppercase">
                        Meet HYRUP
                    </span>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left Column - Story */}
                    <div className="space-y-8">
                        {/* Large Statement */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] mb-6">
                                The meaning behind{" "}
                                <span className="text-[#FF4D00]">FixForward</span>
                            </h2>
                            <p className="text-white/50 text-lg leading-relaxed">
                                There's a saying — when someone helps you, you don't just thank them.
                                You help someone else in need. The cycle continues.
                            </p>
                        </motion.div>

                        {/* The Philosophy */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="border-l-2 border-[#FF4D00]/30 pl-6 space-y-4">
                                <p className="text-white/60 leading-relaxed text-lg">
                                    <span className="text-[#FF4D00] font-bold text-xl">FixForward</span> is built on the same idea.
                                    You see something broken in society? <span className="text-white font-medium">Fix it.</span>
                                    {" "}Not just for yourself, but for the next generation.
                                    <span className="text-white font-medium"> Forward the fix.</span>
                                </p>
                                <p className="text-white/60 leading-relaxed">
                                    We're looking for problem-solvers who see issues in their daily lives and
                                    have the courage to create solutions that ripple forward.
                                </p>
                            </div>
                        </motion.div>

                        {/* HYRUP Highlight Box */}
                        <motion.div
                            className="bg-[#FF4D00]/5 border border-[#FF4D00]/20 p-6 relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-[#050505]">
                                <span className="text-[#FF4D00] font-mono text-xs tracking-widest uppercase">About HYRUP</span>
                            </div>
                            <p className="text-white/70 leading-relaxed mt-2 mb-6">
                                <span className="text-[#FF4D00] font-bold text-2xl">HYRUP</span> is India's first social learning
                                network designed specifically for students from Tier 2 & Tier 3 colleges.
                                We believe <span className="text-white font-medium">talent is everywhere, opportunity isn't</span> —
                                and we're here to change that.
                            </p>

                            {/* Explore HYRUP Button */}
                            <a
                                href="https://students.hyrup.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-5 py-3 bg-[#FF4D00] text-black font-bold text-sm hover:bg-[#FF4D00]/90 transition-all"
                            >
                                <Rocket className="w-4 h-4" />
                                <span>Explore HYRUP</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </motion.div>

                        {/* Mission Statement */}
                        <motion.div
                            className="bg-[#0a0a0a] border border-white/10 p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#FF4D00]/10 flex items-center justify-center flex-shrink-0">
                                    <Target className="w-5 h-5 text-[#FF4D00]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-2">Our Mission</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        To democratize opportunity. To build a generation of builders
                                        who create solutions for real India problems.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA - Inviting, not forcing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <a
                                href="https://hyrup.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors"
                            >
                                <span className="text-sm">Curious about HYRUP?</span>
                                <span className="flex items-center gap-1 text-[#FF4D00] group-hover:gap-2 transition-all">
                                    <span className="text-sm font-bold">Learn more</span>
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Right Column - What You Get */}
                    <div className="space-y-6">
                        <motion.h3
                            className="text-white/40 font-mono text-xs tracking-widest uppercase mb-8"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            What you get by joining
                        </motion.h3>

                        {/* Benefit Cards - Staggered Animation */}
                        <div className="space-y-4">
                            <BenefitCard
                                icon={Users}
                                title="A Community That Gets It"
                                description="Connect with peers who share your hunger. Build together, learn together, grow together."
                                delay={0.4}
                                isInView={isInView}
                            />
                            <BenefitCard
                                icon={Rocket}
                                title="Real-World Exposure"
                                description="Work on problems that matter. Get your solutions seen by people who can help scale them."
                                delay={0.5}
                                isInView={isInView}
                            />
                            <BenefitCard
                                icon={Sparkles}
                                title="Career Kickstart"
                                description="Your hackathon project becomes your portfolio. Stand out to recruiters and mentors."
                                delay={0.6}
                                isInView={isInView}
                            />
                        </div>

                        {/* Interactive Element - The Journey */}
                        <motion.div
                            className="mt-10 p-6 bg-[#0a0a0a] border border-white/10 relative overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            {/* Animated corner accent */}
                            <motion.div
                                className="absolute top-0 right-0 w-20 h-20"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 1.2 }}
                            >
                                <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[#FF4D00] to-transparent" />
                                <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-[#FF4D00] to-transparent" />
                            </motion.div>

                            <h4 className="text-white font-mono text-sm uppercase tracking-wider mb-6">
                                Your Journey with HYRUP
                            </h4>

                            <div className="space-y-0">
                                <JourneyStep
                                    step="01"
                                    text="Participate in FixForward"
                                    isActive
                                    delay={0.9}
                                    isInView={isInView}
                                />
                                <JourneyConnector delay={1.0} isInView={isInView} />
                                <JourneyStep
                                    step="02"
                                    text="Join the HYRUP community"
                                    delay={1.1}
                                    isInView={isInView}
                                />
                                <JourneyConnector delay={1.2} isInView={isInView} />
                                <JourneyStep
                                    step="03"
                                    text="Build your portfolio"
                                    delay={1.3}
                                    isInView={isInView}
                                />
                                <JourneyConnector delay={1.4} isInView={isInView} />
                                <JourneyStep
                                    step="04"
                                    text="Get discovered"
                                    delay={1.5}
                                    isInView={isInView}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/**
 * Benefit Card Component
 */
interface BenefitCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    delay: number;
    isInView: boolean;
}

function BenefitCard({ icon: Icon, title, description, delay, isInView }: BenefitCardProps) {
    return (
        <motion.div
            className="group p-5 bg-[#0a0a0a] border border-white/5 hover:border-[#FF4D00]/30 transition-all duration-300 cursor-default"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            whileHover={{ x: 4 }}
        >
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#FF4D00]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF4D00]/20 transition-colors">
                    <Icon className="w-5 h-5 text-[#FF4D00]" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-bold">{title}</h4>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#FF4D00] group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Journey Step Component
 */
interface JourneyStepProps {
    step: string;
    text: string;
    isActive?: boolean;
    delay: number;
    isInView: boolean;
}

function JourneyStep({ step, text, isActive, delay, isInView }: JourneyStepProps) {
    return (
        <motion.div
            className={`flex items-center gap-4 py-3 ${isActive ? 'text-white' : 'text-white/40'}`}
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay }}
        >
            <span className={`font-mono text-xs ${isActive ? 'text-[#FF4D00]' : 'text-white/30'}`}>
                {step}
            </span>
            <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                {text}
            </span>
            {isActive && (
                <motion.span
                    className="ml-auto text-xs text-[#FF4D00] font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.3 }}
                >
                    YOU ARE HERE
                </motion.span>
            )}
        </motion.div>
    );
}

/**
 * Journey Connector Line
 */
interface JourneyConnectorProps {
    delay: number;
    isInView: boolean;
}

function JourneyConnector({ delay, isInView }: JourneyConnectorProps) {
    return (
        <motion.div
            className="ml-[10px] h-4 w-px bg-white/10"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.3, delay }}
            style={{ originY: 0 }}
        />
    );
}
