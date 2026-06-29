import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/products/lxmstr",
        destination: "/products/lxmaster",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
