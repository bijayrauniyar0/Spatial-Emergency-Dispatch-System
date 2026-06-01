import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://example.com/api/v,1";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // must match your URL scheme
        hostname: BASE_URL?.replace(/^https?:\/\//, ""),
        port: "", // optional
        pathname: "/**", // allow all paths
      },
    ],
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*/",
        destination: API_URL + "/:path*/",
      },
    ];
  },
};

export default nextConfig;
