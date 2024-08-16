import { z, defineCollection, type SchemaContext } from 'astro:content';
import { rssSchema } from '@astrojs/rss';

const extendedRssCollection = defineCollection({
  type: 'content',
  schema: ({ image }: SchemaContext) =>
    rssSchema.extend({
      coverImage: z
        .object({
          image: image(),
          alt: z.string(),
        })
        .optional(),
      route: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { posts: extendedRssCollection };
