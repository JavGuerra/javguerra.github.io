import { getCollection } from 'astro:content';

export async function getPosts() {
  const allPosts: Record<string, any>[] = await getCollection('posts');
  return allPosts;
}

export async function getSortedPosts() {
  const allPosts = await getPosts();
  let sortedPosts = null;

  if (allPosts) {
    sortedPosts = allPosts.sort(
      (a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
    );
  }

  return sortedPosts;
}

export async function getSortedPostsPrefixed() {
  const sortedPosts = await getSortedPosts();

  if (sortedPosts) {
    const title = sortedPosts[0].data.title;
    const prefixedTitle = title.startsWith("Nuevo: ") ? title : `Nuevo: ${title}`;
    sortedPosts[0].data.title = prefixedTitle;
  }

  return sortedPosts;
}

export async function getNewPost() {
  const sortedPosts = await getSortedPostsPrefixed();

  if (sortedPosts) return sortedPosts[0];
  return null;
}