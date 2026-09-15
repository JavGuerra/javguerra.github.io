import siteConfig from '@/siteConfig.json';
import rss from '@astrojs/rss';
import { getPosts } from '@/scripts/postsUtils';
import { getImage } from 'astro:assets';
import { getPostSlug } from '@/scripts/urlUtils';

export async function getStaticPaths() {
  const allPosts = await getPosts();

  const uniqueTags = [
    ...new Set(allPosts.flatMap((post) => post.data.tags || []))
  ];

  return uniqueTags.map((tag) => ({
    params: { tag },
  }));
}

export async function GET(context) {
  const { tag } = context.params;

  const allPosts = await getPosts();
  const posts = allPosts.filter(
    (post) => post.data.tags && post.data.tags.includes(tag)
  );

  const items = await Promise.all(
    posts.map(async (post) => {
      let imageUrl;

      if (post.data.coverImage) {
        const processedImage = await getImage({
          src: post.data.coverImage.image,
          width: post.data.coverImage.image.width,
          height: post.data.coverImage.image.height,
        });

        imageUrl = new URL(processedImage.src, context.site).toString();
      }

      // 1. Obtenemos el HTML base directamente del post
      const baseHtml = post.rendered?.html || post.body || '';

      // 2. Preparamos el HTML para la imagen de portada
      const coverHtml = imageUrl
        ? `<p><img src="${imageUrl}" alt="${post.data.coverImage?.alt || post.data.title}" style="max-width: 100%; height: auto;" /></p>`
        : '';

      // 3. Preparamos el HTML para las etiquetas
      const tagsHtml = post.data.tags && post.data.tags.length > 0
        ? `<p><strong>Etiquetas:</strong> ${post.data.tags.map((t) => `<em>#${t}</em>`).join(', ')}</p><hr />`
        : '';

      // 4. Unimos todo con la imagen y etiquetas al principio
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
    title: `${siteConfig.title} | Entradas sobre «${tag}»`,
    description: `Feed RSS de publicaciones etiquetadas con ${tag}`,
    site: context.site,
    items,
    xmlns: {
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
  });
}
