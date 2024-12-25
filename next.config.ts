import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',

};

// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
