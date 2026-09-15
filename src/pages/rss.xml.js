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

      // 1. Obtenemos el HTML base que ya traía tu código
      const baseHtml = post.rendered?.html || post.body || '';

      // 2. Preparamos el HTML de la imagen de portada
      const coverHtml = imageUrl
        ? `<p><img src="${imageUrl}" alt="${post.data.coverImage?.alt || post.data.title}" style="max-width: 100%; height: auto;" /></p>`
        : '';

      // 3. Preparamos el HTML de las etiquetas
      const tagsHtml = post.data.tags && post.data.tags.length > 0
        ? `<p><strong>Etiquetas:</strong> ${post.data.tags.map((t) => `<em>#${t}</em>`).join(', ')}</p><hr />`
        : '';

      // 4. Unimos todo poniendo la imagen y las etiquetas al principio
      const fullHtml = `${coverHtml}${tagsHtml}${baseHtml}`;

      return {
        link: `${context.site}blog/${getPostSlug(post)}`,
        title: post.data.title,
        description: post.data.description,
        content: fullHtml,
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
    xmlns: {
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
  });
}
