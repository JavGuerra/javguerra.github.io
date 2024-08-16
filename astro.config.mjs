import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: "https://javguerra.github.io",
  redirects: {'/blog/': '/blog/1'},
  prefetch: {defaultStrategy: 'tap'},
});
