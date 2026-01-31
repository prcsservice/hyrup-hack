import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail, sendJudgeInviteEmail, sendBroadcastEmail } from '@/lib/email';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// API Route for sending emails
// POST /api/email
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, ...data } = body;

        // Basic auth check (in production, verify admin token)
        const authHeader = request.headers.get('authorization');
        if (!authHeader || authHeader !== `Bearer ${process.env.EMAIL_API_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        switch (type) {
            case 'welcome': {
                const { to, name } = data;
                if (!to || !name) {
                    return NextResponse.json({ error: 'Missing required fields: to, name' }, { status: 400 });
                }
                const result = await sendWelcomeEmail(to, name);
                return NextResponse.json(result);
            }

            case 'judge-invite': {
                const { to, judgeName, passkey } = data;
                if (!to || !judgeName || !passkey) {
                    return NextResponse.json({ error: 'Missing required fields: to, judgeName, passkey' }, { status: 400 });
                }
                const result = await sendJudgeInviteEmail(to, judgeName, passkey);
                return NextResponse.json(result);
            }

            case 'broadcast': {
                const { subject, message, sendToAll } = data;
                if (!subject || !message) {
                    return NextResponse.json({ error: 'Missing required fields: subject, message' }, { status: 400 });
                }

                // If sendToAll, fetch all user emails from Firestore
                let recipients: string[] = [];
                if (sendToAll) {
                    const usersSnapshot = await getDocs(collection(db, 'users'));
                    recipients = usersSnapshot.docs
                        .map(doc => doc.data().email)
                        .filter((email): email is string => !!email);
                } else if (data.to) {
                    recipients = Array.isArray(data.to) ? data.to : [data.to];
                }

                if (recipients.length === 0) {
                    return NextResponse.json({ error: 'No recipients found' }, { status: 400 });
                }

                const result = await sendBroadcastEmail(recipients, subject, message);
                return NextResponse.json({ ...result, recipientCount: recipients.length });
            }

            default:
                return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
        }
    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
