import { getCollection } from 'astro:content';
import { getPostSlug } from '@/scripts/urlUtils';

const postsPromise = getCollection('posts');

const sortedPostsPromise = postsPromise.then(posts => 
  posts.toSorted((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
);

export async function getPosts() {
  return await postsPromise;
}

export async function getSortedPosts() {
  return await sortedPostsPromise;
}

export async function getSortedPostsData(
    { includeFirstParagraph = true } = {}
) {
    const sortedPosts = await sortedPostsPromise;

    if (sortedPosts.length === 0) return [];

    return sortedPosts.map((post, index) => {
        const title = index === 0 && !post.data.title.startsWith('Nuevo: ')
            ? `Nuevo: ${post.data.title}`
            : post.data.title;

        return {
            frontmatter: {
                title,
                description: post.data.description,
                author: post.data.author,
                pubDate: post.data.pubDate,
                coverImage: post.data.coverImage,
            },
            href: getPostSlug(post),
            ...(includeFirstParagraph && {
                firstParagraph: post.body
                    ? post.body.split('\n\n')[0]
                        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.+?)\*/g, '<em>$1</em>')
                        .replace(/_(.+?)_/g, '<em>$1</em>')
                    : '',
            }),
        };
    });
}

export async function getNewPost() {
  const sortedPosts = await getSortedPostsData();

  return sortedPosts[0] ?? null;
}