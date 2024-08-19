import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: "https://javguerra.github.io",
  redirects: {
    '/blog/': '/blog/1'
  },
  prefetch: {
    defaultStrategy: 'tap'
  }
});