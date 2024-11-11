/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'example.com',
            },
            {
                hostname: 'i.etsystatic.com',
            },
            {
                hostname: 'm.media-amazon.com',
            },
            {
                hostname: 'encrypted-tbn0.gstatic.com',
            },
            {
                hostname: 'utfs.io',
            },
            {
                hostname: 'www.mtours.gr'
            }
        ]
    }
};

export default nextConfig;
