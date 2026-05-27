import type { NextConfig } from "next";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["31.220.79.31"],
  async rewrites() {
    return [
      { source: "/api/benchmark/:path*", destination: `${BACKEND}/api/benchmark/:path*` },
      { source: "/api/agora/:path*", destination: `${BACKEND}/api/agora/:path*` },
      { source: "/api/game/:path*", destination: `${BACKEND}/api/game/:path*` },
    ];
  },
};

export default nextConfig;
