import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "https://helpdesk-api-v1.vercel.app"}/:path*`,
      },
    ]
  },
};

export default nextConfig;
