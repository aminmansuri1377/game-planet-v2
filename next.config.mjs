/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverExternalPackages: ["@prisma/client"],
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
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_ADMINPASS: process.env.NEXT_PUBLIC_ADMINPASS,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
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
  webpack: (config) => {
    config.externals.push("@prisma/client");
    return config;
  },
  // runtime: "nodejs",
};

export default nextConfig;
