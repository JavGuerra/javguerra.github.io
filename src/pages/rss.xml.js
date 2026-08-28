import siteConfig from '@/siteConfig.json';
import rss from '@astrojs/rss';
import { getSortedPosts } from '@/scripts/postsUtils';
import { getImage } from 'astro:assets';
import { getPostSlug } from '@/scripts/urlUtils';

export async function GET(context) {
  const allPosts = await getSortedPosts();

  const items = await Promise.all(
    allPosts.map(async (post) => {
      let imageUrl;

      if (post.data.coverImage) {
        const processedImage = await getImage({
          src: post.data.coverImage.image,
          width: post.data.coverImage.image.width,
          height: post.data.coverImage.image.height,
        });

        imageUrl = new URL(processedImage.src, context.site).toString();
      }

      return {
        link: `${context.site}blog/${getPostSlug(post)}`,
        title: post.data.title,
        description: post.data.description,
        author: post.data.author || siteConfig.autor,
        pubDate: post.data.pubDate,
        ...(imageUrl && {
          customData: `<enclosure url="${imageUrl}" />`,
        }),
        categories: post.data.tags,
      };
    })
  );

  return rss({
    title: `${siteConfig.title} | Blog`,
    description: siteConfig.description,
    site: context.site,
    items,
  });
}
