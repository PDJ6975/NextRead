/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    },
    images: {
        domains: ['localhost', 'api.nextread.com', 'github.io'],
        unoptimized: true, // Para GitHub Pages
    },
    trailingSlash: true, // Para GitHub Pages
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
    basePath: process.env.NODE_ENV === 'production' ? '/NextRead_NOAI' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/NextRead_NOAI/' : '',
    async redirects() {
        return [
            {
                source: '/dashboard',
                destination: '/home',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig; 