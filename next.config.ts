import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "devos-ops.preview.emergentagent.com",
    "devos-ops.cluster-6.preview.emergentcf.cloud",
  ],
};

export default nextConfig;
