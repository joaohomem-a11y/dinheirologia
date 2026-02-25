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

  // Featured selections
  const featuredNoticia = noticias.find((a) => a.featured) || noticias[0];
  const featuredArtigo = featured.find((a) => a.contentType === 'artigo') || artigos[0];
  const restNoticias = noticias.filter((a) => a.slug !== featuredNoticia?.slug);
  const restArtigos = artigos.filter((a) => a.slug !== featuredArtigo?.slug);

  // Lead story: best featured item overall
  const leadStory = featuredNoticia || featuredArtigo;

  // Headlines for center column (mix of remaining noticias + artigos)
  const headlines = [...restNoticias, ...restArtigos].slice(0, 6);

  // "Most Read" sidebar - interleave noticias and artigos
  const mostRead: typeof articles = [];
  const noticiasPool = [...noticias];
  const artigosPool = [...artigos];
  while (mostRead.length < 7 && (noticiasPool.length > 0 || artigosPool.length > 0)) {
    if (noticiasPool.length > 0) mostRead.push(noticiasPool.shift()!);
    if (mostRead.length < 7 && artigosPool.length > 0) mostRead.push(artigosPool.shift()!);
  }

  // Opinion & Analysis section
  const opinionArticles = restArtigos.slice(0, 4);

  const labels = {
    noticias: { pt: 'Ultimas Noticias', en: 'Latest News', es: 'Ultimas Noticias' },
    maisLidos: { pt: 'Mais Lidos', en: 'Most Read', es: 'Mas Leidos' },
    opiniao: { pt: 'Opiniao & Analise', en: 'Opinion & Analysis', es: 'Opinion & Analisis' },
    emBreve: {
      pt: 'Em breve: nosso agente esta vasculhando o mundo em busca das noticias mais quentes do mercado financeiro. Volte em breve!',
      en: 'Coming soon: our agent is scouring the world for the hottest financial market news. Check back soon!',
      es: 'Proximamente: nuestro agente esta rastreando el mundo en busca de las noticias mas calientes del mercado financiero. Vuelve pronto!',
    },
  };

  // Category filter mode
  if (cat) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif text-headline-md text-navy-400 italic">
              {locale === 'pt' ? 'Nenhum artigo encontrado nesta categoria.' :
               locale === 'en' ? 'No articles found in this category.' :
               'No se encontraron articulos en esta categoria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="standard" />
            ))}
          </div>
        )}
      </div>
    );
  }

  // No content at all
  if (articles.length === 0) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="text-center py-16 border border-dashed border-rule-gray">
          <p className="font-body text-body-md text-navy-500 italic max-w-lg mx-auto">
            {labels.emBreve[locale as keyof typeof labels.emBreve] || labels.emBreve.pt}
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = (date: string) =>
    new Date(date).toLocaleDateString(
      locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );

  return (
    <div className="max-w-content mx-auto px-4 py-6">

      {/* ===== MAIN 3-COLUMN GRID (WSJ STYLE) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

        {/* ===== LEFT: LEAD STORY (col 1-5) ===== */}
        <div className="lg:col-span-5 lg:pr-6 lg:border-r lg:border-rule-gray pb-6 lg:pb-0">
          {leadStory && (
            <article className="group">
              <Link href={`/artigo/${leadStory.slug}`} className="block">
                {leadStory.image && (
                  <div className="relative overflow-hidden mb-4">
                    <img
                      src={leadStory.image}
                      alt={leadStory.title}
                      className="w-full h-[340px] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}
                <h2 className="font-serif text-headline-xl text-navy-900 group-hover:text-navy-700 transition-colors leading-tight mb-3">
                  {leadStory.title}
                </h2>
                {leadStory.subtitle && (
                  <p className="font-serif text-headline-sm text-navy-500 italic mb-3">
                    {leadStory.subtitle}
                  </p>
                )}
                <p className="font-body text-body-md text-navy-600 line-clamp-3 mb-3">
                  {leadStory.excerpt}
                </p>
                <div className="flex items-center gap-3 text-caption font-sans text-navy-400">
                  <span className="font-medium text-navy-600">{leadStory.author}</span>
                  <span>·</span>
                  <time>{formattedDate(leadStory.date)}</time>
                  <span>·</span>
                  <span>{leadStory.readTime} min</span>
                </div>
              </Link>
            </article>
          )}
        </div>

        {/* ===== CENTER: HEADLINES (col 6-9) ===== */}
        <div className="lg:col-span-4 lg:px-6 lg:border-r lg:border-rule-gray py-6 lg:py-0 border-t lg:border-t-0 border-rule-gray">
          <h3 className="font-sans text-body-sm uppercase tracking-[0.2em] font-bold text-navy-500 border-b-2 border-navy-800 pb-2 mb-2">
            {labels.noticias[locale as keyof typeof labels.noticias] || labels.noticias.pt}
          </h3>

          {headlines.length > 0 ? (
            <div>
              {headlines.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="headline" />
              ))}
            </div>
          ) : (
            <p className="font-body text-body-sm text-navy-400 italic py-4">
              {labels.emBreve[locale as keyof typeof labels.emBreve] || labels.emBreve.pt}
            </p>
          )}
        </div>

        {/* ===== RIGHT: MOST READ SIDEBAR (col 10-12) ===== */}
        <div className="lg:col-span-3 lg:pl-6 py-6 lg:py-0 border-t lg:border-t-0 border-rule-gray">
          <h3 className="font-sans text-body-sm uppercase tracking-[0.2em] font-bold text-navy-500 border-b-2 border-navy-800 pb-2 mb-2">
            {labels.maisLidos[locale as keyof typeof labels.maisLidos] || labels.maisLidos.pt}
          </h3>

          <ol className="numbered-list">
            {mostRead.map((article) => (
              <li key={article.slug}>
                <Link href={`/artigo/${article.slug}`} className="block group">
                  <h4 className="font-serif text-headline-sm text-navy-900 group-hover:text-dollar-700 leading-snug transition-colors">
                    {article.title}
                  </h4>
                  <span className="font-sans text-body-sm text-navy-400 mt-1 block">
                    {article.author}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

      </div>

      {/* ===== OPINION & ANALYSIS SECTION ===== */}
      {opinionArticles.length > 0 && (
        <section className="mt-8 pt-6 border-t-3 border-navy-800">
          <div className="section-header mb-6">
            <h2>
              {labels.opiniao[locale as keyof typeof labels.opiniao] || labels.opiniao.pt}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {opinionArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="standard" />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
