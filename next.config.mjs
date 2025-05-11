/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  experimental: {
    serverActions: true,
    esmExternals: "loose",
    middlewarePrefetch: "flexible",
    fullyDynamic: true,
    serverComponentsExternalPackages: ["next-auth", "@trpc/server"],
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
      },
    ],
  },
  runtime: "nodejs",
};

export default nextConfig;
