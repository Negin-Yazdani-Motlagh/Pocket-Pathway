import type { NextConfig } from "next";

// Deploy V2 via GitHub Pages at /Pocket-Pathway
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Pocket-Pathway",
  assetPrefix: "/Pocket-Pathway/",
  trailingSlash: true,
};

export default nextConfig;
