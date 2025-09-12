import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,

  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
