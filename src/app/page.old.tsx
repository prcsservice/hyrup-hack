import { Header, Footer } from "@/components/layout";
import {
    HeroSection,
    RegistrationTimerBar,
    StatementSection,
    HowItWorksSection,
    TimelineSection,
    PrizePoolSection,
    DomainsSection,
    JudgingSection,
    CommunitySection,
    FinalCtaSection,
} from "@/components/landing";

/**
 * FixForward Landing Page v2.0
 * Reference: layout.md v2.0 — Editorial / Grid-Locked / Scroll-Architected
 * 
 * Landing behaves like a scroll essay.
 * Each section is a chapter.
 * All sections framed by horizontal rules.
 * 
 * Keywords: Grid-locked, Editorial, Manifesto, Scroll-pinned, Architectural,
 *           Minimal, System UI, Wireframe, Serious, Anti-bento
 */
export default function LandingPage() {
    return (
        <>
            <Header />

            <main>
                {/* 01 - THE CALL: Sticky hero with wireframe geometry */}
                <HeroSection />

                {/* NEW: Registration Timer Bar (Separate Section) */}
                <RegistrationTimerBar />

                {/* 02 - THE STATEMENT: Single huge sentence */}
                <StatementSection />

                {/* 03 - THE PROCESS: 5-step grid */}
                <HowItWorksSection />

                {/* 04 - TIMELINE: Horizontal axis with scroll marker */}
                <TimelineSection />

                {/* 05 - PRIZE: Ultra minimal, large figure */}
                <PrizePoolSection />

                {/* 06 - DOMAINS: Icon matrix */}
                <DomainsSection />

                {/* 07 - JUDGING: Split grid with radar plot */}
                <JudgingSection />

                {/* 08 - SCALE: Massive numbers + ticker */}
                <CommunitySection />

                {/* 09 - JOIN: Final CTA */}
                <FinalCtaSection />
            </main>

            <Footer />
        </>
    );
}
