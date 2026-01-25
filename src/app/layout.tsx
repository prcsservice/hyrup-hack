import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { NotificationBanner } from "@/components/layout/NotificationBanner";

import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FixForward by HYRUP | India's Student Innovation Challenge",
  description:
    "Join India's national student-powered innovation challenge. Find real problems in healthcare, law, climate, education & more. Build real fixes. Win ₹3,00,000.",
  keywords: [
    "student innovation",
    "hackathon",
    "India",
    "HYRUP",
    "FixForward",
    "problem solving",
    "startup",
    "competition",
  ],
  authors: [{ name: "HYRUP" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://fixforward.xyz",
    siteName: "FixForward by HYRUP",
    title: "FixForward | Students Fixing What's Broken",
    description:
      "India's national student innovation challenge. ₹3,00,000 prize pool. Open to all domains.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FixForward by HYRUP",
    description: "Students. Fixing What's Broken.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <SmoothScrollProvider>
            <ToastProvider>
              <NotificationBanner />

              {/* Noise overlay - design.md §15 */}
              <div className="noise-overlay" aria-hidden="true" />

              {/* Grid overlay - design.md §5 */}
              <div className="grid-overlay" aria-hidden="true" />

              {/* Main content */}
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            </ToastProvider>
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
