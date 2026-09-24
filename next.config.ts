import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.zeptonow.com",
      },
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
    ],
  },
}

export default nextConfig
