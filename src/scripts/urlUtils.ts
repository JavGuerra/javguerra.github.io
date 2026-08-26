import type { CollectionEntry } from 'astro:content';

export function getSlugName(url: string): string {
  if (!url) return '';

  // Elimina la barra final si existe y elimina parámetros de búsqueda/anchors
  const cleanUrl = url.replace(/\/$/, '').split('?')[0].split('#')[0];
  const lastPart = cleanUrl.split('/').pop() ?? '';
  const nameParts = lastPart.split('.');

  return nameParts[0] ?? '';
}

export function getPostSlug(post: CollectionEntry<'posts'>): string {
  return post.data.route || getSlugName(post.id);
}

export function generateUniqueId(): string {
  return 'back-link-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}
