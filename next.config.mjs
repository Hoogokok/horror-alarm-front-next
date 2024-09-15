/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.POSTER_HOSTNAME, process.env.NEXT_PUBLIC_SUPABASE_NOTHOST],
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
        ],
    },
    experimental: {
        ppr: 'incremental'
    },
};

export default nextConfig;
