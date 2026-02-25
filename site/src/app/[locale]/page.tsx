import { getTranslations } from 'next-intl/server';
import { getAllArticles, getFeaturedArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US',
      siteName: 'Dinheirologia',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      languages: {
        'pt-BR': '/',
        'en': '/en',
        'es': '/es',
      },
    },
  };
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { cat } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'home' });

  let articles = await getAllArticles(locale);
  const featured = await getFeaturedArticles(locale);

  if (cat) {
    articles = articles.filter((a) => a.category === cat);
  }

  const mainFeatured = featured[0] || articles[0];
  const sideFeatured = (featured.length > 1 ? featured.slice(1, 3) : articles.slice(1, 3));
  const restArticles = articles.filter(
    (a) => a.slug !== mainFeatured?.slug && !sideFeatured.some((sf) => sf.slug === a.slug)
  );

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      {/* Featured Section */}
      {mainFeatured && (
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main featured article */}
            <div className="lg:col-span-2 lg:border-r lg:border-rule-gray lg:pr-8">
              <ArticleCard article={mainFeatured} variant="featured" />
            </div>

            {/* Side featured */}
            <div className="space-y-6">
              <h2 className="font-sans text-caption uppercase tracking-[0.2em] text-navy-500 border-b-2 border-navy-900 pb-2">
                {t('trending')}
              </h2>
              {sideFeatured.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="border-t-3 border-navy-900 mb-8" />

      {/* Latest Articles */}
      <section>
        <div className="section-header">
          <h2>{cat ? (articles[0]?.category || t('latest')) : t('latest')}</h2>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif text-headline-md text-navy-400 italic">
              {locale === 'pt' ? 'Nenhum artigo encontrado. O mercado está quieto hoje...' :
               locale === 'en' ? 'No articles found. The market is quiet today...' :
               'No se encontraron artículos. El mercado está tranquilo hoy...'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {restArticles.map((article) => (
              <div key={article.slug} className="border-b border-cream-200 pb-6">
                <ArticleCard article={article} variant="standard" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
