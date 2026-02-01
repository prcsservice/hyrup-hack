import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'FixForward by HYRUP',
        short_name: 'FixForward',
        description: "India's Student Innovation Challenge",
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#FF4D00',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
