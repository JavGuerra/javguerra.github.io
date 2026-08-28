import { getCollection } from 'astro:content';

export async function getPosts() {
  return getCollection('posts');
}

export async function getSortedPosts() {
  const allPosts = await getPosts();

  return allPosts.toSorted(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

export async function getSortedPostsPrefixed() {
  const sortedPosts = await getSortedPosts();

  if (sortedPosts.length === 0) {
    return [];
  }

  const firstPost = sortedPosts[0];

  const title = firstPost.data.title;

  const prefixedTitle = title.startsWith('Nuevo: ')
    ? title
    : `Nuevo: ${title}`;

  const clonedPosts = [...sortedPosts];

  clonedPosts[0] = {
    ...firstPost,
    data: {
      ...firstPost.data,
      title: prefixedTitle,
    },
  };

  return clonedPosts;
}

export async function getNewPost() {
  const sortedPosts = await getSortedPostsPrefixed();

  return sortedPosts[0] ?? null;
}