import { defineCollection, type SchemaContext } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/posts',
  }),

  schema: ({ image }: SchemaContext) =>
    z.object({
      route: z.string().optional(),

      title: z.string(),
      description: z.string(),

      author: z.string(),

      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      coverImage: z.object({
        image: image(),
        alt: z.string(),
      }),

      tags: z.array(
        z.string()
          .trim()
          .toLowerCase()
      ).default([]),

      info: z.string().optional(),
    }),
});

export const collections = {
  posts,
};
