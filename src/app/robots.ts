import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/admin/'], // Hide private routes
        },
        sitemap: 'https://fixforward.hyrup.in/sitemap.xml',
    }
}
