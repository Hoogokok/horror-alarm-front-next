/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.POSTER_HOSTNAME, 
                port: '',
            },
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_SUPABASE_NOTHOST,
                port: '',
            },
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_FAANGORIA_NOTHOST,
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
                port: '',
            },
        ]
    },
    experimental: {
        ppr: 'incremental'
    },
};

export default nextConfig;
