import { defineCollection, type SchemaContext } from 'astro:content';
import { z } from 'zod';
import { rssSchema } from '@astrojs/rss';
import { glob } from 'astro/loaders';

const extendedRssCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }: SchemaContext) =>
    rssSchema.extend({
      route: z.string().optional(),
      info: z.string().optional(),
      author: z.string().optional(),
      coverImage: z.object({
        image: image(),
        alt: z.string(),
      }).optional(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { posts: extendedRssCollection };