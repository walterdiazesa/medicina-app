/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.dicebear.com",
      "medicina-app.vercel.app",
      "public-files.s3.filebase.com",
    ],
  },
};

module.exports = nextConfig;
