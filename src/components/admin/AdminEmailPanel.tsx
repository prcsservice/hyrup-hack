"use client";

import { useState } from "react";
import { Send, Users, Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type EmailType = 'individual' | 'broadcast';

export function AdminEmailPanel() {
    const [emailType, setEmailType] = useState<EmailType>('individual');
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [userCount, setUserCount] = useState<number | null>(null);

    const fetchUserCount = async () => {
        const snapshot = await getDocs(collection(db, 'users'));
        setUserCount(snapshot.size);
    };

    const handleSend = async () => {
        if (!subject || !message) {
            setResult({ success: false, message: 'Subject and message are required' });
            return;
        }

        if (emailType === 'individual' && !to) {
            setResult({ success: false, message: 'Recipient email is required' });
            return;
        }

        setSending(true);
        setResult(null);

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // In production, get this token securely
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_EMAIL_API_SECRET || 'dev-secret'}`,
                },
                body: JSON.stringify({
                    type: 'broadcast',
                    to: emailType === 'individual' ? to : undefined,
                    sendToAll: emailType === 'broadcast',
                    subject,
                    message,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setResult({
                    success: true,
                    message: emailType === 'broadcast'
                        ? `Email sent to ${data.recipientCount} users!`
                        : 'Email sent successfully!',
                });
                setSubject('');
                setMessage('');
                setTo('');
            } else {
                setResult({ success: false, message: data.error || 'Failed to send email' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Network error. Please try again.' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-bg-secondary border border-stroke-primary rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <Mail className="text-accent" size={24} />
                <h2 className="text-xl font-display font-bold text-white">Send Emails</h2>
            </div>

            {/* Email Type Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setEmailType('individual')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${emailType === 'individual'
                            ? 'bg-accent text-black'
                            : 'bg-bg-tertiary text-text-muted hover:text-white'
                        }`}
                >
                    Individual
                </button>
                <button
                    onClick={() => {
                        setEmailType('broadcast');
                        fetchUserCount();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${emailType === 'broadcast'
                            ? 'bg-accent text-black'
                            : 'bg-bg-tertiary text-text-muted hover:text-white'
                        }`}
                >
                    <Users size={14} />
                    Broadcast to All
                </button>
            </div>

            {/* Broadcast Warning */}
            {emailType === 'broadcast' && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 rounded-lg mb-4 text-sm">
                    <strong>⚠️ Broadcast Mode:</strong> This will send an email to{' '}
                    {userCount !== null ? <strong>{userCount}</strong> : '...'} registered users.
                </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
                {emailType === 'individual' && (
                    <div>
                        <label className="block text-xs uppercase text-text-muted mb-2 font-mono">
                            Recipient Email
                        </label>
                        <input
                            type="email"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full bg-bg-tertiary border border-stroke-divider p-3 rounded-lg text-white focus:border-accent outline-none"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-xs uppercase text-text-muted mb-2 font-mono">
                        Subject
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Important Update about FixForward"
                        className="w-full bg-bg-tertiary border border-stroke-divider p-3 rounded-lg text-white focus:border-accent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs uppercase text-text-muted mb-2 font-mono">
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        rows={6}
                        className="w-full bg-bg-tertiary border border-stroke-divider p-3 rounded-lg text-white focus:border-accent outline-none resize-none"
                    />
                </div>

                {/* Result Message */}
                {result && (
                    <div
                        className={`p-4 rounded-lg flex items-center gap-3 ${result.success
                                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                                : 'bg-red-500/10 border border-red-500/30 text-red-400'
                            }`}
                    >
                        {result.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {result.message}
                    </div>
                )}

                {/* Send Button */}
                <Button
                    onClick={handleSend}
                    disabled={sending}
                    className="w-full"
                >
                    {sending ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send size={16} className="mr-2" />
                            {emailType === 'broadcast' ? 'Send to All Users' : 'Send Email'}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
