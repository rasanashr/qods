import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // اجازه دسترسی از دامنه‌های preview دیپلوی
  allowedDevOrigins: [
    "*.space-z.ai",
    "*.aliyuncs.com",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
