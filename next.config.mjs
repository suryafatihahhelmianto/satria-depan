// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import dotenv from "dotenv";
import withPWA from "next-pwa";

dotenv.config({
  path: process.env.APP_ENV === "demo" ? ".env.demo" : ".env.production",
});

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
