export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-bg-primary pt-32 pb-20">
            <div className="container max-w-3xl">
                <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>

                <div className="space-y-8 text-text-secondary leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Data Collection</h2>
                        <p>
                            We collect basic profile information (Name, Email, Photo) when you sign in via Google.
                            We also collect team information, project details, and code repository links that you voluntarily provide
                            during the submission process.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Data Usage</h2>
                        <p>
                            Your data is used solely for the purpose of administering the FixForward hackathon. This includes:
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Verifying eligibility and identity.</li>
                                <li>Facilitating team formation and judging.</li>
                                <li>Communicating important updates and results.</li>
                                <li>Distributing prizes.</li>
                            </ul>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Data Sharing</h2>
                        <p>
                            We do not sell your personal data. We may share project details (Pitch Decks, Video Demos) with
                            our panel of judges and sponsors for the purpose of evaluation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Cookies</h2>
                        <p>
                            We use cookies solely for authentication (Firebase Auth) and essential site functionality.
                            We do not use third-party tracking cookies for advertising.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-stroke-primary">
                        <p className="text-sm text-text-muted">
                            Contact: privacy@fixforward.xyz
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
