import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "proctor-module.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    qualities: [50, 80, 100],
  },
};

export default nextConfig;
