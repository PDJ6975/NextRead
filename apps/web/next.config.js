/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'books.google.com',
                pathname: '/books/content/**',
            },
            {
                protocol: 'https',
                hostname: '**.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'github.io',
            }
        ],
        unoptimized: true,
    },
    trailingSlash: true,
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
    basePath: process.env.NODE_ENV === 'production' ? '/NextRead' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/NextRead/' : '',
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig; 