'use client';

import { Link } from '@/i18n/navigation';
import type { Article } from '@/types/article';
import { CATEGORIES } from '@/types/article';
import { useLocale } from 'next-intl';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'compact' | 'headline' | 'bullet';
}

export default function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  const locale = useLocale() as 'pt' | 'en' | 'es';
  const categoryLabel = CATEGORIES[article.category]?.[locale] || article.category;

  const formattedDate = new Date(article.date).toLocaleDateString(
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  if (variant === 'bullet') {
    return (
      <li className="group">
        <Link href={`/artigo/${article.slug}`} className="flex items-start gap-2">
          <span className="text-dollar-600 font-bold mt-0.5 flex-shrink-0">&#x2022;</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-body-md text-navy-900 group-hover:text-dollar-700 leading-snug transition-colors line-clamp-2">
              {article.title}
            </h3>
            <span className="font-sans text-caption uppercase tracking-wider text-navy-400 mt-0.5 block">
              {categoryLabel}
            </span>
          </div>
        </Link>
      </li>
    );
  }

  if (variant === 'headline') {
    return (
      <article className="py-3 border-b border-rule-gray">
        <Link href={`/artigo/${article.slug}`} className="flex gap-3 items-center group">
          {article.image && (
            <img
              src={article.image}
              alt=""
              className="w-[72px] h-[48px] object-cover flex-shrink-0 rounded-sm grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-body-md text-navy-900 group-hover:text-dollar-700 leading-snug transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-sans text-caption uppercase tracking-wider text-dollar-600">
                {categoryLabel}
              </span>
              <span className="text-navy-300">·</span>
              <time className="font-sans text-caption text-navy-400">
                {formattedDate}
              </time>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="article-card group p-4">
        <Link href={`/artigo/${article.slug}`} className="block">
          {article.image && (
            <div className="relative overflow-hidden mb-4">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-[400px] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              />
              {article.imageCaption && (
                <p className="absolute bottom-0 left-0 right-0 bg-navy-900/80 text-cream-200 text-caption px-3 py-1 font-sans">
                  {article.imageCaption}
                </p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <span className="tag-pill">{categoryLabel}</span>
            <h2 className="font-serif text-headline-lg text-navy-900 group-hover:text-navy-700 transition-colors leading-tight">
              {article.title}
            </h2>
            {article.subtitle && (
              <p className="font-serif text-headline-sm text-navy-500 italic">
                {article.subtitle}
              </p>
            )}
            <p className="font-body text-body-md text-navy-600 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-caption font-sans text-navy-400">
              <span className="font-medium text-navy-600">{article.author}</span>
              <span>·</span>
              <time>{formattedDate}</time>
              <span>·</span>
              <span>{article.readTime} min</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="article-card group p-3">
        <Link href={`/artigo/${article.slug}`} className="flex gap-4 items-start">
          <div className="flex-1 min-w-0">
            <span className="font-sans text-caption uppercase tracking-wider text-dollar-600">
              {categoryLabel}
            </span>
            <h3 className="font-serif text-headline-sm text-navy-900 group-hover:text-navy-700 transition-colors mt-1 line-clamp-2">
              {article.title}
            </h3>
            <div className="flex items-center gap-2 text-caption font-sans text-navy-400 mt-1">
              <span>{article.author}</span>
              <span>·</span>
              <span>{article.readTime} min</span>
            </div>
          </div>
          {article.image && (
            <img
              src={article.image}
              alt=""
              className="w-20 h-20 object-cover flex-shrink-0 grayscale-[30%]"
            />
          )}
        </Link>
      </article>
    );
  }

  // Standard variant
  return (
    <article className="article-card group p-4">
      <Link href={`/artigo/${article.slug}`} className="block">
        {article.image && (
          <div className="overflow-hidden mb-3">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
        )}
        <span className="tag-pill mb-2 inline-block">{categoryLabel}</span>
        <h3 className="font-serif text-headline-sm text-navy-900 group-hover:text-navy-700 transition-colors mt-2 mb-2">
          {article.title}
        </h3>
        <p className="font-body text-body-sm text-navy-600 line-clamp-2 mb-2">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-2 text-caption font-sans text-navy-400">
          <span className="font-medium text-navy-600">{article.author}</span>
          <span>·</span>
          <time>{formattedDate}</time>
        </div>
      </Link>
    </article>
  );
}
