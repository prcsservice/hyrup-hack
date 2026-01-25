export default function TermsPage() {
    return (
        <div className="min-h-screen bg-bg-primary pt-32 pb-20">
            <div className="container max-w-3xl">
                <h1 className="text-4xl font-display font-bold mb-8">Terms & Conditions</h1>

                <div className="space-y-8 text-text-secondary leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Eligibility</h2>
                        <p>
                            FixForward is open to all students currently enrolled in a university, college, or school in India.
                            Participants must be at least 15 years of age. Teams can consist of 1 to 5 members.
                            Cross-college teams are permitted and encouraged.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Intellectual Property</h2>
                        <p>
                            You own what you build. HYRUP does not claim any ownership over the intellectual property (IP)
                            generated during the hackathon. However, by participating, you grant HYRUP a non-exclusive
                            license to display, demonstrate, and promote your project for marketing and educational purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Code of Conduct</h2>
                        <p>
                            We are committed to providing a harassment-free experience for everyone.
                            Harassment includes offensive verbal comments related to gender, sexual orientation, disability,
                            physical appearance, body size, race, or religion. Participants violation these rules may be
                            expelled from the hackathon at the discretion of the organizers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Disqualification</h2>
                        <p>
                            Teams may be disqualified for:
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Submitting previously built projects (plagiarism).</li>
                                <li>Violating the Code of Conduct.</li>
                                <li>Providing false information during registration.</li>
                            </ul>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            HYRUP and its sponsors are not responsible for any damage to your computer system or loss of data
                            that results from participation in the event.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-stroke-primary">
                        <p className="text-sm text-text-muted">
                            Last updated: January 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
