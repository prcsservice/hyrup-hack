import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'FixForward by HYRUP'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#050505',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Background Grid Pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage:
                            'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.2,
                    }}
                />

                {/* Glow Effects */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '20%',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(255,77,0,0.15) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                    {/* Logo Placeholder or Text */}
                    <div style={{
                        fontSize: 64,
                        fontWeight: 900,
                        color: '#FF4D00', // Brand Orange
                        letterSpacing: '-2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        HYRUP
                    </div>
                </div>

                <div
                    style={{
                        fontSize: 84,
                        fontWeight: 800,
                        color: 'white',
                        marginBottom: 20,
                        letterSpacing: '-3px',
                        textAlign: 'center',
                        lineHeight: 1,
                        textShadow: '0 0 40px rgba(0,0,0,0.5)'
                    }}
                >
                    FixForward
                </div>

                <div
                    style={{
                        fontSize: 32,
                        color: '#A3A3A3',
                        marginBottom: 40,
                        textAlign: 'center',
                        maxWidth: '800px',
                        fontWeight: 500,
                    }}
                >
                    India's Student Innovation Challenge
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#FF4D00',
                        color: 'black',
                        padding: '12px 32px',
                        borderRadius: '50px',
                        fontSize: 24,
                        fontWeight: 700,
                    }}
                >
                    Win ₹3,00,000 Prize Pool
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
