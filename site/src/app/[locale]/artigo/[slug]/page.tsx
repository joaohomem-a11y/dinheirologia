import { getTranslations } from 'next-intl/server';
import { getArticleBySlug, getAllArticles, getAllSlugs } from '@/lib/articles';
import { notFound } from 'next/navigation';
import { CATEGORIES } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const slugs = getAllSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) return { title: 'Not Found' };

  return {
    title: `${article.title} | Dinheirologia`,
    description: article.excerpt,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      locale: locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US',
      siteName: 'Dinheirologia',
      images: article.image ? [{ url: article.image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
    alternates: {
      languages: {
        'pt-BR': `/artigo/${slug}`,
        'en': `/en/artigo/${slug}`,
        'es': `/es/artigo/${slug}`,
      },
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: 'article' });

  if (!article) notFound();

  const categoryLabel = CATEGORIES[article.category]?.[locale as 'pt' | 'en' | 'es'] || article.category;

  const allArticles = await getAllArticles(locale);
  const related = allArticles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  const formattedDate = new Date(article.date).toLocaleDateString(
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.image || '',
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dinheirologia',
      logo: { '@type': 'ImageObject', url: '/images/logo.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://dinheirologia.com/${locale}/artigo/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-article mx-auto px-4 py-8">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-4">
          <span className="tag-pill">{categoryLabel}</span>
          <time className="font-sans text-caption text-navy-400 capitalize">{formattedDate}</time>
        </div>

        {/* Title */}
        <h1 className="font-serif text-headline-xl text-navy-900 mb-4 leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="font-serif text-headline-sm text-navy-500 italic mb-6">
            {article.subtitle}
          </p>
        )}

        {/* Author & Read time */}
        <div className="flex items-center gap-4 pb-6 mb-8 border-b border-rule-gray">
          <div>
            <p className="font-sans text-body-sm font-semibold text-navy-800">{article.author}</p>
            <p className="font-sans text-caption text-navy-400">
              {article.readTime} min {locale === 'pt' ? 'de leitura' : locale === 'en' ? 'read' : 'de lectura'}
            </p>
          </div>
        </div>

        {/* Featured Image */}
        {article.image && (
          <figure className="mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full rounded-sm"
            />
            {article.imageCaption && (
              <figcaption className="font-sans text-caption text-navy-400 mt-2 italic">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Body */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-rule-gray">
            <h3 className="font-sans text-caption uppercase tracking-wider text-navy-400 mb-3">
              {t('tags')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-cream-100 border-l-3 border-gold">
          <p className="font-sans text-caption text-navy-500 italic">
            {t('disclaimer')}
          </p>
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="max-w-content mx-auto px-4 py-8 border-t-3 border-navy-900">
          <div className="section-header">
            <h2>{t('relatedArticles')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="standard" />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
