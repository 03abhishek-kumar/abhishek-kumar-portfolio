import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tree-shake icon imports so only the icons used ship.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
