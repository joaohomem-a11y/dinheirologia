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

  // Secondary stories below lead (fill the column)
  const leadExtras = [...restNoticias, ...restArtigos]
    .filter((a) => a.slug !== leadStory?.slug)
    .slice(0, 6);

  // Bullet headlines: remaining articles after lead + extras, sliced to 7
  const usedSlugs = new Set<string>();
  if (leadStory) usedSlugs.add(leadStory.slug);
  leadExtras.forEach((a) => usedSlugs.add(a.slug));

  const bulletHeadlines = [...restNoticias, ...restArtigos]
    .filter((a) => !usedSlugs.has(a.slug))
    .slice(0, 10);

  // Category-based arrays (exclude leadStory, sliced to 4)
  const allExceptLead = [...noticias, ...artigos].filter((a) => a.slug !== leadStory?.slug);
  const mercadosArticles = allExceptLead.filter((a) => a.category === 'mercados').slice(0, 4);
  const opiniaoArticles = allExceptLead.filter((a) => a.category === 'opiniao').slice(0, 4);
  const tradingArticles = allExceptLead.filter((a) => a.category === 'trading').slice(0, 4);
  const investimentosArticles = allExceptLead.filter((a) => a.category === 'investimentos').slice(0, 4);

  // "Most Read" sidebar - interleave noticias and artigos
  const mostRead: typeof articles = [];
  const noticiasPool = [...noticias];
  const artigosPool = [...artigos];
  while (mostRead.length < 7 && (noticiasPool.length > 0 || artigosPool.length > 0)) {
    if (noticiasPool.length > 0) mostRead.push(noticiasPool.shift()!);
    if (mostRead.length < 7 && artigosPool.length > 0) mostRead.push(artigosPool.shift()!);
  }

  const labels: Record<string, Record<string, string>> = {
    whatsNews: { pt: 'O Que E Noticia', en: "What's News", es: 'Que Es Noticia' },
    maisLidos: { pt: 'Mais Lidos', en: 'Most Read', es: 'Mas Leidos' },
    opiniao: { pt: 'Opiniao & Analise', en: 'Opinion & Analysis', es: 'Opinion & Analisis' },
    mercados: { pt: 'Mercados', en: 'Markets', es: 'Mercados' },
    trading: { pt: 'Trading', en: 'Trading', es: 'Trading' },
    investimentos: { pt: 'Investimentos', en: 'Investments', es: 'Inversiones' },
    emBreve: {
      pt: 'Em breve: nosso agente esta vasculhando o mundo em busca das noticias mais quentes do mercado financeiro. Volte em breve!',
      en: 'Coming soon: our agent is scouring the world for the hottest financial market news. Check back soon!',
      es: 'Proximamente: nuestro agente esta rastreando el mundo en busca de las noticias mas calientes del mercado financiero. Vuelve pronto!',
    },
  };
  const label = (key: string) => labels[key]?.[locale] || labels[key]?.pt || key;

  // Whether each conditional section will render
  const showMercados = mercadosArticles.length >= 2;
  const showOpiniao = opiniaoArticles.length >= 2;
  const hasTradingContent = tradingArticles.length > 0;
  const hasInvestimentosContent = investimentosArticles.length > 0;
  const showBottomFallback = !hasTradingContent && !hasInvestimentosContent && !showOpiniao;

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

      {/* ===== SECTION 1: HERO + "O QUE E NOTICIA" (3-col WSJ layout) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-rule-gray pb-8">

        {/* Left (col-span-3): Secondary stories stacked vertically */}
        <div className="order-2 lg:order-1 lg:col-span-3 lg:pr-6 lg:border-r lg:border-rule-gray pt-6 lg:pt-0">
          {leadExtras.length > 0 && (
            <div className="flex flex-col gap-3">
              {leadExtras.map((article, idx) => (
                <article key={article.slug} className="group">
                  <Link href={`/artigo/${article.slug}`} className="block">
                    {idx === 0 && article.image && (
                      <div className="overflow-hidden mb-2">
                        <img
                          src={article.image}
                          alt=""
                          className="w-full h-32 object-cover rounded-sm grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    )}
                    <h3 className="font-serif text-body-sm font-bold text-navy-900 group-hover:text-dollar-700 leading-snug transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <span className="font-sans text-caption text-navy-400 mt-0.5 block">
                      {article.author}
                    </span>
                  </Link>
                  {idx < leadExtras.length - 1 && (
                    <div className="border-b border-rule-gray mt-3" />
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Center (col-span-6): Lead/Hero story */}
        <div className="order-1 lg:order-2 lg:col-span-6 lg:px-6 pb-6 lg:pb-0">
          {leadStory && (
            <article className="group">
              <Link href={`/artigo/${leadStory.slug}`} className="block">
                {leadStory.image && (
                  <div className="relative overflow-hidden mb-4">
                    <img
                      src={leadStory.image}
                      alt={leadStory.title}
                      className="w-full h-[280px] sm:h-[340px] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}
                <h2 className="font-serif text-headline-xl font-bold text-navy-900 group-hover:text-navy-700 transition-colors leading-tight mb-3">
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

        {/* Right (col-span-3): "O Que E Noticia" bullet headlines */}
        <div className="order-3 lg:order-3 lg:col-span-3 lg:pl-6 lg:border-l lg:border-rule-gray pt-6 lg:pt-0 border-t lg:border-t-0 border-rule-gray flex flex-col">
          <h3 className="font-sans text-body-sm uppercase tracking-[0.2em] font-bold text-navy-500 border-b-2 border-navy-800 pb-2 mb-2">
            {label('whatsNews')}
          </h3>

          {bulletHeadlines.length > 0 ? (
            <ul className="bullet-headlines flex-1">
              {bulletHeadlines.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="bullet" />
              ))}
            </ul>
          ) : (
            <p className="font-body text-body-sm text-navy-400 italic py-4">
              {label('emBreve')}
            </p>
          )}
        </div>

      </div>

      {/* ===== SECTION 2: MERCADOS ===== */}
      {showMercados && (
        <section className="py-8 border-b border-rule-gray">
          <div className="section-header mb-6">
            <h2>{label('mercados')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mercadosArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* ===== SECTION 3: OPINIAO & ANALISE ===== */}
      {showOpiniao && (
        <section className="opinion-section border-b border-rule-gray">
          <div className="section-header mb-6">
            <h2>{label('opiniao')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {opiniaoArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* ===== SECTION 4: TRADING + INVESTIMENTOS + MAIS LIDOS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 py-8">

        {/* Left (7/10): Trading + Investimentos sub-sections */}
        <div className="lg:col-span-7 lg:pr-6 lg:border-r lg:border-rule-gray pb-6 lg:pb-0">

          {/* Trading sub-section */}
          {hasTradingContent && (
            <div className="mb-8">
              <h3 className="font-sans text-body-sm uppercase tracking-[0.2em] font-bold text-navy-500 border-b-2 border-navy-800 pb-2 mb-4">
                {label('trading')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tradingArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="standard" />
                ))}
              </div>
            </div>
          )}

          {/* Investimentos sub-section */}
          {hasInvestimentosContent && (
            <div>
              <h3 className="font-sans text-body-sm uppercase tracking-[0.2em] font-bold text-navy-500 border-b-2 border-navy-800 pb-2 mb-4">
                {label('investimentos')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {investimentosArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="standard" />
                ))}
              </div>
            </div>
          )}

          {/* Fallback: show artigos if no trading/investimentos AND no opiniao */}
          {showBottomFallback && artigos.length > 0 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {artigos.slice(0, 4).map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="standard" />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right (3/10): Mais Lidos numbered sidebar */}
        <div className="lg:col-span-3 lg:pl-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-rule-gray">
          <h3 className="font-sans text-body-sm uppercase tracking-[0.2em] font-bold text-navy-500 border-b-2 border-navy-800 pb-2 mb-2">
            {label('maisLidos')}
          </h3>

          <ol className="numbered-list">
            {mostRead.map((article) => (
              <li key={article.slug}>
                <Link href={`/artigo/${article.slug}`} className="block group">
                  <h4 className="font-serif text-body-md font-bold text-navy-900 group-hover:text-dollar-700 leading-snug transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <span className="font-sans text-caption text-navy-400 mt-1 block">
                    {article.author}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>

      </div>

    </div>
  );
}
