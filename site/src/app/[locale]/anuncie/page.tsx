import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    pt: 'Anuncie | Dinheirologia',
    en: 'Advertise | Dinheirologia',
    es: 'Anuncie | Dinheirologia',
  };
  return { title: titles[locale] || titles.pt };
}

/* ── Trilingual content ── */

type AudienceItem = { label: string; value: string };
type PricingRow = { name: string; desc: string; detail: string; price: string };
type Package = { name: string; price: string; period: string; features: string[]; featured?: boolean; badge?: string };
type Discount = { duration: string; value: string };
type Term = { title: string; text: string };

type Content = {
  title: string;
  /* Cover */
  coverLabel: string;
  coverSubtitle: string;
  coverTagline: string;
  coverYear: string;
  coverQuote: string;
  /* I — Quem Somos */
  whoTitle: string;
  whoParagraphs: string[];
  whoQuote: string;
  whoQuoteAttrib: string;
  stats: { number: string; label: string }[];
  /* II — Nosso Leitor */
  audienceTitle: string;
  audienceIntro: string;
  audienceGrid: AudienceItem[];
  audienceQuote: string;
  /* III — Formatos */
  formatsTitle: string;
  sponsoredLabel: string;
  sponsoredRows: PricingRow[];
  displayLabel: string;
  displayRows: PricingRow[];
  /* IV — Pacotes */
  packagesTitle: string;
  packages: Package[];
  discountsTitle: string;
  discountsIntro: string;
  discounts: Discount[];
  /* V — Termos */
  termsTitle: string;
  terms: Term[];
  termsAlert: string;
  /* VI — Porquê Nós */
  whyTitle: string;
  whyReasons: string[];
  whyQuote: string;
  whyQuoteAttrib: string;
  /* VII — Contacto */
  contactTitle: string;
  contactIntro: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPayments: string;
};

const CONTENT: Record<string, Content> = {
  pt: {
    title: 'Anuncie no Dinheirologia',
    /* Cover */
    coverLabel: 'Proposta Comercial',
    coverSubtitle: 'Media Kit & Tabela de Anunciantes',
    coverTagline: 'Sua leitura sobre dinheiro, sem frescuras.',
    coverYear: 'Fevereiro 2026 · Est. 2008',
    coverQuote: '"O mercado premia quem tem paciência para esperar e coragem para agir quando ninguém mais quer."',
    /* I */
    whoTitle: 'Ninguém aqui quer te vender um curso.',
    whoParagraphs: [
      'O Dinheirologia nasceu em 2008, no meio da crise financeira global — porque nada ensina mais sobre dinheiro do que vê-lo evaporar. Desde então, cobrimos mercados, trading, investimentos e negócios com uma regra simples: pele em jogo. Se não arriscamos o nosso, não opinamos sobre o seu.',
      'Não somos mais um Bloomberg de mãos dadas com clickbait. Não temos "semideuses" de redes sociais sem uma nota de corretora sequer. Somos um portal de análise financeira com humor ácido, profundidade real e alergia crónica a quem promete dinheiro fácil.',
      'Publicamos em 3 idiomas (Português, Inglês e Espanhol), todos os dias, porque mercado não espera — e nosso leitor também não.',
    ],
    whoQuote: '"Mastigamos, digerimos e cuspimos a informação de um jeito que você realmente entende. Se você quer fórmulas mágicas, você está no lugar errado. Se quer pensar, puxe a cadeira."',
    whoQuoteAttrib: '— Manifesto Dinheirologia',
    stats: [
      { number: '18', label: 'Anos de Mercado' },
      { number: '3', label: 'Idiomas' },
      { number: '200+', label: 'Artigos Publicados' },
    ],
    /* II */
    audienceTitle: 'Gente que pensa antes de clicar no botão de compra.',
    audienceIntro: 'Nosso público não está aqui por dicas de "ação que vai bombar". Está aqui porque desconfia de quem promete isso. São investidores, traders e empresários que valorizam análise sólida, pensamento crítico e um bom sarcasmo quando o mercado merece.',
    audienceGrid: [
      { label: 'Faixa Etária', value: '25 – 55 anos' },
      { label: 'Perfil', value: 'Investidores & Traders Ativos' },
      { label: 'Literacia Financeira', value: 'Acima da média' },
      { label: 'Renda', value: 'Classes A e B' },
      { label: 'Geografia', value: 'Brasil, EUA, Europa, Am. Latina' },
      { label: 'Comportamento', value: 'Leitura profunda, anti-hype' },
    ],
    audienceQuote: 'Nosso leitor sabe a diferença entre EPS ajustado e lucro líquido. Não é o público mais fácil de impressionar — mas quando confia, confia de verdade. E é por isso que seu anúncio aqui vale mais.',
    /* III */
    formatsTitle: 'O cardápio. Sem garçom empurrando sobremesa.',
    sponsoredLabel: 'Conteúdo Patrocinado',
    sponsoredRows: [
      { name: 'Guest Post', desc: 'Artigo fornecido pelo anunciante, revisado pela nossa equipa editorial.', detail: '1.000 – 2.000 palavras. Inclui até 2 links.', price: 'R$ 2.500 (~$500)' },
      { name: 'Artigo Premium', desc: 'Escrito pela nossa equipa, no tom editorial do Dinheirologia.', detail: 'Integração natural ao conteúdo do site. O leitor lê porque é bom.', price: 'R$ 5.000 (~$1.000)' },
      { name: 'Série de Conteúdo', desc: '4 artigos/mês com narrativa integrada.', detail: 'Ideal para lançamentos, campanhas temáticas ou posicionamento de marca a longo prazo.', price: 'R$ 15.000 (~$3.000)' },
      { name: 'Inserção de Link', desc: 'Link contextual em artigo existente e relevante.', detail: 'Adição natural a conteúdo já publicado.', price: 'R$ 1.500 (~$300)' },
    ],
    displayLabel: 'Publicidade Display',
    displayRows: [
      { name: 'Header / Topo', desc: 'Banner 728×90 ou 970×250', detail: 'Primeira coisa que o leitor vê.', price: 'R$ 3.000/mês (~$600)' },
      { name: 'Sidebar', desc: 'Banner 300×250', detail: 'Presente em todas as páginas de artigo.', price: 'R$ 1.500/mês (~$300)' },
      { name: 'In-Article', desc: 'Banner entre parágrafos', detail: 'Máxima atenção, leitor engajado.', price: 'R$ 2.000/mês (~$400)' },
      { name: 'Footer', desc: 'Banner 728×90', detail: 'Fecho de leitura, custo-benefício.', price: 'R$ 800/mês (~$160)' },
    ],
    /* IV */
    packagesTitle: 'Para quem quer o bife, não só o cheiro.',
    packages: [
      { name: 'Starter', price: 'R$ 3.500', period: 'por mês · ~$700', features: ['1 Guest Post', 'Banner na Sidebar', 'Publicação em 1 idioma', 'Relatório de views mensal'] },
      { name: 'Growth', price: 'R$ 10.000', period: 'por mês · ~$2.000', featured: true, badge: 'Mais Popular', features: ['2 Artigos Premium', 'Banner no Header', '2 Inserções de Link', 'Publicação em 2 idiomas', 'Relatório analítico semanal'] },
      { name: 'Premium', price: 'R$ 25.000', period: 'por mês · ~$5.000', features: ['4 Artigos Premium', 'Banner Header + Sidebar', 'Menção nos 3 idiomas', 'Exclusividade no segmento', 'Relatório analítico semanal'] },
    ],
    discountsTitle: 'Descontos por Compromisso',
    discountsIntro: 'Porque relações de longo prazo rendem mais que day trade.',
    discounts: [
      { duration: 'Trimestral', value: '-10%' },
      { duration: 'Semestral', value: '-15%' },
      { duration: 'Anual', value: '-25%' },
    ],
    /* V */
    termsTitle: 'As letras miúdas que a gente faz questão que você leia.',
    terms: [
      { title: 'Relatório de Performance', text: 'Cada campanha inclui relatório detalhado com métricas de visualizações, tempo de leitura e engajamento. Você sabe exactamente o retorno do seu investimento.' },
      { title: 'Conformidade SEO', text: 'Links patrocinados utilizam o atributo rel="sponsored", em conformidade com as diretrizes do Google. Protege o anunciante e protege o site.' },
      { title: 'Revisão Editorial', text: 'A equipa reserva o direito de editar, reformular ou recusar conteúdo que não atenda aos nossos padrões. Publicamos coisas boas — essa é a regra.' },
      { title: 'Pagamento', text: '100% antecipado, antes da publicação. Aceitamos PayPal, transferência bancária internacional, Pix (Brasil), USDT e USDC.' },
      { title: 'Permanência', text: 'Conteúdo publicado permanece no site por no mínimo 12 meses. Renovação com condições preferenciais.' },
      { title: 'Exclusividade', text: 'No pacote Premium, apenas 1 anunciante por segmento. Porque ninguém quer dividir o palco com o concorrente.' },
    ],
    termsAlert: 'Conteúdo não aceite: Esquemas financeiros fraudulentos, promessas de retorno garantido, apostas, cripto sem fundamento, conteúdo enganoso ou qualquer coisa que a gente não diria ao nosso próprio dinheiro.',
    /* VI */
    whyTitle: 'Três razões para não gastar o seu orçamento noutro lugar.',
    whyReasons: [
      '1. Credibilidade que não se compra. 18 anos no ar, nascidos numa crise financeira, com opiniões que têm pele em jogo. Quando dizemos que algo vale a pena, o leitor sabe que é porque apostamos o nosso antes de sugerir o dele.',
      '2. Audiência qualificada, não inflada. Não vendemos números bonitos. Vendemos leitores que sabem o que é um P/L, que abrem corretora de manhã e leem o Dinheirologia antes do café. São poucos? Talvez. Mas cada um vale dez.',
      '3. Conteúdo que vive. Nossos artigos não morrem no feed. São referência, são buscados, são relidos. Seu investimento aqui tem vida útil longa — não é um story que evapora em 24 horas.',
    ],
    whyQuote: '"Se você quer volume, anuncia no Instagram. Se quer convicção, anuncia no Dinheirologia."',
    whyQuoteAttrib: '— Ricardina Cifrão, Diretora Comercial',
    /* VII */
    contactTitle: 'Vamos conversar sobre o seu investimento.',
    contactIntro: 'Não mordemos. A menos que você peça para esconder que pagou.',
    contactName: 'Ricardina Cifrão',
    contactRole: 'Diretora de Parcerias Comerciais',
    contactEmail: 'anuncie@dinheirologia.com',
    contactPayments: 'PayPal · Transferência · Pix · USDT · USDC',
  },

  en: {
    title: 'Advertise on Dinheirologia',
    coverLabel: 'Commercial Proposal',
    coverSubtitle: 'Media Kit & Advertising Rates',
    coverTagline: 'Your money read, no BS attached.',
    coverYear: 'February 2026 · Est. 2008',
    coverQuote: '"The market rewards those with the patience to wait and the courage to act when no one else will."',
    whoTitle: 'Nobody here is trying to sell you a course.',
    whoParagraphs: [
      'Dinheirologia was born in 2008, in the middle of the global financial crisis — because nothing teaches you more about money than watching it evaporate. Since then, we\'ve covered markets, trading, investments and business with one simple rule: skin in the game. If we don\'t risk ours, we don\'t opine about yours.',
      'We\'re not another Bloomberg holding hands with clickbait. We don\'t have social media "demigods" without a single brokerage statement. We\'re a financial analysis portal with acid humor, real depth and a chronic allergy to anyone promising easy money.',
      'We publish in 3 languages (Portuguese, English and Spanish), every day, because the market doesn\'t wait — and neither does our reader.',
    ],
    whoQuote: '"We chew, digest and spit out information in a way you actually understand. If you want magic formulas, you\'re in the wrong place. If you want to think, pull up a chair."',
    whoQuoteAttrib: '— Dinheirologia Manifesto',
    stats: [
      { number: '18', label: 'Years in the Market' },
      { number: '3', label: 'Languages' },
      { number: '200+', label: 'Published Articles' },
    ],
    audienceTitle: 'People who think before clicking the buy button.',
    audienceIntro: 'Our audience isn\'t here for "hot stock tips". They\'re here because they distrust anyone who promises that. They are investors, traders and entrepreneurs who value solid analysis, critical thinking and good sarcasm when the market deserves it.',
    audienceGrid: [
      { label: 'Age Range', value: '25 – 55 years old' },
      { label: 'Profile', value: 'Active Investors & Traders' },
      { label: 'Financial Literacy', value: 'Above average' },
      { label: 'Income', value: 'Upper-middle & High' },
      { label: 'Geography', value: 'Brazil, USA, Europe, Latin America' },
      { label: 'Behavior', value: 'Deep reading, anti-hype' },
    ],
    audienceQuote: 'Our reader knows the difference between adjusted EPS and net income. They\'re not the easiest audience to impress — but when they trust, they truly trust. And that\'s why your ad here is worth more.',
    formatsTitle: 'The menu. No waiter pushing dessert.',
    sponsoredLabel: 'Sponsored Content',
    sponsoredRows: [
      { name: 'Guest Post', desc: 'Article provided by the advertiser, reviewed by our editorial team.', detail: '1,000 – 2,000 words. Includes up to 2 links.', price: 'R$ 2,500 (~$500)' },
      { name: 'Premium Article', desc: 'Written by our team, in Dinheirologia\'s editorial tone.', detail: 'Natural integration into site content. The reader reads it because it\'s good.', price: 'R$ 5,000 (~$1,000)' },
      { name: 'Content Series', desc: '4 articles/month with integrated narrative.', detail: 'Ideal for launches, themed campaigns or long-term brand positioning.', price: 'R$ 15,000 (~$3,000)' },
      { name: 'Link Insertion', desc: 'Contextual link in an existing relevant article.', detail: 'Natural addition to already published content.', price: 'R$ 1,500 (~$300)' },
    ],
    displayLabel: 'Display Advertising',
    displayRows: [
      { name: 'Header / Top', desc: 'Banner 728×90 or 970×250', detail: 'First thing the reader sees.', price: 'R$ 3,000/mo (~$600)' },
      { name: 'Sidebar', desc: 'Banner 300×250', detail: 'Present on all article pages.', price: 'R$ 1,500/mo (~$300)' },
      { name: 'In-Article', desc: 'Banner between paragraphs', detail: 'Maximum attention, engaged reader.', price: 'R$ 2,000/mo (~$400)' },
      { name: 'Footer', desc: 'Banner 728×90', detail: 'End of reading, cost-effective.', price: 'R$ 800/mo (~$160)' },
    ],
    packagesTitle: 'For those who want the steak, not just the smell.',
    packages: [
      { name: 'Starter', price: 'R$ 3,500', period: 'per month · ~$700', features: ['1 Guest Post', 'Sidebar Banner', 'Publication in 1 language', 'Monthly views report'] },
      { name: 'Growth', price: 'R$ 10,000', period: 'per month · ~$2,000', featured: true, badge: 'Most Popular', features: ['2 Premium Articles', 'Header Banner', '2 Link Insertions', 'Publication in 2 languages', 'Weekly analytics report'] },
      { name: 'Premium', price: 'R$ 25,000', period: 'per month · ~$5,000', features: ['4 Premium Articles', 'Header + Sidebar Banner', 'Mention in all 3 languages', 'Segment exclusivity', 'Weekly analytics report'] },
    ],
    discountsTitle: 'Commitment Discounts',
    discountsIntro: 'Because long-term relationships yield more than day trading.',
    discounts: [
      { duration: 'Quarterly', value: '-10%' },
      { duration: 'Semi-Annual', value: '-15%' },
      { duration: 'Annual', value: '-25%' },
    ],
    termsTitle: 'The fine print we actually want you to read.',
    terms: [
      { title: 'Performance Report', text: 'Every campaign includes a detailed report with views, reading time and engagement metrics. You know exactly what your investment returns.' },
      { title: 'SEO Compliance', text: 'Sponsored links use the rel="sponsored" attribute, in compliance with Google guidelines. It protects the advertiser and protects the site.' },
      { title: 'Editorial Review', text: 'The team reserves the right to edit, rewrite or reject content that doesn\'t meet our standards. We publish good stuff — that\'s the rule.' },
      { title: 'Payment', text: '100% upfront, before publication. We accept PayPal, international bank transfer, Pix (Brazil), USDT and USDC.' },
      { title: 'Permanence', text: 'Published content stays on the site for a minimum of 12 months. Renewal with preferential conditions.' },
      { title: 'Exclusivity', text: 'In the Premium package, only 1 advertiser per segment. Because nobody wants to share the stage with the competition.' },
    ],
    termsAlert: 'Content not accepted: Fraudulent financial schemes, guaranteed return promises, gambling, unfounded crypto, misleading content or anything we wouldn\'t say to our own money.',
    whyTitle: 'Three reasons not to spend your budget elsewhere.',
    whyReasons: [
      '1. Credibility money can\'t buy. 18 years on air, born in a financial crisis, with opinions that have skin in the game. When we say something is worth it, the reader knows it\'s because we bet ours before suggesting theirs.',
      '2. Qualified audience, not inflated. We don\'t sell pretty numbers. We sell readers who know what a P/E ratio is, who open their brokerage in the morning and read Dinheirologia before coffee. Are they few? Maybe. But each one is worth ten.',
      '3. Content that lives. Our articles don\'t die in the feed. They\'re referenced, searched for, re-read. Your investment here has a long shelf life — it\'s not a story that evaporates in 24 hours.',
    ],
    whyQuote: '"If you want volume, advertise on Instagram. If you want conviction, advertise on Dinheirologia."',
    whyQuoteAttrib: '— Ricardina Cifrão, Commercial Director',
    contactTitle: 'Let\'s talk about your investment.',
    contactIntro: 'We don\'t bite. Unless you ask us to hide that you paid.',
    contactName: 'Ricardina Cifrão',
    contactRole: 'Director of Commercial Partnerships',
    contactEmail: 'anuncie@dinheirologia.com',
    contactPayments: 'PayPal · Wire Transfer · Pix · USDT · USDC',
  },

  es: {
    title: 'Anuncie en Dinheirologia',
    coverLabel: 'Propuesta Comercial',
    coverSubtitle: 'Media Kit & Tabla de Anunciantes',
    coverTagline: 'Tu lectura sobre dinero, sin rodeos.',
    coverYear: 'Febrero 2026 · Est. 2008',
    coverQuote: '"El mercado premia a quien tiene paciencia para esperar y coraje para actuar cuando nadie más quiere."',
    whoTitle: 'Nadie aquí quiere venderte un curso.',
    whoParagraphs: [
      'Dinheirologia nació en 2008, en medio de la crisis financiera global — porque nada enseña más sobre dinero que verlo evaporarse. Desde entonces, cubrimos mercados, trading, inversiones y negocios con una regla simple: piel en el juego. Si no arriesgamos lo nuestro, no opinamos sobre lo tuyo.',
      'No somos otro Bloomberg de la mano con clickbait. No tenemos "semidioses" de redes sociales sin un solo estado de cuenta. Somos un portal de análisis financiero con humor ácido, profundidad real y alergia crónica a quien promete dinero fácil.',
      'Publicamos en 3 idiomas (Portugués, Inglés y Español), todos los días, porque el mercado no espera — y nuestro lector tampoco.',
    ],
    whoQuote: '"Masticamos, digerimos y escupimos la información de una forma que realmente entiendes. Si quieres fórmulas mágicas, estás en el lugar equivocado. Si quieres pensar, acerca la silla."',
    whoQuoteAttrib: '— Manifiesto Dinheirologia',
    stats: [
      { number: '18', label: 'Años en el Mercado' },
      { number: '3', label: 'Idiomas' },
      { number: '200+', label: 'Artículos Publicados' },
    ],
    audienceTitle: 'Gente que piensa antes de darle al botón de compra.',
    audienceIntro: 'Nuestro público no está aquí por tips de "la acción que va a explotar". Está aquí porque desconfía de quien promete eso. Son inversores, traders y empresarios que valoran análisis sólido, pensamiento crítico y un buen sarcasmo cuando el mercado lo merece.',
    audienceGrid: [
      { label: 'Rango de Edad', value: '25 – 55 años' },
      { label: 'Perfil', value: 'Inversores & Traders Activos' },
      { label: 'Educación Financiera', value: 'Por encima del promedio' },
      { label: 'Ingresos', value: 'Clases A y B' },
      { label: 'Geografía', value: 'Brasil, EE.UU., Europa, Am. Latina' },
      { label: 'Comportamiento', value: 'Lectura profunda, anti-hype' },
    ],
    audienceQuote: 'Nuestro lector sabe la diferencia entre EPS ajustado y beneficio neto. No es el público más fácil de impresionar — pero cuando confía, confía de verdad. Y por eso tu anuncio aquí vale más.',
    formatsTitle: 'El menú. Sin mesero empujando postre.',
    sponsoredLabel: 'Contenido Patrocinado',
    sponsoredRows: [
      { name: 'Guest Post', desc: 'Artículo proporcionado por el anunciante, revisado por nuestro equipo editorial.', detail: '1.000 – 2.000 palabras. Incluye hasta 2 enlaces.', price: 'R$ 2.500 (~$500)' },
      { name: 'Artículo Premium', desc: 'Escrito por nuestro equipo, en el tono editorial de Dinheirologia.', detail: 'Integración natural al contenido del sitio. El lector lo lee porque es bueno.', price: 'R$ 5.000 (~$1.000)' },
      { name: 'Serie de Contenido', desc: '4 artículos/mes con narrativa integrada.', detail: 'Ideal para lanzamientos, campañas temáticas o posicionamiento de marca a largo plazo.', price: 'R$ 15.000 (~$3.000)' },
      { name: 'Inserción de Link', desc: 'Link contextual en artículo existente y relevante.', detail: 'Adición natural a contenido ya publicado.', price: 'R$ 1.500 (~$300)' },
    ],
    displayLabel: 'Publicidad Display',
    displayRows: [
      { name: 'Header / Tope', desc: 'Banner 728×90 o 970×250', detail: 'Lo primero que ve el lector.', price: 'R$ 3.000/mes (~$600)' },
      { name: 'Sidebar', desc: 'Banner 300×250', detail: 'Presente en todas las páginas de artículo.', price: 'R$ 1.500/mes (~$300)' },
      { name: 'In-Article', desc: 'Banner entre párrafos', detail: 'Máxima atención, lector comprometido.', price: 'R$ 2.000/mes (~$400)' },
      { name: 'Footer', desc: 'Banner 728×90', detail: 'Cierre de lectura, costo-beneficio.', price: 'R$ 800/mes (~$160)' },
    ],
    packagesTitle: 'Para quien quiere el bistec, no solo el aroma.',
    packages: [
      { name: 'Starter', price: 'R$ 3.500', period: 'por mes · ~$700', features: ['1 Guest Post', 'Banner en Sidebar', 'Publicación en 1 idioma', 'Reporte de vistas mensual'] },
      { name: 'Growth', price: 'R$ 10.000', period: 'por mes · ~$2.000', featured: true, badge: 'Más Popular', features: ['2 Artículos Premium', 'Banner en Header', '2 Inserciones de Link', 'Publicación en 2 idiomas', 'Reporte analítico semanal'] },
      { name: 'Premium', price: 'R$ 25.000', period: 'por mes · ~$5.000', features: ['4 Artículos Premium', 'Banner Header + Sidebar', 'Mención en los 3 idiomas', 'Exclusividad en el segmento', 'Reporte analítico semanal'] },
    ],
    discountsTitle: 'Descuentos por Compromiso',
    discountsIntro: 'Porque las relaciones a largo plazo rinden más que el day trading.',
    discounts: [
      { duration: 'Trimestral', value: '-10%' },
      { duration: 'Semestral', value: '-15%' },
      { duration: 'Anual', value: '-25%' },
    ],
    termsTitle: 'La letra chica que sí queremos que leas.',
    terms: [
      { title: 'Reporte de Performance', text: 'Cada campaña incluye un reporte detallado con métricas de visualizaciones, tiempo de lectura y engagement. Sabes exactamente el retorno de tu inversión.' },
      { title: 'Conformidad SEO', text: 'Los links patrocinados utilizan el atributo rel="sponsored", conforme a las directrices de Google. Protege al anunciante y protege al sitio.' },
      { title: 'Revisión Editorial', text: 'El equipo se reserva el derecho de editar, reformular o rechazar contenido que no cumpla nuestros estándares. Publicamos cosas buenas — esa es la regla.' },
      { title: 'Pago', text: '100% anticipado, antes de la publicación. Aceptamos PayPal, transferencia bancaria internacional, Pix (Brasil), USDT y USDC.' },
      { title: 'Permanencia', text: 'El contenido publicado permanece en el sitio por mínimo 12 meses. Renovación con condiciones preferenciales.' },
      { title: 'Exclusividad', text: 'En el paquete Premium, solo 1 anunciante por segmento. Porque nadie quiere compartir el escenario con la competencia.' },
    ],
    termsAlert: 'Contenido no aceptado: Esquemas financieros fraudulentos, promesas de retorno garantizado, apuestas, cripto sin fundamento, contenido engañoso o cualquier cosa que no le diríamos a nuestro propio dinero.',
    whyTitle: 'Tres razones para no gastar tu presupuesto en otro lugar.',
    whyReasons: [
      '1. Credibilidad que no se compra. 18 años al aire, nacidos en una crisis financiera, con opiniones que tienen piel en el juego. Cuando decimos que algo vale la pena, el lector sabe que es porque apostamos lo nuestro antes de sugerir lo suyo.',
      '2. Audiencia calificada, no inflada. No vendemos números bonitos. Vendemos lectores que saben qué es un P/E, que abren la corredora por la mañana y leen Dinheirologia antes del café. ¿Son pocos? Tal vez. Pero cada uno vale diez.',
      '3. Contenido que vive. Nuestros artículos no mueren en el feed. Son referencia, se buscan, se releen. Tu inversión aquí tiene larga vida útil — no es un story que se evapora en 24 horas.',
    ],
    whyQuote: '"Si quieres volumen, anuncia en Instagram. Si quieres convicción, anuncia en Dinheirologia."',
    whyQuoteAttrib: '— Ricardina Cifrão, Directora Comercial',
    contactTitle: 'Hablemos sobre tu inversión.',
    contactIntro: 'No mordemos. A menos que nos pidas esconder que pagaste.',
    contactName: 'Ricardina Cifrão',
    contactRole: 'Directora de Alianzas Comerciales',
    contactEmail: 'anuncie@dinheirologia.com',
    contactPayments: 'PayPal · Transferencia · Pix · USDT · USDC',
  },
};

/* ── Pricing Table Component ── */
function PricingTable({ label, rows }: { label: string; rows: PricingRow[] }) {
  return (
    <div className="mb-8">
      <h3 className="font-serif text-headline-md text-navy-900 mb-4">{label}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-body-sm">
          <thead>
            <tr className="bg-dollar-800 text-cream-100">
              <th className="font-sans text-caption uppercase tracking-wider text-left p-3 font-semibold">Formato</th>
              <th className="font-sans text-caption uppercase tracking-wider text-left p-3 font-semibold hidden md:table-cell">Detalhe</th>
              <th className="font-sans text-caption uppercase tracking-wider text-right p-3 font-semibold whitespace-nowrap">Preço</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`border-b border-rule-gray ${i % 2 === 1 ? 'bg-cream-50' : ''} hover:bg-dollar-50 transition-colors`}>
                <td className="p-3 align-top">
                  <strong className="text-navy-900">{row.name}</strong>
                  <span className="block text-caption text-navy-400 italic mt-1">{row.desc}</span>
                  <span className="block text-caption text-navy-400 mt-1 md:hidden">{row.detail}</span>
                </td>
                <td className="p-3 align-top text-navy-700 hidden md:table-cell">{row.detail}</td>
                <td className="p-3 align-top text-right font-sans font-semibold text-dollar-600 whitespace-nowrap">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Page Component ── */
export default async function AnunciePage({ params }: Props) {
  const { locale } = await params;
  const c = CONTENT[locale] || CONTENT.pt;

  return (
    <div className="max-w-article mx-auto px-4 py-12">
      {/* ── Cover ── */}
      <section className="flex flex-col items-center text-center py-16 mb-10 border-b-3 border-rule-gray relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-dollar-700" />
        <p className="font-sans text-caption uppercase tracking-[0.25em] text-cream mb-10">{c.coverLabel}</p>
        <h1 className="font-serif text-headline-xl md:text-[3.5rem] font-bold text-navy-900 tracking-[0.15em] uppercase border-y-2 border-navy-900 py-5 mb-8">
          Dinheirologia.
        </h1>
        <p className="font-serif text-headline-md md:text-[2rem] italic text-dollar-600 mb-4">{c.coverSubtitle}</p>
        <p className="font-body text-body-lg italic text-navy-400 mb-12">{c.coverTagline}</p>
        <p className="font-sans text-caption uppercase tracking-[0.2em] text-cream mb-12">{c.coverYear}</p>
        <p className="font-body text-body-sm italic text-navy-400 max-w-md">{c.coverQuote}</p>
      </section>

      {/* I — Quem Somos */}
      <section className="mb-10">
        <p className="font-sans text-caption uppercase tracking-wider text-dollar-600 mb-2">I</p>
        <h2 className="font-serif text-headline-md text-navy-900 mb-4">{c.whoTitle}</h2>
        {c.whoParagraphs.map((p, i) => (
          <p key={i} className="font-body text-body-lg text-navy-700 mb-4 leading-relaxed">{p}</p>
        ))}
        <div className="bg-cream-50 border-l-3 border-gold p-6 my-6">
          <p className="font-body text-body-lg text-navy-600 italic">{c.whoQuote}</p>
          <p className="font-sans text-caption uppercase tracking-wider text-cream mt-2">{c.whoQuoteAttrib}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          {c.stats.map((s, i) => (
            <div key={i} className="text-center p-6 border border-rule-gray">
              <div className="font-serif text-headline-xl font-bold text-dollar-600 leading-none mb-2">{s.number}</div>
              <div className="font-sans text-caption uppercase tracking-wider text-navy-400">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="border-b border-rule-gray mt-10" />
      </section>

      {/* II — Nosso Leitor */}
      <section className="mb-10">
        <p className="font-sans text-caption uppercase tracking-wider text-dollar-600 mb-2">II</p>
        <h2 className="font-serif text-headline-md text-navy-900 mb-4">{c.audienceTitle}</h2>
        <p className="font-body text-body-lg text-navy-700 mb-6 leading-relaxed">{c.audienceIntro}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 border border-rule-gray my-6">
          {c.audienceGrid.map((item, i) => (
            <div key={i} className={`p-4 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < c.audienceGrid.length - 2 ? 'border-b' : ''} border-rule-gray`}>
              <div className="font-sans text-caption uppercase tracking-wider text-dollar-600 mb-1">{item.label}</div>
              <div className="font-serif text-body-lg font-bold text-navy-900">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="bg-cream-50 border-l-3 border-gold p-6 my-6">
          <p className="font-body text-body-lg text-navy-600 italic">{c.audienceQuote}</p>
        </div>
        <div className="border-b border-rule-gray mt-10" />
      </section>

      {/* III — Formatos */}
      <section className="mb-10">
        <p className="font-sans text-caption uppercase tracking-wider text-dollar-600 mb-2">III</p>
        <h2 className="font-serif text-headline-md text-navy-900 mb-6">{c.formatsTitle}</h2>
        <PricingTable label={c.sponsoredLabel} rows={c.sponsoredRows} />
        <PricingTable label={c.displayLabel} rows={c.displayRows} />
        <div className="border-b border-rule-gray mt-10" />
      </section>

      {/* IV — Pacotes */}
      <section className="mb-10">
        <p className="font-sans text-caption uppercase tracking-wider text-dollar-600 mb-2">IV</p>
        <h2 className="font-serif text-headline-md text-navy-900 mb-6">{c.packagesTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 my-8">
          {c.packages.map((pkg, i) => (
            <div
              key={i}
              className={`border border-rule-gray p-6 text-center relative ${
                pkg.featured
                  ? 'bg-dollar-800 border-dollar-700 md:scale-[1.03] z-10 shadow-lg'
                  : 'bg-paper'
              } ${i === 1 ? 'md:border-l-0 md:border-r-0' : ''}`}
            >
              {pkg.badge && (
                <div className="font-sans text-caption uppercase tracking-widest bg-gold text-paper px-3 py-1 absolute -top-px left-1/2 -translate-x-1/2 text-xs font-semibold">
                  {pkg.badge}
                </div>
              )}
              <div className={`font-serif text-headline-sm font-bold mt-4 ${pkg.featured ? 'text-cream-100' : 'text-navy-900'}`}>
                {pkg.name}
              </div>
              <div className={`font-serif text-headline-lg font-bold my-3 ${pkg.featured ? 'text-gold-light' : 'text-dollar-600'}`}>
                {pkg.price}
              </div>
              <div className={`font-sans text-caption uppercase tracking-wider mb-4 ${pkg.featured ? 'text-cream' : 'text-navy-400'}`}>
                {pkg.period}
              </div>
              <ul className="text-left">
                {pkg.features.map((f, j) => (
                  <li
                    key={j}
                    className={`text-body-sm py-2 border-b ${
                      pkg.featured ? 'border-dollar-700 text-cream-100' : 'border-rule-gray text-navy-700'
                    }`}
                  >
                    <span className={`font-sans font-bold mr-1 ${pkg.featured ? 'text-gold-light' : 'text-dollar-600'}`}>$</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Descontos */}
        <h3 className="font-serif text-headline-md text-navy-900 mb-2 mt-8">{c.discountsTitle}</h3>
        <p className="font-body text-body-lg text-navy-700 mb-4">{c.discountsIntro}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 border border-rule-gray bg-newsprint">
          {c.discounts.map((d, i) => (
            <div key={i} className={`text-center p-6 ${i < c.discounts.length - 1 ? 'md:border-r border-b md:border-b-0' : ''} border-rule-gray`}>
              <div className="font-sans text-caption uppercase tracking-wider text-navy-400 mb-2">{d.duration}</div>
              <div className="font-serif text-headline-lg font-bold text-dollar-600">{d.value}</div>
            </div>
          ))}
        </div>
        <div className="border-b border-rule-gray mt-10" />
      </section>

      {/* V — Termos */}
      <section className="mb-10">
        <p className="font-sans text-caption uppercase tracking-wider text-dollar-600 mb-2">V</p>
        <h2 className="font-serif text-headline-md text-navy-900 mb-6">{c.termsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {c.terms.map((term, i) => (
            <div key={i} className="p-4 border border-rule-gray">
              <h4 className="font-sans text-caption uppercase tracking-wider text-dollar-600 mb-2">{term.title}</h4>
              <p className="font-body text-body-sm text-navy-700 leading-relaxed">{term.text}</p>
            </div>
          ))}
        </div>
        <div className="bg-cream-50 border border-salmon border-l-3 p-4 my-6">
          <p className="font-body text-body-sm text-navy-600"><strong>{c.termsAlert}</strong></p>
        </div>
        <div className="border-b border-rule-gray mt-10" />
      </section>

      {/* VI — Porquê Nós */}
      <section className="mb-10">
        <p className="font-sans text-caption uppercase tracking-wider text-dollar-600 mb-2">VI</p>
        <h2 className="font-serif text-headline-md text-navy-900 mb-4">{c.whyTitle}</h2>
        {c.whyReasons.map((r, i) => (
          <p key={i} className="font-body text-body-lg text-navy-700 mb-4 leading-relaxed">{r}</p>
        ))}
        <div className="bg-cream-50 border-l-3 border-gold p-6 my-6">
          <p className="font-body text-body-lg text-navy-600 italic">{c.whyQuote}</p>
          <p className="font-sans text-caption uppercase tracking-wider text-cream mt-2">{c.whyQuoteAttrib}</p>
        </div>
        <div className="border-b border-rule-gray mt-10" />
      </section>

      {/* VII — Contacto */}
      <section className="bg-dollar-800 -mx-4 px-4 py-12 text-center rounded-sm">
        <p className="font-sans text-caption uppercase tracking-wider text-cream mb-2">VII</p>
        <h2 className="font-serif text-headline-md text-cream-100 mb-4">{c.contactTitle}</h2>
        <p className="font-body text-body-lg text-cream-200 mb-8 max-w-md mx-auto">{c.contactIntro}</p>
        <p className="font-serif text-headline-sm font-bold text-gold-light mb-1">{c.contactName}</p>
        <p className="font-sans text-caption uppercase tracking-wider text-cream mb-6">{c.contactRole}</p>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="text-center">
            <span className="font-sans text-caption uppercase tracking-wider text-cream block mb-1">Email</span>
            <a href={`mailto:${c.contactEmail}`} className="font-body text-body-lg text-gold-light border-b border-gold pb-px hover:text-gold transition-colors">
              {c.contactEmail}
            </a>
          </div>
          <div className="text-center">
            <span className="font-sans text-caption uppercase tracking-wider text-cream block mb-1">
              {locale === 'en' ? 'Payments' : locale === 'es' ? 'Pagos' : 'Pagamentos'}
            </span>
            <span className="font-body text-body-lg text-cream-100">{c.contactPayments}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
