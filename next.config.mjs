/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
<<<<<<< HEAD
    // serverExternalPackages: ["@prisma/client"],
=======
    serverExternalPackages: ["@prisma/client"], // Moved from experimental
>>>>>>> 12ee0f2f7e50d722364be51ee7dee69ba63f87e5
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,

  i18n: {
    locales: ["en", "de", "es", "tr", "ar", "fa"], // Supported languages
    defaultLocale: "fa", // Default language
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ybkqlbrfanevwwmeykpr.supabase.co",
        port: "",
        // pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  runtime: "nodejs",
};

export default nextConfig;
