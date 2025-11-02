import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  typedRoutes: true,

  experimental: {
    authInterrupts: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c5a4npv9he.ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
