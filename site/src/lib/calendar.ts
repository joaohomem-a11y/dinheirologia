import type { CalendarEvent } from '@/types/article';

// ─── Emoji & Humor ───────────────────────────────────────────────
// Only 3 emojis per level — must match the legend in the page header

const IMPACT_EMOJIS = {
  high: ['🔥', '💀', '☢️'],
  medium: ['😬', '👀', '⚡'],
  low: ['😴', '💤', '🥱'],
};

const HUMOR_NOTES: Record<string, Record<string, string>> = {
  pt: {
    'Non-Farm Payrolls': 'O dia que o mercado inteiro finge que entende de emprego nos EUA.',
    'CPI': 'Inflacao: quando seu dinheiro decide emagrecer sozinho.',
    'FOMC': 'O dia que um velho decide o destino das suas acoes.',
    'GDP': 'PIB: a nota do boletim da economia. Spoiler: quase sempre decepcionante.',
    'Selic': 'Selic subiu? Renda fixa sorri. Selic caiu? Bolsa faz a festa. Selic parada? Todo mundo reclama.',
    'Unemployment': 'Taxa de desemprego: o numero que politicos amam ou odeiam dependendo de quem esta no poder.',
    'Retail Sales': 'Vendas no varejo: o termometro de quanto a galera esta torrando no cartao.',
    'PMI': 'PMI: os gerentes de compras estao otimistas ou ja mandaram o curriculo?',
    'IPCA': 'IPCA: o numero que faz o brasileiro chorar todo mes.',
    'Jobless Claims': 'Pedidos de seguro desemprego: o termometro semanal do mercado de trabalho gringo.',
    'Consumer Confidence': 'Confianca do consumidor: o quanto a galera ta disposta a torrar o cartao.',
    'PCE': 'PCE: o indicador de inflacao favorito do Fed. Sim, eles tem um favorito.',
    'IGP-M': 'IGP-M: o indice que define quanto seu aluguel vai subir. Reze.',
    'JOLTS': 'JOLTS: quantas vagas de emprego estao abertas nos EUA. Spoiler: sempre mais do que gente qualificada.',
    'Durable Goods': 'Bens duraveis: o quanto a galera esta comprando coisas que duram (ou deveriam durar).',
    'CAGED': 'CAGED: o placar do emprego formal no Brasil. Torce pro numero ser positivo.',
    'Trade Balance': 'Balanca comercial: exportamos mais do que importamos? Spoiler: depende do preco da soja.',
    'Housing': 'Mercado imobiliario: onde seu sonho da casa propria vira pesadelo financeiro.',
    'Beige Book': 'Beige Book: o diario do Fed sobre como a economia esta indo. Spoiler: "moderadamente".',
  },
  en: {
    'Non-Farm Payrolls': 'The day the entire market pretends to understand US employment.',
    'CPI': 'Inflation: when your money decides to go on a diet by itself.',
    'FOMC': 'The day an old man decides the fate of your portfolio.',
    'GDP': 'GDP: the economy\'s report card. Spoiler: almost always disappointing.',
    'Selic': 'Rate up? Fixed income smiles. Rate down? Stocks party. Rate unchanged? Everyone complains.',
    'Unemployment': 'The number politicians love or hate depending on who\'s in power.',
    'Retail Sales': 'The thermometer of how much people are burning on their credit cards.',
    'PMI': 'PMI: Are purchasing managers optimistic or already updating their resumes?',
    'IPCA': 'IPCA: the number that makes Brazilians cry every month.',
    'Jobless Claims': 'Weekly jobless claims: the labor market thermometer.',
    'Consumer Confidence': 'Consumer confidence: how willing people are to max out their cards.',
    'PCE': 'PCE: the Fed\'s favorite inflation gauge. Yes, they have a favorite.',
    'IGP-M': 'IGP-M: the index that decides how much your rent goes up. Pray.',
    'JOLTS': 'JOLTS: how many job openings exist in the US. Spoiler: always more than qualified people.',
    'Durable Goods': 'Durable goods: how much people are buying things that last (or should last).',
    'CAGED': 'CAGED: Brazil\'s formal employment scoreboard. Hope the number is positive.',
    'Trade Balance': 'Trade balance: did we export more than we imported? Spoiler: depends on soybean prices.',
    'Housing': 'Housing market: where the dream of homeownership becomes a financial nightmare.',
    'Beige Book': 'Beige Book: the Fed\'s diary on how the economy is doing. Spoiler: "moderately".',
  },
  es: {
    'Non-Farm Payrolls': 'El dia que todo el mercado finge entender el empleo en EEUU.',
    'CPI': 'Inflacion: cuando tu dinero decide adelgazar solo.',
    'FOMC': 'El dia que un viejo decide el destino de tu portafolio.',
    'GDP': 'PIB: la nota del boletin de la economia. Spoiler: casi siempre decepcionante.',
    'Selic': 'Tasa sube? Renta fija sonrie. Tasa baja? Bolsa de fiesta. Tasa igual? Todos se quejan.',
    'Unemployment': 'El numero que los politicos aman u odian dependiendo de quien esta en el poder.',
    'Retail Sales': 'El termometro de cuanto la gente esta quemando la tarjeta.',
    'PMI': 'PMI: Los gerentes de compras estan optimistas o ya enviaron su curriculum?',
    'IPCA': 'IPCA: el numero que hace llorar a los brasilenos cada mes.',
    'Jobless Claims': 'Pedidos de seguro desempleo: termometro semanal del mercado laboral.',
    'Consumer Confidence': 'Confianza del consumidor: cuanto la gente esta dispuesta a gastar.',
    'PCE': 'PCE: el indicador de inflacion favorito del Fed. Si, tienen uno favorito.',
    'IGP-M': 'IGP-M: el indice que decide cuanto sube tu alquiler. Reza.',
    'JOLTS': 'JOLTS: cuantas vacantes hay en EEUU. Spoiler: siempre mas que gente calificada.',
    'Durable Goods': 'Bienes duraderos: cuanto la gente esta comprando cosas que duran (o deberian durar).',
    'CAGED': 'CAGED: el marcador del empleo formal en Brasil. Reza para que sea positivo.',
    'Trade Balance': 'Balanza comercial: exportamos mas de lo que importamos? Spoiler: depende del precio de la soja.',
    'Housing': 'Mercado inmobiliario: donde el sueno de la casa propia se vuelve pesadilla financiera.',
    'Beige Book': 'Beige Book: el diario del Fed sobre la economia. Spoiler: "moderadamente".',
  },
};

export function getImpactEmoji(impact: 'high' | 'medium' | 'low', seed?: string): string {
  const emojis = IMPACT_EMOJIS[impact];
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    return emojis[Math.abs(hash) % emojis.length];
  }
  return emojis[0];
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

// ─── Country names ───────────────────────────────────────────────

const COUNTRIES: Record<string, Record<string, string>> = {
  US: { pt: 'Estados Unidos', en: 'United States', es: 'Estados Unidos' },
  BR: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' },
  EU: { pt: 'Zona do Euro', en: 'Eurozone', es: 'Zona Euro' },
  JP: { pt: 'Japao', en: 'Japan', es: 'Japon' },
  CN: { pt: 'China', en: 'China', es: 'China' },
  GB: { pt: 'Reino Unido', en: 'United Kingdom', es: 'Reino Unido' },
  DE: { pt: 'Alemanha', en: 'Germany', es: 'Alemania' },
};

export function getCountryName(code: string, locale: string): string {
  return COUNTRIES[code]?.[locale] || COUNTRIES[code]?.pt || code;
}

// ─── Helpers ─────────────────────────────────────────────────────

function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function getBusinessDayOfMonth(date: Date): number {
  if (!isWeekday(date)) return -1;
  let count = 0;
  for (let d = 1; d <= date.getDate(); d++) {
    const test = new Date(date.getFullYear(), date.getMonth(), d);
    if (isWeekday(test)) count++;
  }
  return count;
}

function isFirstFridayOfMonth(date: Date): boolean {
  return date.getDay() === 5 && date.getDate() <= 7;
}

function isLastWeekOfMonth(date: Date): boolean {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return date.getDate() > nextMonth.getDate() - 7;
}

function seedRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function vary(base: number, variance: number, seed: number, decimals: number = 1): string {
  const r = seedRandom(seed);
  return (base + (r - 0.5) * 2 * variance).toFixed(decimals);
}

function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ─── Event templates ─────────────────────────────────────────────

interface EventTemplate {
  event: string;
  countryCode: string;
  time: string; // BRT (GMT-3)
  impact: 'high' | 'medium' | 'low';
  matches: (date: Date, bizDay: number) => boolean;
  previous: (seed: number) => string;
  forecast: (seed: number) => string;
}

const EVENTS: EventTemplate[] = [

  // ════════════════════════════════════════════════════════════════
  // WEEKLY RECURRING (every week, same day)
  // ════════════════════════════════════════════════════════════════

  // ── Monday ─────────────────────────────────────────────────────
  { event: 'S&P Global Manufacturing PMI (Flash)', countryCode: 'US', time: '11:45', impact: 'medium',
    matches: (d, bd) => d.getDay() === 1 && bd >= 15 && bd <= 17,
    previous: (s) => vary(51.2, 1.0, s), forecast: (s) => vary(51.0, 0.8, s + 1) },
  { event: 'Chicago Fed National Activity Index', countryCode: 'US', time: '10:30', impact: 'low',
    matches: (d, bd) => d.getDay() === 1 && bd >= 15,
    previous: (s) => vary(0.05, 0.2, s, 2), forecast: (s) => vary(0.03, 0.15, s + 1, 2) },

  // ── Tuesday ────────────────────────────────────────────────────
  { event: 'Redbook Retail Sales (YoY)', countryCode: 'US', time: '10:55', impact: 'low',
    matches: (d) => d.getDay() === 2,
    previous: (s) => vary(5.8, 1.0, s) + '%', forecast: (s) => vary(5.6, 0.8, s + 1) + '%' },
  { event: 'S&P/Case-Shiller Home Prices (YoY)', countryCode: 'US', time: '11:00', impact: 'low',
    matches: (d, bd) => d.getDay() === 2 && bd >= 17 && bd <= 20,
    previous: (s) => vary(4.5, 1.0, s) + '%', forecast: (s) => vary(4.3, 0.8, s + 1) + '%' },
  { event: 'Richmond Fed Manufacturing Index', countryCode: 'US', time: '12:00', impact: 'low',
    matches: (d, bd) => d.getDay() === 2 && bd >= 17 && bd <= 20,
    previous: (s) => vary(-2, 6, s, 0), forecast: (s) => vary(-1, 5, s + 1, 0) },

  // ── Wednesday ──────────────────────────────────────────────────
  { event: 'MBA Mortgage Applications (WoW)', countryCode: 'US', time: '09:00', impact: 'low',
    matches: (d) => d.getDay() === 3,
    previous: (s) => vary(-1.5, 4.0, s) + '%', forecast: () => '—' },
  { event: 'EIA Crude Oil Inventories', countryCode: 'US', time: '12:30', impact: 'low',
    matches: (d) => d.getDay() === 3,
    previous: (s) => vary(1.2, 3.5, s, 1) + 'M bbl', forecast: (s) => vary(0.8, 2.0, s + 1, 1) + 'M bbl' },
  { event: 'EIA Natural Gas Storage', countryCode: 'US', time: '12:30', impact: 'low',
    matches: (d) => d.getDay() === 3,
    previous: (s) => vary(-80, 40, s, 0) + 'B cf', forecast: (s) => vary(-75, 35, s + 1, 0) + 'B cf' },

  // ── Thursday ───────────────────────────────────────────────────
  { event: 'Initial Jobless Claims', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (d) => d.getDay() === 4,
    previous: (s) => vary(218, 15, s, 0) + 'K', forecast: (s) => vary(220, 12, s + 1, 0) + 'K' },
  { event: 'Continuing Jobless Claims', countryCode: 'US', time: '10:30', impact: 'low',
    matches: (d) => d.getDay() === 4,
    previous: (s) => vary(1870, 40, s, 0) + 'K', forecast: (s) => vary(1880, 35, s + 1, 0) + 'K' },

  // ── Friday ─────────────────────────────────────────────────────
  { event: 'Baker Hughes Oil Rig Count', countryCode: 'US', time: '15:00', impact: 'low',
    matches: (d) => d.getDay() === 5,
    previous: (s) => vary(480, 15, s, 0), forecast: () => '—' },

  // ════════════════════════════════════════════════════════════════
  // MONTHLY: FIRST WEEK (BD 1-5)
  // ════════════════════════════════════════════════════════════════

  // BD1
  { event: 'ISM Manufacturing PMI', countryCode: 'US', time: '12:00', impact: 'high',
    matches: (_, bd) => bd === 1,
    previous: (s) => vary(49.5, 1.5, s), forecast: (s) => vary(49.8, 1.2, s + 1) },
  { event: 'Caixin Manufacturing PMI', countryCode: 'CN', time: '06:45', impact: 'medium',
    matches: (_, bd) => bd === 1,
    previous: (s) => vary(50.2, 0.8, s), forecast: (s) => vary(50.1, 0.6, s + 1) },
  { event: 'CPI Flash Estimate (YoY)', countryCode: 'EU', time: '08:00', impact: 'high',
    matches: (_, bd) => bd === 1,
    previous: (s) => vary(2.4, 0.3, s) + '%', forecast: (s) => vary(2.3, 0.3, s + 1) + '%' },
  { event: 'JOLT Job Openings', countryCode: 'US', time: '12:00', impact: 'medium',
    matches: (_, bd) => bd === 1,
    previous: (s) => vary(7.6, 0.4, s) + 'M', forecast: (s) => vary(7.5, 0.3, s + 1) + 'M' },

  // BD2
  { event: 'ISM Services PMI', countryCode: 'US', time: '12:00', impact: 'high',
    matches: (_, bd) => bd === 2,
    previous: (s) => vary(54.0, 1.5, s), forecast: (s) => vary(53.8, 1.2, s + 1) },
  { event: 'Factory Orders (MoM)', countryCode: 'US', time: '12:00', impact: 'low',
    matches: (_, bd) => bd === 2,
    previous: (s) => vary(-0.5, 1.5, s) + '%', forecast: (s) => vary(-0.2, 1.2, s + 1) + '%' },
  { event: 'EU GDP (QoQ) - Flash', countryCode: 'EU', time: '08:00', impact: 'medium',
    matches: (_, bd) => bd === 2,
    previous: (s) => vary(0.2, 0.15, s) + '%', forecast: (s) => vary(0.2, 0.12, s + 1) + '%' },

  // BD3
  { event: 'ADP Employment Change', countryCode: 'US', time: '10:15', impact: 'medium',
    matches: (_, bd) => bd === 3,
    previous: (s) => vary(150, 40, s, 0) + 'K', forecast: (s) => vary(145, 35, s + 1, 0) + 'K' },
  { event: 'Trade Balance', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 3,
    previous: (s) => vary(-68.5, 5.0, s) + 'B', forecast: (s) => vary(-67.0, 4.0, s + 1) + 'B' },
  { event: 'Caixin Services PMI', countryCode: 'CN', time: '06:45', impact: 'low',
    matches: (_, bd) => bd === 3,
    previous: (s) => vary(52.0, 1.0, s), forecast: (s) => vary(51.8, 0.8, s + 1) },

  // BD4
  { event: 'Trade Balance', countryCode: 'BR', time: '15:00', impact: 'medium',
    matches: (_, bd) => bd === 4,
    previous: (s) => '$' + vary(6.5, 2.0, s) + 'B', forecast: (s) => '$' + vary(7.0, 1.5, s + 1) + 'B' },
  { event: 'Industrial Production (MoM)', countryCode: 'DE', time: '05:00', impact: 'low',
    matches: (_, bd) => bd === 4,
    previous: (s) => vary(-0.3, 1.0, s) + '%', forecast: (s) => vary(0.1, 0.8, s + 1) + '%' },

  // First Friday: NFP + Unemployment
  { event: 'Non-Farm Payrolls', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (d) => isFirstFridayOfMonth(d),
    previous: (s) => vary(200, 50, s, 0) + 'K', forecast: (s) => vary(180, 40, s + 1, 0) + 'K' },
  { event: 'Unemployment Rate', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (d) => isFirstFridayOfMonth(d),
    previous: () => '4.1%', forecast: () => '4.1%' },
  { event: 'Average Hourly Earnings (MoM)', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (d) => isFirstFridayOfMonth(d),
    previous: (s) => vary(0.3, 0.1, s) + '%', forecast: (s) => vary(0.3, 0.08, s + 1) + '%' },

  // BD5
  { event: 'Consumer Credit', countryCode: 'US', time: '17:00', impact: 'low',
    matches: (_, bd) => bd === 5,
    previous: (s) => '$' + vary(12.0, 5.0, s) + 'B', forecast: (s) => '$' + vary(14.0, 4.0, s + 1) + 'B' },

  // ════════════════════════════════════════════════════════════════
  // MONTHLY: SECOND WEEK (BD 6-10)
  // ════════════════════════════════════════════════════════════════

  // BD6-7: IPCA (Brazil)
  { event: 'IPCA (MoM)', countryCode: 'BR', time: '09:00', impact: 'high',
    matches: (_, bd) => bd === 6,
    previous: (s) => vary(0.50, 0.15, s) + '%', forecast: (s) => vary(0.48, 0.12, s + 1) + '%' },
  { event: 'IPCA (YoY)', countryCode: 'BR', time: '09:00', impact: 'high',
    matches: (_, bd) => bd === 6,
    previous: (s) => vary(4.56, 0.3, s) + '%', forecast: (s) => vary(4.50, 0.25, s + 1) + '%' },

  // BD7
  { event: 'CAGED Net Payroll Jobs', countryCode: 'BR', time: '14:30', impact: 'medium',
    matches: (_, bd) => bd === 7,
    previous: (s) => vary(120, 50, s, 0) + 'K', forecast: (s) => vary(130, 40, s + 1, 0) + 'K' },
  { event: 'NFIB Small Business Optimism', countryCode: 'US', time: '08:00', impact: 'low',
    matches: (_, bd) => bd === 7,
    previous: (s) => vary(100.5, 2.0, s), forecast: (s) => vary(100.2, 1.5, s + 1) },

  // BD8: CPI (US)
  { event: 'CPI (YoY)', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (_, bd) => bd === 8,
    previous: (s) => vary(3.0, 0.3, s) + '%', forecast: (s) => vary(2.9, 0.3, s + 1) + '%' },
  { event: 'CPI (MoM)', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (_, bd) => bd === 8,
    previous: (s) => vary(0.35, 0.1, s) + '%', forecast: (s) => vary(0.30, 0.08, s + 1) + '%' },
  { event: 'Core CPI (MoM)', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (_, bd) => bd === 8,
    previous: (s) => vary(0.28, 0.06, s) + '%', forecast: (s) => vary(0.25, 0.05, s + 1) + '%' },

  // BD9: PPI (US)
  { event: 'PPI (MoM)', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 9,
    previous: (s) => vary(0.3, 0.15, s) + '%', forecast: (s) => vary(0.2, 0.12, s + 1) + '%' },
  { event: 'PPI (YoY)', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 9,
    previous: (s) => vary(3.3, 0.3, s) + '%', forecast: (s) => vary(3.2, 0.25, s + 1) + '%' },
  { event: 'EU Industrial Production (MoM)', countryCode: 'EU', time: '08:00', impact: 'low',
    matches: (_, bd) => bd === 9,
    previous: (s) => vary(-0.1, 0.8, s) + '%', forecast: (s) => vary(0.2, 0.6, s + 1) + '%' },

  // BD10
  { event: 'Import/Export Price Index (MoM)', countryCode: 'US', time: '10:30', impact: 'low',
    matches: (_, bd) => bd === 10,
    previous: (s) => vary(0.1, 0.3, s) + '%', forecast: (s) => vary(0.0, 0.25, s + 1) + '%' },

  // ════════════════════════════════════════════════════════════════
  // MONTHLY: THIRD WEEK (BD 11-15)
  // ════════════════════════════════════════════════════════════════

  // BD11: Retail Sales
  { event: 'Retail Sales (MoM)', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (_, bd) => bd === 11,
    previous: (s) => vary(0.4, 0.3, s) + '%', forecast: (s) => vary(0.3, 0.25, s + 1) + '%' },
  { event: 'Retail Sales ex Autos (MoM)', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 11,
    previous: (s) => vary(0.2, 0.2, s) + '%', forecast: (s) => vary(0.2, 0.15, s + 1) + '%' },
  { event: 'PMC Retail Sales (MoM)', countryCode: 'BR', time: '09:00', impact: 'medium',
    matches: (_, bd) => bd === 11,
    previous: (s) => vary(0.4, 0.5, s) + '%', forecast: (s) => vary(0.3, 0.4, s + 1) + '%' },

  // BD12: Industrial Production + Housing
  { event: 'Industrial Production (MoM)', countryCode: 'US', time: '11:15', impact: 'medium',
    matches: (_, bd) => bd === 12,
    previous: (s) => vary(0.1, 0.3, s) + '%', forecast: (s) => vary(0.2, 0.25, s + 1) + '%' },
  { event: 'Capacity Utilization', countryCode: 'US', time: '11:15', impact: 'low',
    matches: (_, bd) => bd === 12,
    previous: (s) => vary(78.2, 0.5, s) + '%', forecast: (s) => vary(78.3, 0.4, s + 1) + '%' },
  { event: 'CPI (YoY)', countryCode: 'GB', time: '05:00', impact: 'medium',
    matches: (_, bd) => bd === 12,
    previous: (s) => vary(3.0, 0.3, s) + '%', forecast: (s) => vary(2.8, 0.3, s + 1) + '%' },

  // BD13: Housing
  { event: 'Housing Starts', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 13,
    previous: (s) => vary(1.35, 0.1, s) + 'M', forecast: (s) => vary(1.38, 0.08, s + 1) + 'M' },
  { event: 'Building Permits', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 13,
    previous: (s) => vary(1.48, 0.08, s) + 'M', forecast: (s) => vary(1.50, 0.06, s + 1) + 'M' },
  { event: 'PMS Services Sector (MoM)', countryCode: 'BR', time: '09:00', impact: 'low',
    matches: (_, bd) => bd === 13,
    previous: (s) => vary(0.3, 0.6, s) + '%', forecast: (s) => vary(0.4, 0.5, s + 1) + '%' },

  // BD14
  { event: 'Industrial Production (MoM)', countryCode: 'BR', time: '09:00', impact: 'medium',
    matches: (_, bd) => bd === 14,
    previous: (s) => vary(0.2, 0.5, s) + '%', forecast: (s) => vary(0.3, 0.4, s + 1) + '%' },
  { event: 'Beige Book', countryCode: 'US', time: '16:00', impact: 'medium',
    matches: (d, bd) => bd === 14 && d.getDay() === 3,
    previous: () => '—', forecast: () => '—' },

  // BD15
  { event: 'IBC-Br Economic Activity', countryCode: 'BR', time: '09:00', impact: 'medium',
    matches: (_, bd) => bd === 15,
    previous: (s) => vary(0.15, 0.2, s) + '%', forecast: (s) => vary(0.20, 0.18, s + 1) + '%' },
  { event: 'FGV Consumer Confidence', countryCode: 'BR', time: '08:00', impact: 'low',
    matches: (_, bd) => bd === 15,
    previous: (s) => vary(90.5, 2.0, s), forecast: (s) => vary(91.0, 1.5, s + 1) },

  // ════════════════════════════════════════════════════════════════
  // MONTHLY: FOURTH WEEK (BD 16-22)
  // ════════════════════════════════════════════════════════════════

  // BD16
  { event: 'Existing Home Sales', countryCode: 'US', time: '12:00', impact: 'medium',
    matches: (_, bd) => bd === 16,
    previous: (s) => vary(4.1, 0.3, s) + 'M', forecast: (s) => vary(4.0, 0.25, s + 1) + 'M' },
  { event: 'Leading Indicators Index', countryCode: 'US', time: '12:00', impact: 'low',
    matches: (_, bd) => bd === 16,
    previous: (s) => vary(-0.3, 0.3, s) + '%', forecast: (s) => vary(-0.2, 0.25, s + 1) + '%' },

  // BD17: IGP-M (Brazil)
  { event: 'IGP-M (MoM)', countryCode: 'BR', time: '08:00', impact: 'medium',
    matches: (_, bd) => bd === 17,
    previous: (s) => vary(0.27, 0.15, s) + '%', forecast: (s) => vary(0.30, 0.12, s + 1) + '%' },

  // BD18
  { event: 'Durable Goods Orders (MoM)', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (_, bd) => bd === 18,
    previous: (s) => vary(-0.5, 2.5, s) + '%', forecast: (s) => vary(0.3, 2.0, s + 1) + '%' },
  { event: 'Durable Goods ex Transportation (MoM)', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 18,
    previous: (s) => vary(0.1, 0.5, s) + '%', forecast: (s) => vary(0.2, 0.4, s + 1) + '%' },
  { event: 'New Home Sales', countryCode: 'US', time: '12:00', impact: 'medium',
    matches: (_, bd) => bd === 18,
    previous: (s) => vary(680, 30, s, 0) + 'K', forecast: (s) => vary(690, 25, s + 1, 0) + 'K' },

  // BD19: GDP
  { event: 'GDP (QoQ)', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (_, bd) => bd === 19,
    previous: (s) => vary(2.3, 0.5, s) + '%', forecast: (s) => vary(2.1, 0.4, s + 1) + '%' },
  { event: 'GDP Price Index (QoQ)', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 19,
    previous: (s) => vary(2.3, 0.3, s) + '%', forecast: (s) => vary(2.2, 0.25, s + 1) + '%' },

  // BD20: PCE + Personal Income/Spending
  { event: 'PCE Price Index (MoM)', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (_, bd) => bd === 20,
    previous: (s) => vary(0.25, 0.08, s) + '%', forecast: (s) => vary(0.22, 0.06, s + 1) + '%' },
  { event: 'Core PCE Price Index (MoM)', countryCode: 'US', time: '10:30', impact: 'high',
    matches: (_, bd) => bd === 20,
    previous: (s) => vary(0.28, 0.06, s) + '%', forecast: (s) => vary(0.25, 0.05, s + 1) + '%' },
  { event: 'Personal Income (MoM)', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 20,
    previous: (s) => vary(0.3, 0.15, s) + '%', forecast: (s) => vary(0.4, 0.12, s + 1) + '%' },
  { event: 'Personal Spending (MoM)', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (_, bd) => bd === 20,
    previous: (s) => vary(0.5, 0.2, s) + '%', forecast: (s) => vary(0.4, 0.15, s + 1) + '%' },

  // BD21: PNAD (Brazil)
  { event: 'PNAD Unemployment Rate', countryCode: 'BR', time: '09:00', impact: 'medium',
    matches: (_, bd) => bd === 21,
    previous: () => '6.6%', forecast: () => '6.5%' },
  { event: 'Pending Home Sales (MoM)', countryCode: 'US', time: '12:00', impact: 'low',
    matches: (_, bd) => bd === 21,
    previous: (s) => vary(-1.5, 3.0, s) + '%', forecast: (s) => vary(0.5, 2.5, s + 1) + '%' },

  // ════════════════════════════════════════════════════════════════
  // DAY-OF-WEEK EXTRAS (conditional on week of month)
  // ════════════════════════════════════════════════════════════════

  // Monday 2nd week
  { event: 'Empire State Manufacturing Index', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (d, bd) => d.getDay() === 1 && bd >= 6 && bd <= 10,
    previous: (s) => vary(-2.0, 8.0, s), forecast: (s) => vary(-1.5, 6.0, s + 1) },

  // Tuesday 4th week
  { event: 'CB Consumer Confidence', countryCode: 'US', time: '12:00', impact: 'medium',
    matches: (d, bd) => d.getDay() === 2 && bd >= 16 && bd <= 20,
    previous: (s) => vary(104.0, 3.0, s), forecast: (s) => vary(103.5, 2.5, s + 1) },

  // Thursday 3rd week
  { event: 'Philadelphia Fed Manufacturing Index', countryCode: 'US', time: '10:30', impact: 'medium',
    matches: (d, bd) => d.getDay() === 4 && bd >= 11 && bd <= 14,
    previous: (s) => vary(5.0, 10.0, s), forecast: (s) => vary(4.5, 8.0, s + 1) },

  // Friday: Michigan Consumer Sentiment (2nd and 4th Fri)
  { event: 'Michigan Consumer Sentiment', countryCode: 'US', time: '12:00', impact: 'medium',
    matches: (d) => d.getDay() === 5 && !isFirstFridayOfMonth(d) && (
      (d.getDate() >= 8 && d.getDate() <= 14) || d.getDate() >= 22
    ),
    previous: (s) => vary(67.5, 3.0, s), forecast: (s) => vary(67.0, 2.5, s + 1) },

  // ════════════════════════════════════════════════════════════════
  // CENTRAL BANK DECISIONS (specific months/weeks)
  // ════════════════════════════════════════════════════════════════

  // COPOM / Selic (Brazil)
  { event: 'COPOM Interest Rate Decision (Selic)', countryCode: 'BR', time: '18:30', impact: 'high',
    matches: (d, bd) => {
      const month = d.getMonth();
      const copomMonths = [0, 2, 4, 5, 7, 8, 10, 11];
      return copomMonths.includes(month) && bd >= 15 && bd <= 17 && d.getDay() === 3;
    },
    previous: () => '15.00%', forecast: () => '15.00%' },

  // ECB Rate Decision
  { event: 'ECB Interest Rate Decision', countryCode: 'EU', time: '10:15', impact: 'high',
    matches: (d, bd) => {
      const month = d.getMonth();
      const ecbMonths = [0, 2, 3, 5, 6, 8, 9, 11];
      return ecbMonths.includes(month) && bd >= 8 && bd <= 10 && d.getDay() === 4;
    },
    previous: () => '2.75%', forecast: () => '2.50%' },

  // FOMC (US)
  { event: 'FOMC Interest Rate Decision', countryCode: 'US', time: '16:00', impact: 'high',
    matches: (d, bd) => {
      const month = d.getMonth();
      const fomcMonths = [0, 2, 4, 5, 6, 8, 10, 11];
      return fomcMonths.includes(month) && bd >= 15 && bd <= 17 && d.getDay() === 3;
    },
    previous: () => '4.50%', forecast: () => '4.25%' },

  // BOJ (Japan)
  { event: 'BoJ Interest Rate Decision', countryCode: 'JP', time: '01:00', impact: 'high',
    matches: (d, bd) => {
      const month = d.getMonth();
      const bojMonths = [0, 2, 3, 5, 6, 8, 9, 11];
      return bojMonths.includes(month) && bd >= 12 && bd <= 14 && d.getDay() === 5;
    },
    previous: () => '0.50%', forecast: () => '0.50%' },

  // ════════════════════════════════════════════════════════════════
  // QUARTERLY EVENTS
  // ════════════════════════════════════════════════════════════════

  // China GDP (quarterly: Jan, Apr, Jul, Oct)
  { event: 'GDP (YoY)', countryCode: 'CN', time: '23:00', impact: 'high',
    matches: (d, bd) => [0, 3, 6, 9].includes(d.getMonth()) && bd >= 10 && bd <= 12 && d.getDay() === 2,
    previous: (s) => vary(5.4, 0.3, s) + '%', forecast: (s) => vary(5.0, 0.25, s + 1) + '%' },
  { event: 'Industrial Production (YoY)', countryCode: 'CN', time: '23:00', impact: 'medium',
    matches: (d, bd) => [0, 3, 6, 9].includes(d.getMonth()) && bd >= 10 && bd <= 12 && d.getDay() === 2,
    previous: (s) => vary(6.2, 0.5, s) + '%', forecast: (s) => vary(5.8, 0.4, s + 1) + '%' },

  // Japan GDP (quarterly)
  { event: 'GDP (QoQ)', countryCode: 'JP', time: '21:50', impact: 'medium',
    matches: (d, bd) => [1, 4, 7, 10].includes(d.getMonth()) && bd >= 8 && bd <= 10 && d.getDay() === 3,
    previous: (s) => vary(0.3, 0.2, s) + '%', forecast: (s) => vary(0.4, 0.15, s + 1) + '%' },

  // EU GDP final (quarterly)
  { event: 'GDP (QoQ) - Final', countryCode: 'EU', time: '08:00', impact: 'medium',
    matches: (d, bd) => [2, 5, 8, 11].includes(d.getMonth()) && bd >= 5 && bd <= 7 && d.getDay() === 4,
    previous: (s) => vary(0.2, 0.1, s) + '%', forecast: (s) => vary(0.2, 0.08, s + 1) + '%' },

  // ════════════════════════════════════════════════════════════════
  // TREASURY AUCTIONS (weekly, various days)
  // ════════════════════════════════════════════════════════════════

  { event: '2-Year Treasury Note Auction', countryCode: 'US', time: '15:00', impact: 'low',
    matches: (d, bd) => d.getDay() === 2 && bd >= 6 && bd <= 9,
    previous: (s) => vary(4.20, 0.2, s) + '%', forecast: () => '—' },
  { event: '10-Year Treasury Note Auction', countryCode: 'US', time: '15:00', impact: 'medium',
    matches: (d, bd) => d.getDay() === 3 && bd >= 6 && bd <= 9,
    previous: (s) => vary(4.35, 0.15, s) + '%', forecast: () => '—' },
  { event: '30-Year Treasury Bond Auction', countryCode: 'US', time: '15:00', impact: 'medium',
    matches: (d, bd) => d.getDay() === 4 && bd >= 6 && bd <= 9,
    previous: (s) => vary(4.55, 0.12, s) + '%', forecast: () => '—' },
];

// ─── Public API ──────────────────────────────────────────────────

export function getEventsForDate(date: Date, locale: string): CalendarEvent[] {
  if (!isWeekday(date)) return [];

  const bizDay = getBusinessDayOfMonth(date);
  const dateStr = formatDateStr(date);
  const monthSeed = date.getFullYear() * 100 + date.getMonth();

  const matched = EVENTS
    .filter((t) => t.matches(date, bizDay))
    .map((t, i) => ({
      id: `${dateStr}-${i}`,
      date: dateStr,
      time: t.time,
      country: getCountryName(t.countryCode, locale),
      countryCode: t.countryCode,
      event: t.event,
      impact: t.impact,
      previous: t.previous(monthSeed + i),
      forecast: t.forecast(monthSeed + i + 50),
    }));

  // Sort by time
  matched.sort((a, b) => a.time.localeCompare(b.time));
  return matched;
}

export function getEventsForDateRange(start: Date, end: Date, locale: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999);

  while (current <= endDate) {
    events.push(...getEventsForDate(new Date(current), locale));
    current.setDate(current.getDate() + 1);
  }
  return events;
}

export function getWeekRange(referenceDate: Date): { monday: Date; friday: Date } {
  const d = new Date(referenceDate);
  const dayOfWeek = d.getDay();

  // If weekend, use next week
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 2;
    d.setDate(d.getDate() + daysUntilMonday);
  }

  const monday = new Date(d);
  monday.setDate(d.getDate() - (d.getDay() - 1));
  monday.setHours(0, 0, 0, 0);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23, 59, 59, 999);

  return { monday, friday };
}
