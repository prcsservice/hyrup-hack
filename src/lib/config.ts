/**
 * Site Configuration
 * All configurable values that can be changed from admin panel
 * Reference: prd.md - dates should be admin-configurable
 */

export const siteConfig = {
    name: "FixForward",
    tagline: "by HYRUP",
    description:
        "India's national student-powered innovation challenge. Find real problems. Build real fixes. Change real lives.",
    url: "https://fixforward.xyz",

    // Social links
    social: {
        twitter: "https://twitter.com/hyrup",
        linkedin: "https://linkedin.com/company/hyrup",
        instagram: "https://instagram.com/hyrup",
    },

    // Contact
    contact: {
        email: "hello@fixforward.xyz",
        support: "support@fixforward.xyz",
    },
} as const;

export const competitionConfig = {
    // Entry fee
    entryFee: 10, // INR
    currency: "INR",

    // Prize pool
    prizePool: 300000, // INR
    prizePoolFormatted: "₹3,00,000",

    // Team constraints
    minTeamSize: 1,
    maxTeamSize: 5,

    // Deadlines - These should be fetched from admin/Firestore in production
    // Using placeholder dates that will be overridden by admin config
    deadlines: {
        registrationClose: new Date("2025-02-15T23:59:59+05:30"),
        ideaSubmissionClose: new Date("2025-02-25T23:59:59+05:30"),
        prototypeUploadClose: new Date("2025-03-05T23:59:59+05:30"),
        livePitchStart: new Date("2025-03-10T09:00:00+05:30"),
        resultsAnnouncement: new Date("2025-03-15T18:00:00+05:30"),
    },

    // Pitch timing
    pitch: {
        totalMinutes: 15,
        presentationMinutes: 8,
        qnaMinutes: 5,
        bufferMinutes: 2,
    },

    // Judging criteria weights (%)
    judgingCriteria: {
        problemDepth: 20,
        originality: 15,
        feasibility: 15,
        prototype: 15,
        impact: 15,
        livePitch: 20,
    },
} as const;

// Problem domains - layout.md §5.6
export const domains = [
    { id: "healthcare", label: "Healthcare", icon: "Heart" },
    { id: "law", label: "Law", icon: "Scale" },
    { id: "climate", label: "Climate", icon: "Leaf" },
    { id: "education", label: "Education", icon: "GraduationCap" },
    { id: "agriculture", label: "Agriculture", icon: "Wheat" },
    { id: "accessibility", label: "Accessibility", icon: "Accessibility" },
    { id: "energy", label: "Energy", icon: "Zap" },
    { id: "transport", label: "Transport", icon: "Car" },
    { id: "governance", label: "Governance", icon: "Landmark" },
    { id: "safety", label: "Safety", icon: "Shield" },
] as const;

// Timeline milestones - layout.md §5.4
export const timelineMilestones = [
    {
        id: "register",
        label: "Register",
        date: competitionConfig.deadlines.registrationClose,
        description: "Join the movement",
    },
    {
        id: "ideas",
        label: "Idea Submission",
        date: competitionConfig.deadlines.ideaSubmissionClose,
        description: "Submit your problem & solution",
    },
    {
        id: "prototype",
        label: "Prototype",
        date: competitionConfig.deadlines.prototypeUploadClose,
        description: "Build and upload your solution",
    },
    {
        id: "pitch",
        label: "Live Pitches",
        date: competitionConfig.deadlines.livePitchStart,
        description: "Present to the nation",
    },
    {
        id: "results",
        label: "Results",
        date: competitionConfig.deadlines.resultsAnnouncement,
        description: "Winners announced",
    },
] as const;

// Navigation links
export const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#timeline", label: "Timeline" },
    { href: "/#prizes", label: "Prizes" },
    { href: "/#domains", label: "Domains" },
    { href: "/faq", label: "FAQ" },
] as const;

// Footer links - layout.md §4
export const footerLinks = {
    manifesto: [
        { href: "/#what-is-fixforward", label: "What is FixForward" },
        { href: "/#how-it-works", label: "How It Works" },
        { href: "/#timeline", label: "Timeline" },
    ],
    rules: [
        { href: "/rules", label: "Competition Rules" },
        { href: "/faq", label: "FAQ" },
        { href: "/judging", label: "Judging Criteria" },
    ],
    legal: [
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/refund", label: "Refund Policy" },
    ],
    hyrup: [
        { href: "https://hyrup.com", label: "About HYRUP", external: true },
        { href: "https://hyrup.com/careers", label: "Careers", external: true },
        { href: "mailto:hello@hyrup.com", label: "Contact", external: true },
    ],
} as const;
