import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPosts(): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getCollection('posts');
  return allPosts;
}

export async function getSortedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const allPosts = await getPosts();

  return [...allPosts].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

export async function getSortedPostsPrefixed(): Promise<CollectionEntry<'posts'>[]> {
  const sortedPosts = await getSortedPosts();

  if (sortedPosts.length === 0) {
    return [];
  }

  const clonedPosts = [...sortedPosts];
  const firstPost = clonedPosts[0];
  const title = firstPost.data.title;
  const prefixedTitle = title.startsWith('Nuevo: ')
    ? title
    : `Nuevo: ${title}`;

  clonedPosts[0] = {
    ...firstPost,
    data: {
      ...firstPost.data,
      title: prefixedTitle,
    },
  };

  return clonedPosts;
}

export async function getNewPost(): Promise<CollectionEntry<'posts'> | null> {
  const sortedPosts = await getSortedPostsPrefixed();

  if (sortedPosts.length > 0) {
    return sortedPosts[0];
  }

  return null;
}
