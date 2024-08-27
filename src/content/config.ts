import { z, defineCollection, type SchemaContext } from 'astro:content';
import { rssSchema } from '@astrojs/rss';

const extendedRssCollection = defineCollection({
  type: 'content',
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
