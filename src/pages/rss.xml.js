import siteConfig from '@/siteConfig.json';

import rss from '@astrojs/rss';

import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import { getSlugName } from '@/scripts/urlUtils';


export async function GET(context) {
  const posts = await getCollection('posts');

  const items = await Promise.all(posts.map(async (post) => {
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
      link: `${context.site}blog/${post.data.route || getSlugName(post.slug)}`,
      title: post.data.title,
      description: post.data.description,
      author: post.data.author || siteConfig.default.autor,
      pubDate: post.data.pubDate,
      // Añadir la URL de la imagen al ítem RSS si existe
      ...(imageUrl && { customData: `<enclosure url="${imageUrl}" />` }),
      categories: post.data.tags || [],
    };
  }));

  return rss({
    title: `${siteConfig.default.title} | Blog`,
    description: siteConfig.default.description,
    site: context.site,
    items,
  });
}
