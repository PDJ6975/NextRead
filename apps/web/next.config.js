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
    output: 'export',
    basePath: '/NextRead_NOAI',
    assetPrefix: '/NextRead_NOAI/',
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig; 