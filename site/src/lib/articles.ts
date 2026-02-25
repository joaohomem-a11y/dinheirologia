import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { Article } from '@/types/article';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/artigos');

function getArticlesDir(locale: string): string {
  if (locale === 'pt') return CONTENT_DIR;
  return path.join(CONTENT_DIR, locale);
}

export async function getArticleBySlug(slug: string, locale: string = 'pt'): Promise<Article | null> {
  const dir = getArticlesDir(locale);
  const filePath = path.join(dir, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  const wordCount = content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    slug,
    title: data.title || '',
    subtitle: data.subtitle || '',
    excerpt: data.excerpt || content.slice(0, 200).replace(/[#*\n]/g, '').trim() + '...',
    content: contentHtml,
    date: data.date || new Date().toISOString(),
    author: data.author || 'Dinheirologia',
    authorSlug: data.authorSlug || 'dinheirologia',
    category: data.category || 'opiniao',
    tags: data.tags || [],
    image: data.image || null,
    imageCaption: data.imageCaption || null,
    readTime,
    featured: data.featured || false,
    locale,
  };
}

export async function getAllArticles(locale: string = 'pt'): Promise<Article[]> {
  const dir = getArticlesDir(locale);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const articles = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.md$/, '');
      return getArticleBySlug(slug, locale);
    })
  );

  return articles
    .filter((a): a is Article => a !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getArticlesByCategory(category: string, locale: string = 'pt'): Promise<Article[]> {
  const articles = await getAllArticles(locale);
  return articles.filter((a) => a.category === category);
}

export async function getFeaturedArticles(locale: string = 'pt'): Promise<Article[]> {
  const articles = await getAllArticles(locale);
  return articles.filter((a) => a.featured).slice(0, 5);
}

export function getAllSlugs(locale: string = 'pt'): string[] {
  const dir = getArticlesDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}
