'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  getEventsForDate,
  getEventsForDateRange,
  getWeekRange,
  getImpactEmoji,
  getHumorNote,
} from '@/lib/calendar';

const FLAG_MAP: Record<string, string> = {
  US: '\u{1F1FA}\u{1F1F8}',
  BR: '\u{1F1E7}\u{1F1F7}',
  EU: '\u{1F1EA}\u{1F1FA}',
  JP: '\u{1F1EF}\u{1F1F5}',
  CN: '\u{1F1E8}\u{1F1F3}',
  GB: '\u{1F1EC}\u{1F1E7}',
  DE: '\u{1F1E9}\u{1F1EA}',
  FR: '\u{1F1EB}\u{1F1F7}',
  CA: '\u{1F1E8}\u{1F1E6}',
  AU: '\u{1F1E6}\u{1F1FA}',
};

type Tab = 'today' | 'tomorrow' | 'thisWeek';

function formatDateHeader(date: Date, locale: string): string {
  return date.toLocaleDateString(
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long' }
  );
}

function formatFullDate(date: Date, locale: string): string {
  return date.toLocaleDateString(
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );
}

export default function CalendarTable() {
  const t = useTranslations('calendar');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>('today');

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const tomorrow = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);

  const weekRange = useMemo(() => getWeekRange(today), [today]);

  const events = useMemo(() => {
    if (activeTab === 'today') {
      return getEventsForDate(today, locale);
    }
    if (activeTab === 'tomorrow') {
      return getEventsForDate(tomorrow, locale);
    }
    return getEventsForDateRange(weekRange.monday, weekRange.friday, locale);
  }, [activeTab, today, tomorrow, weekRange, locale]);

  // Group events by date for "This Week" view
  const groupedByDate = useMemo(() => {
    if (activeTab !== 'thisWeek') return null;
    const groups = new Map<string, typeof events>();
    for (const event of events) {
      if (!groups.has(event.date)) groups.set(event.date, []);
      groups.get(event.date)!.push(event);
    }
    return groups;
  }, [events, activeTab]);

  const dateLabel = useMemo(() => {
    if (activeTab === 'today') return formatFullDate(today, locale);
    if (activeTab === 'tomorrow') return formatFullDate(tomorrow, locale);
    return `${formatDateHeader(weekRange.monday, locale)} - ${formatDateHeader(weekRange.friday, locale)}`;
  }, [activeTab, today, tomorrow, weekRange, locale]);

  const noEventsMsg = useMemo(() => {
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;
    if (activeTab === 'today' && isWeekend) {
      if (locale === 'pt') return 'Fim de semana! Mercados fechados. Va curtir a vida (e parar de olhar cotacoes).';
      if (locale === 'es') return 'Fin de semana! Mercados cerrados. Ve a disfrutar la vida (y deja de mirar cotizaciones).';
      return 'Weekend! Markets closed. Go enjoy life (and stop checking prices).';
    }
    return t('noEvents');
  }, [activeTab, today, locale, t]);

  const renderTable = (eventList: typeof events) => (
    <table className="w-full">
      <thead>
        <tr className="border-b-2 border-dollar-800">
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
        {eventList.map((event) => {
          const humorNote = getHumorNote(event.event, locale);
          const impactEmoji = getImpactEmoji(event.impact, event.id);
          const flag = FLAG_MAP[event.countryCode] || '\u{1F30D}';

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
                {event.previous || '\u2014'}
              </td>
              <td className="py-4 px-4 text-right font-sans text-body-sm text-navy-600 font-mono">
                {event.forecast || '\u2014'}
              </td>
              <td className="py-4 px-4 text-right font-sans text-body-sm font-mono font-bold">
                <span className="text-navy-300">\u2014</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div>
      {/* Date + Timezone indicator */}
      <div className="flex items-center justify-center gap-3 font-sans text-body-sm text-navy-400 mb-6">
        <span className="font-medium text-navy-600 capitalize">{dateLabel}</span>
        <span className="text-navy-300">|</span>
        <span>
          {locale === 'pt' ? 'Horarios em BRT (Brasilia) \u00B7 GMT-3' :
           locale === 'es' ? 'Horarios en BRT (Brasilia) \u00B7 GMT-3' :
           'Times in BRT (Brasilia) \u00B7 GMT-3'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-rule-gray">
        {(['today', 'tomorrow', 'thisWeek'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-sans text-body-sm uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'bg-dollar-800 text-cream-50'
                : 'text-navy-500 hover:bg-cream-50'
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {events.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-rule-gray">
            <p className="font-body text-body-md text-navy-500 italic">
              {noEventsMsg}
            </p>
          </div>
        ) : activeTab === 'thisWeek' && groupedByDate ? (
          <div className="space-y-6">
            {Array.from(groupedByDate.entries()).map(([dateKey, dayEvents]) => {
              const d = new Date(dateKey + 'T12:00:00');
              return (
                <div key={dateKey}>
                  <h3 className="font-sans text-body-sm uppercase tracking-[0.15em] font-bold text-navy-600 bg-cream-100 px-4 py-2 mb-0 capitalize">
                    {formatDateHeader(d, locale)}
                  </h3>
                  {renderTable(dayEvents)}
                </div>
              );
            })}
          </div>
        ) : (
          renderTable(events)
        )}
      </div>
    </div>
  );
}
