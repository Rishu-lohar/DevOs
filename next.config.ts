import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "DevHub-ops.preview.emergentagent.com",
    "DevHub-ops.cluster-6.preview.emergentcf.cloud",
  ],
};

export default nextConfig;
