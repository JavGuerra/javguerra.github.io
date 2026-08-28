import type { CollectionEntry } from 'astro:content';

export function getPostSlug(post: CollectionEntry<'posts'>): string {
  if (post.data.route) return post.data.route;

  const cleanUrl = post.id.replace(/\/$/, '').split('?')[0].split('#')[0];
  const lastPart = cleanUrl.split('/').pop() ?? '';

  return lastPart.split('.')[0];
}