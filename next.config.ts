import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isExport = process.env.GITHUB_PAGES === "true" || process.env.EXPORT === "true";

/** Old WordPress URLs → new structure (301, per migration brief). */
const legacy: [string, string][] = [
  ["/cones", "/collection/cones"],
  ["/stick", "/collection/sticks"],
  ["/cups", "/collection/cups"],
  ["/biscuit", "/collection/biscuit"],
  ["/cassatta", "/collection/cassatta"],
  ["/tubs", "/collection/tubs"],
  ["/about", "/our-story"],
  ["/contact-us", "/contact"],
  ["/blogs", "/recipes"],
];

const nextConfig: NextConfig = {
  output: isExport ? "export" : undefined,
  basePath: isExport ? "/dairy-clasic" : undefined,
  assetPrefix: isExport ? "/dairy-clasic" : undefined,
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    unoptimized: isExport,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 828, 1080, 1440, 1920],
    imageSizes: [48, 96, 160, 256, 384, 512],
  },
  ...(isExport
    ? {}
    : {
        cacheComponents: true,
        partialPrefetching: true,
        async redirects() {
          return legacy.flatMap(([from, to]) => [
            { source: `${from}/`, destination: `${to}/`, statusCode: 301 },
            { source: from, destination: `${to}/`, statusCode: 301 },
          ]);
        },
      }),
};

export default withNextIntl(nextConfig);
