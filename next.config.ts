import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DB_HOST: process.env.DB_HOST || '',
    DB_USER: process.env.DB_USER || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || ''
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
};

export default nextConfig;
