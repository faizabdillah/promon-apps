import type { NextConfig } from "next";
import "./src/env"; // Validate env vars on import

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    BACKEND_DOMAIN: process.env.BACKEND_DOMAIN,
    SSL: process.env.SSL,
  },
};

export default nextConfig;
