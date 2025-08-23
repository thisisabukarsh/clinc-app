import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "threeiadti-be.onrender.com",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
    // Add fallback for broken images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
