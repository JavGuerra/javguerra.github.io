import { defineCollection, type SchemaContext } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: '**/[!_]*.{md,mdx}',
    base: './src/content/posts',
  }),

  schema: ({ image }: SchemaContext) =>
    z.object({
      title: z.string(),
      description: z.string(),

      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      author: z.string().optional(),

      coverImage: z.object({
        image: image(),
        alt: z.string(),
      }).optional(),

      tags: z.array(
        z.string()
          .trim()
          .toLowerCase()
      ).default([]),

      route: z.string().optional(),
      info: z.string().optional(),
    }),
});

export const collections = {
  posts,
};
