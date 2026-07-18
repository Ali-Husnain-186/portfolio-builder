import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow avatar (2MB) + CV (5MB) + form fields
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
