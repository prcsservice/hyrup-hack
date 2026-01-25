import {
  HeroV2,
  ManifestoSection,
  HorizontalSteps,
  TimelineV2,
  PrizeV2,
  BentoGrid,
  StatsV2,
  FinalCtaV2,
  HeaderV2,
  FooterV2,
} from "@/components/v2";

/**
 * FixForward Landing Page V2
 * Theme: "India is Broken. Students Are Fixing It."
 * 
 * Features:
 * - Split-flap text animations
 * - Horizontal scroll for How It Works
 * - Scroll-linked text reveals
 * - Orange/Black/White palette
 * - Footer reveal effect (main content scrolls to reveal footer)
 */
export default function LandingPage() {
  return (
    <div className="relative">
      <HeaderV2 />

      {/* Main content */}
      <main className="relative z-10 bg-[#050505]">
        {/* 01 - THE CALL: Revolutionary hero */}
        <HeroV2 />

        {/* 02 - THE MANIFESTO: Emotional storytelling */}
        <ManifestoSection />

        {/* 03 - THE PROCESS: Horizontal scroll steps */}
        <HorizontalSteps />

        {/* 04 - TIMELINE: The clock is ticking */}
        <TimelineV2 />

        {/* 05 - PRIZE: Large figure */}
        <PrizeV2 />

        {/* 06 - DOMAINS: Bento grid */}
        <BentoGrid />

        {/* 08 - STATS: Orange inverted block */}
        <StatsV2 />
      </main>

      {/* Sticky Final CTA - z-0 to sit behind footer */}
      <FinalCtaV2 />

      {/* Footer - Slides over the sticky CTA */}
      <FooterV2 />
    </div>
  );
}
