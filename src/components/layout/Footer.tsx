"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { siteConfig, footerLinks } from "@/lib/config";

/**
 * Footer v2.0
 * Reference: layout.md §4
 * 
 * Grid-based, minimal.
 * Top border only.
 * Bottom caption: "Built for students who refuse broken systems."
 */

export function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
        { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
        { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
    ];

    const pathname = usePathname();

    if (pathname?.startsWith('/admin')) return null;

    return (
        <footer className="border-t border-stroke-divider bg-bg-secondary">
            <div className="container py-16">
                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href="/" className="inline-block">
                            <span className="text-lg font-semibold">FixForward</span>
                            <span className="text-label text-text-muted ml-2">{siteConfig.tagline}</span>
                        </Link>
                        <p className="text-sm text-text-secondary mt-4 max-w-xs">
                            India&apos;s student-powered innovation movement.
                        </p>

                        {/* Social */}
                        <div className="flex gap-2 mt-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 border border-stroke-divider hover:border-stroke-primary hover:text-accent transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" strokeWidth={1} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <FooterColumn title="Manifesto" links={footerLinks.manifesto} />
                    <FooterColumn title="Rules" links={footerLinks.rules} />
                    <FooterColumn title="Legal" links={footerLinks.legal} />
                    <FooterColumn title="HYRUP" links={footerLinks.hyrup} />
                </div>

                {/* Bottom caption */}
                <div className="mt-16 pt-8 border-t border-stroke-divider flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
                    <p>&ldquo;Built for students who refuse broken systems.&rdquo;</p>
                    <div className="flex gap-4">
                        <Link href="/admin" className="hover:text-accent transition-colors">Admin</Link>
                        <p>© {currentYear} HYRUP</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({
    title,
    links,
}: {
    title: string;
    links: readonly { href: string; label: string; external?: boolean }[];
}) {
    return (
        <div>
            <h4 className="text-label text-text-muted mb-4">{title}</h4>
            <ul className="space-y-2">
                {links.map((link) => (
                    <li key={link.href}>
                        {link.external ? (
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1 group"
                            >
                                {link.label}
                                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ) : (
                            <Link
                                href={link.href}
                                className="text-sm text-text-secondary hover:text-accent transition-colors"
                            >
                                {link.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
