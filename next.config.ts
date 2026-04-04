import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "divine-rejoicing-production.up.railway.app",
          },
        ],
        destination: "https://taxcalc.kr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
