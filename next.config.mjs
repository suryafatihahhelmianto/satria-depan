// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import withPWA from "next-pwa";

const nextConfig = withPWA({
  // PWA Config

  // pwa: {
  //   dest: "public",
  //   register: true,
  //   skipWaiting: true,
  //   disable: process.env.NODE_ENV === "development",
  //   buildExcludes: [/middleware-manifest\.json$/],
  // },
  dest: "public",
});

export default nextConfig;
