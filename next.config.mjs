/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.POSTER_HOSTNAME,
                port: '',
            },
        ],
    },
};

export default nextConfig;
