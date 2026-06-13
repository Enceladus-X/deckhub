/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/deckhub" : undefined,
  assetPrefix: isGitHubPages ? "/deckhub/" : undefined,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
