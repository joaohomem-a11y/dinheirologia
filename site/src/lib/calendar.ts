import type { CalendarEvent } from '@/types/article';

const IMPACT_EMOJIS = {
  high: ['🔥', '💀', '☢️', '🚨', '💣'],
  medium: ['😬', '👀', '⚡', '🎯', '📊'],
  low: ['😴', '💤', '🥱', '☕', '🤷'],
};

const HUMOR_NOTES: Record<string, Record<string, string>> = {
  pt: {
    'Non-Farm Payrolls': 'O dia que o mercado inteiro finge que entende de emprego nos EUA.',
    'CPI': 'Inflação: quando seu dinheiro decide emagrecer sozinho.',
    'FOMC': 'O dia que um velho decide o destino das suas ações.',
    'GDP': 'PIB: a nota do boletim da economia. Spoiler: quase sempre decepcionante.',
    'Interest Rate Decision': 'Selic subiu? Renda fixa sorri. Selic caiu? Bolsa faz a festa. Selic parada? Todo mundo reclama.',
    'Unemployment Rate': 'Taxa de desemprego: o número que políticos amam ou odeiam dependendo de quem está no poder.',
    'Retail Sales': 'Vendas no varejo: o termômetro de quanto a galera está torrando no cartão.',
    'PMI': 'PMI: Purchasing Managers Index. Traduzindo: os gerentes de compras estão otimistas ou já mandaram o currículo?',
  },
  en: {
    'Non-Farm Payrolls': 'The day the entire market pretends to understand US employment.',
    'CPI': 'Inflation: when your money decides to go on a diet by itself.',
    'FOMC': 'The day an old man decides the fate of your portfolio.',
    'GDP': 'GDP: the economy\'s report card. Spoiler: almost always disappointing.',
    'Interest Rate Decision': 'Rate up? Fixed income smiles. Rate down? Stocks party. Rate unchanged? Everyone complains.',
    'Unemployment Rate': 'The number politicians love or hate depending on who\'s in power.',
    'Retail Sales': 'The thermometer of how much people are burning on their credit cards.',
    'PMI': 'PMI: Are purchasing managers optimistic or already updating their resumes?',
  },
  es: {
    'Non-Farm Payrolls': 'El día que todo el mercado finge entender el empleo en EEUU.',
    'CPI': 'Inflación: cuando tu dinero decide adelgazar solo.',
    'FOMC': 'El día que un viejo decide el destino de tu portafolio.',
    'GDP': 'PIB: la nota del boletín de la economía. Spoiler: casi siempre decepcionante.',
    'Interest Rate Decision': 'Tasa sube? Renta fija sonríe. Tasa baja? Bolsa de fiesta. Tasa igual? Todos se quejan.',
    'Unemployment Rate': 'El número que los políticos aman u odian dependiendo de quién está en el poder.',
    'Retail Sales': 'El termómetro de cuánto la gente está quemando la tarjeta.',
    'PMI': 'PMI: ¿Los gerentes de compras están optimistas o ya enviaron su currículum?',
  },
};

export function getImpactEmoji(impact: 'high' | 'medium' | 'low'): string {
  const emojis = IMPACT_EMOJIS[impact];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

export function getHumorNote(eventName: string, locale: string): string | undefined {
  const localeNotes = HUMOR_NOTES[locale] || HUMOR_NOTES['pt'];
  for (const [key, note] of Object.entries(localeNotes)) {
    if (eventName.toLowerCase().includes(key.toLowerCase())) {
      return note;
    }
  }
  return undefined;
}

// Sample data - in production this would come from an API (e.g., Investing.com API, TradingEconomics)
export function getSampleCalendarEvents(): CalendarEvent[] {
  return [
    {
      id: '1',
      time: '09:30',
      country: 'Estados Unidos',
      countryCode: 'US',
      event: 'Non-Farm Payrolls',
      impact: 'high',
      previous: '256K',
      forecast: '170K',
      actual: undefined,
    },
    {
      id: '2',
      time: '09:30',
      country: 'Estados Unidos',
      countryCode: 'US',
      event: 'Unemployment Rate',
      impact: 'high',
      previous: '4.1%',
      forecast: '4.1%',
      actual: undefined,
    },
    {
      id: '3',
      time: '11:00',
      country: 'Estados Unidos',
      countryCode: 'US',
      event: 'ISM Manufacturing PMI',
      impact: 'medium',
      previous: '49.3',
      forecast: '49.8',
      actual: undefined,
    },
    {
      id: '4',
      time: '06:00',
      country: 'Zona do Euro',
      countryCode: 'EU',
      event: 'CPI (YoY)',
      impact: 'high',
      previous: '2.4%',
      forecast: '2.3%',
      actual: undefined,
    },
    {
      id: '5',
      time: '10:00',
      country: 'Brasil',
      countryCode: 'BR',
      event: 'Interest Rate Decision (Selic)',
      impact: 'high',
      previous: '13.25%',
      forecast: '13.25%',
      actual: undefined,
    },
    {
      id: '6',
      time: '08:00',
      country: 'Brasil',
      countryCode: 'BR',
      event: 'Retail Sales (MoM)',
      impact: 'medium',
      previous: '0.3%',
      forecast: '0.5%',
      actual: undefined,
    },
    {
      id: '7',
      time: '07:30',
      country: 'Japão',
      countryCode: 'JP',
      event: 'GDP (QoQ)',
      impact: 'medium',
      previous: '0.3%',
      forecast: '0.4%',
      actual: undefined,
    },
    {
      id: '8',
      time: '03:30',
      country: 'China',
      countryCode: 'CN',
      event: 'Manufacturing PMI',
      impact: 'low',
      previous: '50.1',
      forecast: '50.0',
      actual: undefined,
    },
  ];
}
