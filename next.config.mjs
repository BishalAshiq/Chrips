/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export in Next.js 15+
  trailingSlash: true, // Optional, but improves static export behavior
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    unoptimized: true // Required for static export if using Next.js Images
  },
  env: {
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_SPS_SERVICE_URL: process.env.NEXT_PUBLIC_SPS_SERVICE_URL,
    NEXT_PUBLIC_PROFILE_URL: process.env.NEXT_PUBLIC_PROFILE_URL,
  },
  // Ensure all routes are pre-rendered at build time
  generateStaticParams: async () => {
    return [];
  },
  // Removed rewrites configuration since it's not compatible with static export
};

export default nextConfig;
