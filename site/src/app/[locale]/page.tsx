import { getTranslations } from 'next-intl/server';
import { getAllArticles, getFeaturedArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';
import { Link } from '@/i18n/navigation';
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

  // Separate articles from news
  const artigos = articles.filter((a) => a.contentType === 'artigo');
  const noticias = articles.filter((a) => a.contentType === 'noticia');

  const mainFeatured = featured[0] || artigos[0];
  const sideFeatured = (featured.length > 1 ? featured.slice(1, 4) : artigos.slice(1, 4));
  const restArtigos = artigos.filter(
    (a) => a.slug !== mainFeatured?.slug && !sideFeatured.some((sf) => sf.slug === a.slug)
  );

  const labels = {
    artigos: { pt: 'Artigos', en: 'Articles', es: 'Articulos' },
    noticias: { pt: 'Noticias', en: 'News', es: 'Noticias' },
    opiniao: { pt: 'Opiniao & Analise', en: 'Opinion & Analysis', es: 'Opinion & Analisis' },
    maisArtigos: { pt: 'Mais Artigos', en: 'More Articles', es: 'Mas Articulos' },
    emBreve: {
      pt: 'Em breve: nosso agente esta vasculhando o mundo em busca das noticias mais quentes do mercado financeiro. Volte em breve!',
      en: 'Coming soon: our agent is scouring the world for the hottest financial market news. Check back soon!',
      es: 'Proximamente: nuestro agente esta rastreando el mundo en busca de las noticias mas calientes del mercado financiero. Vuelve pronto!',
    },
  };

  return (
    <div className="max-w-content mx-auto px-4">

      {/* ===== HERO SECTION: FEATURED ARTICLE ===== */}
      {mainFeatured && !cat && (
        <section className="py-6 border-b-3 border-dollar-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Main Story */}
            <div className="lg:col-span-8 lg:pr-8 lg:border-r lg:border-rule-gray">
              <ArticleCard article={mainFeatured} variant="featured" />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 lg:pl-8 mt-6 lg:mt-0">
              <span className="font-sans text-caption uppercase tracking-[0.2em] font-bold text-dollar-600 border-b-2 border-dollar-500 pb-1 inline-block mb-4">
                {t('trending')}
              </span>
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

      {/* ===== NOTICIAS SECTION ===== */}
      <section className="py-8 border-b border-rule-gray">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-dollar-700" />
          <h2 className="text-headline-sm font-serif uppercase tracking-wider text-dollar-800 whitespace-nowrap flex items-center gap-2">
            <span className="text-xl">📰</span> {labels.noticias[locale as keyof typeof labels.noticias] || labels.noticias.pt}
          </h2>
          <div className="flex-1 h-px bg-dollar-700" />
        </div>

        {noticias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {noticias.slice(0, 6).map((article, idx) => (
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
        ) : (
          <div className="text-center py-10 bg-cream-100/50 border border-dashed border-rule-gray">
            <p className="text-3xl mb-3">🤖📡</p>
            <p className="font-body text-body-md text-navy-500 italic max-w-lg mx-auto">
              {labels.emBreve[locale as keyof typeof labels.emBreve] || labels.emBreve.pt}
            </p>
          </div>
        )}
      </section>

      {/* ===== ARTIGOS SECTION ===== */}
      <section className="py-8 border-b border-rule-gray">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-dollar-700" />
          <h2 className="text-headline-sm font-serif uppercase tracking-wider text-dollar-800 whitespace-nowrap flex items-center gap-2">
            <span className="text-xl">✍️</span> {labels.artigos[locale as keyof typeof labels.artigos] || labels.artigos.pt}
          </h2>
          <div className="flex-1 h-px bg-dollar-700" />
        </div>

        {cat ? (
          /* Category filter mode */
          articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-headline-md text-navy-400 italic">
                {locale === 'pt' ? 'Nenhum artigo encontrado nesta categoria.' :
                 locale === 'en' ? 'No articles found in this category.' :
                 'No se encontraron articulos en esta categoria.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {articles.map((article, idx) => (
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
          )
        ) : (
          /* Default: show opinion/analysis articles in two columns, then rest */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-8">
              {restArtigos.slice(0, 4).map((article, idx) => (
                <div
                  key={article.slug}
                  className={`pb-5 mb-5 border-b border-cream-200 ${
                    idx % 2 === 0 ? 'lg:pr-8 lg:border-r lg:border-rule-gray' : 'lg:pl-8'
                  }`}
                >
                  <ArticleCard article={article} variant="standard" />
                </div>
              ))}
            </div>

            {restArtigos.length > 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
                {restArtigos.slice(4).map((article, idx) => (
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
          </>
        )}
      </section>
    </div>
  );
}
