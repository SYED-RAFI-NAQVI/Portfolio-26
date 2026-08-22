import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Default is 14400 (4 hours), and that max-age is passed through to the
     * browser. The reel artwork in public/type, public/domain and public/skills
     * gets replaced in place under the same filenames, so the /_next/image URL
     * never changes and a stale copy is served for hours. Next has no cache
     * invalidation API — the docs say to change the src or delete the cache
     * directory — so the TTL stays short while this artwork is in flux.
     */
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
