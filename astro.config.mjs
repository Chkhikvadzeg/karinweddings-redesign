// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to GitHub Pages at username.github.io/<repo>/, so everything lives
// under a base path. Both values are env-overridable for a root deployment:
//   BASE_PATH=/ SITE_URL=https://example.com npm run build
const site = process.env.SITE_URL ?? 'https://chkhikvadzeg.github.io';
const base = process.env.BASE_PATH ?? '/karinweddings-redesign/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  image: {
    // sharp at build time. The live site paints its best photography via CSS
    // background-image, which can never carry a srcset — a phone downloads the
    // same 756 KB desktop JPEG a 27" monitor gets. Everything here is a real
    // <img> so responsive variants are possible at all.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
