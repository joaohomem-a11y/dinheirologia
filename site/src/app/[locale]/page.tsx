import { getTranslations } from 'next-intl/server';
import { getAllArticles, getFeaturedArticles, getArticlesByCategory } from '@/lib/articles';
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
  const sideFeatured = (featured.length > 1 ? featured.slice(1, 4) : articles.slice(1, 4));
  const restArticles = articles.filter(
    (a) => a.slug !== mainFeatured?.slug && !sideFeatured.some((sf) => sf.slug === a.slug)
  );

  // Split remaining articles into sections
  const opiniao = restArticles.filter((a) => a.category === 'opiniao' || a.category === 'investimentos').slice(0, 3);
  const mercados = restArticles.filter((a) => a.category === 'mercados' || a.category === 'trading').slice(0, 3);
  const remaining = restArticles.filter(
    (a) => !opiniao.some((o) => o.slug === a.slug) && !mercados.some((m) => m.slug === a.slug)
  );

  const sectionLabels: Record<string, Record<string, string>> = {
    opiniao: { pt: 'Opiniao', en: 'Opinion', es: 'Opinion' },
    mercados: { pt: 'Mercados', en: 'Markets', es: 'Mercados' },
  };

  return (
    <div className="max-w-content mx-auto px-4">
      {/* ===== MAIN HERO SECTION ===== */}
      {mainFeatured && (
        <section className="py-6 border-b-3 border-navy-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Main Story - takes 8 columns */}
            <div className="lg:col-span-8 lg:pr-8 lg:border-r lg:border-rule-gray">
              <ArticleCard article={mainFeatured} variant="featured" />
            </div>

            {/* Sidebar Stories - takes 4 columns */}
            <div className="lg:col-span-4 lg:pl-8 mt-6 lg:mt-0">
              <div className="section-label">
                {t('trending')}
              </div>
              <div className="space-y-0">
                {sideFeatured.map((article, idx) => (
                  <div key={article.slug} className={idx < sideFeatured.length - 1 ? 'border-b border-rule-gray pb-4 mb-4' : ''}>
                    <ArticleCard article={article} variant="compact" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== MIDDLE SECTIONS: OPINIÃO + MERCADOS ===== */}
      <section className="py-8 border-b border-rule-gray">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Opinião / Investimentos column */}
          <div className="lg:pr-8 lg:border-r lg:border-rule-gray mb-8 lg:mb-0">
            <div className="section-label">
              {sectionLabels.opiniao[locale] || 'Opiniao'}
            </div>
            {opiniao.length > 0 ? (
              <div className="space-y-0">
                {opiniao.map((article, idx) => (
                  <div key={article.slug} className={idx < opiniao.length - 1 ? 'border-b border-cream-200 pb-5 mb-5' : ''}>
                    <ArticleCard article={article} variant="standard" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-serif text-body-md text-navy-400 italic">
                {locale === 'pt' ? 'Em breve mais opinioes...' : locale === 'en' ? 'More opinions coming soon...' : 'Mas opiniones pronto...'}
              </p>
            )}
          </div>

          {/* Mercados / Trading column */}
          <div className="lg:pl-8">
            <div className="section-label">
              {sectionLabels.mercados[locale] || 'Mercados'}
            </div>
            {mercados.length > 0 ? (
              <div className="space-y-0">
                {mercados.map((article, idx) => (
                  <div key={article.slug} className={idx < mercados.length - 1 ? 'border-b border-cream-200 pb-5 mb-5' : ''}>
                    <ArticleCard article={article} variant="standard" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-serif text-body-md text-navy-400 italic">
                {locale === 'pt' ? 'O mercado esta quieto hoje...' : locale === 'en' ? 'Markets are quiet today...' : 'El mercado esta tranquilo hoy...'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ===== ALL ARTICLES GRID ===== */}
      <section className="py-8">
        <div className="section-header">
          <h2>{cat ? (articles[0]?.category || t('latest')) : t('latest')}</h2>
        </div>

        {remaining.length === 0 && !cat ? (
          <div className="text-center py-16">
            <p className="font-serif text-headline-md text-navy-400 italic">
              {locale === 'pt' ? 'Nenhum artigo encontrado. O mercado esta quieto hoje...' :
               locale === 'en' ? 'No articles found. The market is quiet today...' :
               'No se encontraron articulos. El mercado esta tranquilo hoy...'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {(cat ? articles : remaining).map((article, idx) => (
              <div
                key={article.slug}
                className={`pb-6 mb-6 border-b border-cream-200 ${
                  idx % 3 !== 2 ? 'lg:pr-8 lg:border-r lg:border-rule-gray' : ''
                } ${idx % 3 === 1 ? 'lg:px-8' : ''} ${idx % 3 === 2 ? 'lg:pl-8' : ''}`}
              >
                <ArticleCard article={article} variant="standard" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
