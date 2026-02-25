export type ContentType = 'artigo' | 'noticia';

export interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  authorSlug: string;
  category: 'mercados' | 'trading' | 'investimentos' | 'negocios' | 'opiniao';
  contentType: ContentType;
  tags: string[];
  image?: string;
  imageCaption?: string;
  readTime: number;
  featured?: boolean;
  locale: string;
}

export interface CalendarEvent {
  id: string;
  time: string;
  country: string;
  countryCode: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  previous?: string;
  forecast?: string;
  actual?: string;
  humorNote?: string;
}

export type Category = Article['category'];

export const CATEGORIES: Record<Category, { pt: string; en: string; es: string }> = {
  mercados: { pt: 'Mercados', en: 'Markets', es: 'Mercados' },
  trading: { pt: 'Trading', en: 'Trading', es: 'Trading' },
  investimentos: { pt: 'Investimentos', en: 'Investments', es: 'Inversiones' },
  negocios: { pt: 'Negócios', en: 'Business', es: 'Negocios' },
  opiniao: { pt: 'Opinião', en: 'Opinion', es: 'Opinión' },
};

export const FICTIONAL_AUTHORS = [
  { name: 'Seu Zé das Couve', bio: { pt: 'Ex-feirante que descobriu que o mercado financeiro é só uma feira mais cara.', en: 'Former street vendor who discovered the stock market is just a fancier farmers market.', es: 'Ex-feriante que descubrió que el mercado financiero es solo una feria más cara.' } },
  { name: 'Creuza', bio: { pt: 'Dona de casa que ganha mais no daytrade do que o marido no emprego.', en: 'Housewife who makes more daytrading than her husband at his job.', es: 'Ama de casa que gana más en el daytrading que su marido en el trabajo.' } },
  { name: 'Gertrudes', bio: { pt: 'Aposentada com mais ações na carteira do que paciência pra novela.', en: 'Retiree with more stocks in her portfolio than patience for soap operas.', es: 'Jubilada con más acciones en su cartera que paciencia para telenovelas.' } },
  { name: 'Tião', bio: { pt: 'Caminhoneiro que ouve podcast de economia na estrada e opera pelo celular nos postos.', en: 'Truck driver who listens to economics podcasts on the road and trades from gas stations.', es: 'Camionero que escucha podcasts de economía en la carretera y opera desde las gasolineras.' } },
  { name: 'Dona Clotilde', bio: { pt: 'Professora aposentada que ensina os netos a ler balanço patrimonial.', en: 'Retired teacher who teaches her grandkids to read balance sheets.', es: 'Profesora jubilada que enseña a sus nietos a leer balances.' } },
  { name: 'Zé Mané', bio: { pt: 'Pedreiro que construiu a própria carteira tijolo por tijolo.', en: 'Bricklayer who built his portfolio brick by brick.', es: 'Albañil que construyó su cartera ladrillo a ladrillo.' } },
  { name: 'Toninho Maluco', bio: { pt: 'O cara do bar que previu a crise de 2008 mas ninguém acreditou.', en: 'The bar guy who predicted the 2008 crisis but nobody believed.', es: 'El tipo del bar que predijo la crisis de 2008 pero nadie le creyó.' } },
];

export const JOAO_AUTHOR = 'Como Dirigir Uma Mercearia e Umas Coisinhas Que Aprendi Sobre Pescaria';
