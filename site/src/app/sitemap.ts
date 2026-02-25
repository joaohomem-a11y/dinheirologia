import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dinheirologia.com';
  const locales = ['pt', 'en', 'es'];

  const staticPages = ['', '/calendario', '/sobre'];
  const staticEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      const prefix = locale === 'pt' ? '' : `/${locale}`;
      staticEntries.push({
        url: `${baseUrl}${prefix}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'hourly' : 'daily',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  const articleEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    const slugs = getAllSlugs(locale);
    for (const slug of slugs) {
      const prefix = locale === 'pt' ? '' : `/${locale}`;
      articleEntries.push({
        url: `${baseUrl}${prefix}/artigo/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return [...staticEntries, ...articleEntries];
}
