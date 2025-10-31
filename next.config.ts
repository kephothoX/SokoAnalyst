import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Optimize for production deployment
  experimental: {
    optimizePackageImports: ["@mastra/core", "@mastra/client-js"],
  },

  // Configure for SokoAnalyst
  env: {
    NEXT_PUBLIC_APP_NAME: "SokoAnalyst",
    NEXT_PUBLIC_APP_VERSION: "1.0.0",
  },

  // Configure headers for API routes
  async headers() {
    return [
      {
        source: "/api/soko/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  // Optimize images and assets
  images: {
    unoptimized: true, // For better Docker compatibility
  },

  // Configure Turbopack (Next.js 16 default)
  turbopack: {
    // Empty config to silence the warning
  },
};

export default nextConfig;
