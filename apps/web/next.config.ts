import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
  },
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
