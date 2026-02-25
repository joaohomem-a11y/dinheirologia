import { getTranslations } from 'next-intl/server';
import { getSampleCalendarEvents, getImpactEmoji, getHumorNote } from '@/lib/calendar';
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

const FLAG_MAP: Record<string, string> = {
  US: '🇺🇸',
  BR: '🇧🇷',
  EU: '🇪🇺',
  JP: '🇯🇵',
  CN: '🇨🇳',
  GB: '🇬🇧',
  DE: '🇩🇪',
  FR: '🇫🇷',
  CA: '🇨🇦',
  AU: '🇦🇺',
};

export default async function CalendarioPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'calendar' });
  const events = getSampleCalendarEvents();

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-serif text-headline-xl text-navy-900 mb-3">
          {t('title')}
        </h1>
        <p className="font-body text-body-lg text-navy-500 italic">
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

      {/* Date tabs */}
      <div className="flex gap-1 mb-6 border-b border-rule-gray">
        <button className="px-5 py-3 font-sans text-body-sm uppercase tracking-wider bg-navy-900 text-cream-50">
          {t('today')}
        </button>
        <button className="px-5 py-3 font-sans text-body-sm uppercase tracking-wider text-navy-500 hover:bg-cream-50 transition-colors">
          {t('tomorrow')}
        </button>
        <button className="px-5 py-3 font-sans text-body-sm uppercase tracking-wider text-navy-500 hover:bg-cream-50 transition-colors">
          {t('thisWeek')}
        </button>
      </div>

      {/* Calendar Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-navy-900">
              <th className="py-3 px-4 text-left font-sans text-caption uppercase tracking-wider text-navy-500">
                {t('time')}
              </th>
              <th className="py-3 px-4 text-left font-sans text-caption uppercase tracking-wider text-navy-500">
                {t('country')}
              </th>
              <th className="py-3 px-4 text-left font-sans text-caption uppercase tracking-wider text-navy-500">
                {t('event')}
              </th>
              <th className="py-3 px-4 text-center font-sans text-caption uppercase tracking-wider text-navy-500">
                {t('impact')}
              </th>
              <th className="py-3 px-4 text-right font-sans text-caption uppercase tracking-wider text-navy-500">
                {t('previous')}
              </th>
              <th className="py-3 px-4 text-right font-sans text-caption uppercase tracking-wider text-navy-500">
                {t('forecast')}
              </th>
              <th className="py-3 px-4 text-right font-sans text-caption uppercase tracking-wider text-navy-500">
                {t('actual')}
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const humorNote = getHumorNote(event.event, locale);
              const impactEmoji = getImpactEmoji(event.impact);
              const flag = FLAG_MAP[event.countryCode] || '🌍';

              return (
                <tr
                  key={event.id}
                  className={`border-b border-cream-200 hover:bg-cream-50 transition-colors ${
                    event.impact === 'high' ? 'bg-salmon-50/30' : ''
                  }`}
                >
                  <td className="py-4 px-4 font-sans text-body-sm text-navy-700 font-mono">
                    {event.time}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xl mr-2">{flag}</span>
                    <span className="font-sans text-body-sm text-navy-700">{event.country}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-serif text-body-md text-navy-900 font-semibold">
                        {event.event}
                      </span>
                      {humorNote && (
                        <p className="font-sans text-caption text-navy-400 italic mt-1">
                          {humorNote}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`impact-${event.impact} cursor-help`} title={event.impact}>
                      {impactEmoji}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-sans text-body-sm text-navy-600 font-mono">
                    {event.previous || '—'}
                  </td>
                  <td className="py-4 px-4 text-right font-sans text-body-sm text-navy-600 font-mono">
                    {event.forecast || '—'}
                  </td>
                  <td className="py-4 px-4 text-right font-sans text-body-sm font-mono font-bold">
                    {event.actual ? (
                      <span className={
                        parseFloat(event.actual) > parseFloat(event.forecast || '0')
                          ? 'text-green-600'
                          : parseFloat(event.actual) < parseFloat(event.forecast || '0')
                          ? 'text-red-600'
                          : 'text-navy-600'
                      }>
                        {event.actual}
                      </span>
                    ) : (
                      <span className="text-navy-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
