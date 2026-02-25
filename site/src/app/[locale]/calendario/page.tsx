import { getTranslations } from 'next-intl/server';
import CalendarTable from '@/components/CalendarTable';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    pt: 'Calendário Econômico | Dinheirologia',
    en: 'Economic Calendar | Dinheirologia',
    es: 'Calendario Económico | Dinheirologia',
  };
  const descriptions: Record<string, string> = {
    pt: 'Calendário econômico com humor: os indicadores que fazem o mercado tremer, explicados sem frescura.',
    en: 'Economic calendar with humor: the indicators that shake the market, explained without BS.',
    es: 'Calendario económico con humor: los indicadores que sacuden el mercado, explicados sin rodeos.',
  };
  return {
    title: titles[locale] || titles.pt,
    description: descriptions[locale] || descriptions.pt,
  };
}

export default async function CalendarioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'calendar' });

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-headline-xl text-navy-900 mb-3">
          {t('title')}
        </h1>
        <p className="font-body text-body-lg text-navy-500 italic mb-4">
          {t('subtitle')}
        </p>
      </div>

      {/* Impact Legend */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 bg-cream-100 rounded-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥💀☢️</span>
          <span className="font-sans text-body-sm text-navy-700">{t('impactHigh')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">😬👀⚡</span>
          <span className="font-sans text-body-sm text-navy-700">{t('impactMedium')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">😴💤🥱</span>
          <span className="font-sans text-body-sm text-navy-700">{t('impactLow')}</span>
        </div>
      </div>

      {/* Dynamic Calendar Table (client-side for real-time dates) */}
      <CalendarTable />

      {/* Fun disclaimer */}
      <div className="mt-8 p-4 bg-cream-100 border-l-3 border-gold text-center">
        <p className="font-sans text-body-sm text-navy-500 italic">
          {locale === 'pt'
            ? '⚠️ Os emojis de impacto são nossa opinião (altamente científica e baseada em anos de experiência gritando com a tela). Não nos processe.'
            : locale === 'en'
            ? '⚠️ Impact emojis are our opinion (highly scientific and based on years of yelling at screens). Don\'t sue us.'
            : '⚠️ Los emojis de impacto son nuestra opinión (altamente científica y basada en años de gritar a la pantalla). No nos demande.'}
        </p>
      </div>
    </div>
  );
}
