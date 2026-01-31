import nodemailer from 'nodemailer';

// Email transporter configuration
// Uses Gmail SMTP (or any SMTP service)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App password for Gmail
    },
});

// Email templates - Clean, sharp, modern design matching FixForward theme
export const emailTemplates = {
    welcome: (name: string) => ({
        subject: 'Welcome to FixForward by HYRUP',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                    <!-- Header -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 32px;">
                            <span style="font-size: 24px; font-weight: 700; color: #FF4D00; letter-spacing: -0.5px;">FixForward</span>
                            <span style="font-size: 12px; color: #666666; margin-left: 8px;">by HYRUP</span>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="background-color: #141414; border: 1px solid #222222; padding: 40px;">
                            <h1 style="margin: 0 0 16px 0; color: #ffffff; font-size: 28px; font-weight: 700;">Welcome, ${name}</h1>
                            <p style="margin: 0 0 24px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                                You're now part of <span style="color: #FF4D00; font-weight: 600;">FixForward</span> – India's platform for student-led solutions to real-world problems.
                            </p>
                            
                            <!-- Steps -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #2a2a2a; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="margin: 0 0 16px 0; color: #ffffff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Next Steps</p>
                                        
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <table cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="width: 28px; height: 28px; background-color: #FF4D00; color: #000000; font-size: 12px; font-weight: 700; text-align: center; vertical-align: middle;">1</td>
                                                            <td style="padding-left: 12px; color: #ffffff; font-size: 14px;">Create or join a team (2-4 members)</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <table cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="width: 28px; height: 28px; background-color: #FF4D00; color: #000000; font-size: 12px; font-weight: 700; text-align: center; vertical-align: middle;">2</td>
                                                            <td style="padding-left: 12px; color: #ffffff; font-size: 14px;">Submit your problem statement and solution</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <table cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="width: 28px; height: 28px; background-color: #FF4D00; color: #000000; font-size: 12px; font-weight: 700; text-align: center; vertical-align: middle;">3</td>
                                                            <td style="padding-left: 12px; color: #ffffff; font-size: 14px;">Build your prototype and pitch deck</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 8px 0;">
                                        <a href="https://fixforward.hyrup.com/dashboard" style="display: inline-block; background-color: #FF4D00; color: #000000; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Go to Dashboard</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- About HYRUP -->
                            <p style="margin: 32px 0 0 0; padding-top: 24px; border-top: 1px solid #2a2a2a; color: #888888; font-size: 13px; line-height: 1.6;">
                                <strong style="color: #cccccc;">About HYRUP:</strong> We're building India's largest student ecosystem. After FixForward, unlock internships, jobs, and peer connections on our platform.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="text-align: center; padding: 32px 0;">
                            <p style="margin: 0 0 8px 0; color: #666666; font-size: 12px;">HYRUP Labs 2026. All rights reserved.</p>
                            <p style="margin: 0; color: #444444; font-size: 11px;">You're receiving this because you registered for FixForward.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    }),

    judgeInvite: (judgeName: string, passkey: string) => ({
        subject: 'You are Invited to Judge FixForward',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                    <!-- Header -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 32px;">
                            <span style="font-size: 24px; font-weight: 700; color: #FF4D00; letter-spacing: -0.5px;">FixForward</span>
                            <span style="font-size: 12px; color: #666666; margin-left: 8px;">by HYRUP</span>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="background-color: #141414; border: 1px solid #222222; padding: 40px;">
                            <h1 style="margin: 0 0 16px 0; color: #ffffff; font-size: 28px; font-weight: 700;">Hello, ${judgeName}</h1>
                            <p style="margin: 0 0 24px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
                                You've been invited to be a <span style="color: #FF4D00; font-weight: 600;">Judge</span> at FixForward – HYRUP's flagship hackathon for student innovators.
                            </p>
                            
                            <!-- Passkey Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 2px solid #FF4D00; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 24px; text-align: center;">
                                        <p style="margin: 0 0 12px 0; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Your Passkey</p>
                                        <p style="margin: 0; color: #FF4D00; font-size: 32px; font-weight: 700; letter-spacing: 6px; font-family: monospace;">${passkey}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 8px 0;">
                                        <a href="https://fixforward.hyrup.com/judge/claim" style="display: inline-block; background-color: #FF4D00; color: #000000; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Claim Judge Access</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 32px 0 0 0; padding-top: 24px; border-top: 1px solid #2a2a2a; color: #888888; font-size: 13px; line-height: 1.6;">
                                As a judge, you'll evaluate innovative solutions from students across India. Thank you for contributing your expertise.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="text-align: center; padding: 32px 0;">
                            <p style="margin: 0; color: #666666; font-size: 12px;">HYRUP Labs 2026. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    }),

    broadcast: (subject: string, message: string) => ({
        subject: subject,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                    <!-- Header -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 32px;">
                            <span style="font-size: 24px; font-weight: 700; color: #FF4D00; letter-spacing: -0.5px;">FixForward</span>
                            <span style="font-size: 12px; color: #666666; margin-left: 8px;">by HYRUP</span>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="background-color: #141414; border: 1px solid #222222; padding: 40px;">
                            <h1 style="margin: 0 0 24px 0; color: #ffffff; font-size: 24px; font-weight: 700;">${subject}</h1>
                            <p style="margin: 0 0 24px 0; color: #cccccc; font-size: 15px; line-height: 1.8; white-space: pre-line;">${message}</p>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 16px 0 0 0;">
                                        <a href="https://fixforward.hyrup.com/dashboard" style="display: inline-block; background-color: #FF4D00; color: #000000; padding: 14px 32px; text-decoration: none; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">View Dashboard</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="text-align: center; padding: 32px 0;">
                            <p style="margin: 0 0 8px 0; color: #666666; font-size: 12px;">HYRUP Labs 2026. All rights reserved.</p>
                            <p style="margin: 0; color: #444444; font-size: 11px;">You're receiving this because you're registered for FixForward.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    }),
};

// Send email function
export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string | string[];
    subject: string;
    html: string;
}) {
    try {
        const info = await transporter.sendMail({
            from: `"FixForward by HYRUP" <${process.env.SMTP_USER}>`,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            html,
        });

        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email send failed:', error);
        return { success: false, error: (error as Error).message };
    }
}

// Helper functions for specific email types
export async function sendWelcomeEmail(to: string, name: string) {
    const template = emailTemplates.welcome(name);
    return sendEmail({ to, ...template });
}

export async function sendJudgeInviteEmail(to: string, judgeName: string, passkey: string) {
    const template = emailTemplates.judgeInvite(judgeName, passkey);
    return sendEmail({ to, ...template });
}

export async function sendBroadcastEmail(to: string[], subject: string, message: string) {
    const template = emailTemplates.broadcast(subject, message);
    return sendEmail({ to, ...template });
}

