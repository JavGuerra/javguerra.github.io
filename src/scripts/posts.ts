import { getCollection } from 'astro:content';

export async function getPosts() {
  const allPosts: Record<string, any>[] = await getCollection('posts');
  return allPosts;
}

export async function getSortedPosts() {
  const allPosts: Record<string, any>[] = await getPosts();
  let sortedPosts;

  if (allPosts.length) {
    sortedPosts = allPosts.sort(
      (a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
    );

    const title = sortedPosts[0].data.title;
    const prefixedTitle = title.startsWith("Nuevo: ") ? title : `Nuevo: ${title}`;
    sortedPosts[0].data.title = prefixedTitle;
  }

  return sortedPosts;
}