import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@superlend/react-sdk", "@superlend/sdk"],
};

export default nextConfig;
