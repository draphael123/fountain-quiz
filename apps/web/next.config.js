/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@fountain-quiz/db', '@fountain-quiz/shared'],
};

module.exports = nextConfig;

