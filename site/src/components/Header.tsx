'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';

const NAV_ITEMS = [
  { key: 'markets', href: '/?cat=mercados' },
  { key: 'trading', href: '/?cat=trading' },
  { key: 'investments', href: '/?cat=investimentos' },
  { key: 'business', href: '/?cat=negocios' },
  { key: 'calendar', href: '/calendario' },
] as const;

const LOCALES = [
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const today = new Date().toLocaleDateString(locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-paper-white border-b-3 border-navy-900">
      {/* Top bar */}
      <div className="max-w-content mx-auto px-4 py-2 flex items-center justify-between text-caption font-sans text-navy-500">
        <time className="capitalize">{today}</time>
        <div className="flex items-center gap-3">
          {LOCALES.map((loc) => (
            <Link
              key={loc.code}
              href={pathname}
              locale={loc.code}
              className={`px-2 py-0.5 transition-colors ${
                locale === loc.code
                  ? 'bg-navy-900 text-cream-50'
                  : 'hover:bg-cream-100 text-navy-500'
              }`}
            >
              {loc.flag} {loc.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Masthead */}
      <div className="max-w-content mx-auto px-4 py-6 text-center border-t border-b border-rule-gray">
        <Link href="/" className="inline-block">
          <h1 className="font-serif text-headline-xl text-navy-900 tracking-tight">
            DINHEIROLOGIA
          </h1>
          <p className="font-sans text-caption uppercase tracking-[0.3em] text-navy-500 mt-1">
            {locale === 'pt' ? 'Mercado Financeiro Sem Frescura' :
             locale === 'en' ? 'No-BS Financial Markets' :
             'Mercados Financieros Sin Rodeos'}
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="max-w-content mx-auto px-4">
        {/* Desktop nav */}
        <ul className="hidden md:flex items-center justify-center gap-0 border-b border-rule-gray">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="block px-5 py-3 font-sans text-body-sm uppercase tracking-wider text-navy-700 hover:bg-cream-50 hover:text-navy-900 transition-colors border-b-2 border-transparent hover:border-salmon-500"
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <div className="md:hidden flex justify-center py-2 border-b border-rule-gray">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="font-sans text-body-sm uppercase tracking-wider text-navy-700 px-4 py-2"
            aria-label="Menu"
          >
            {mobileOpen ? '✕ Fechar' : '☰ Menu'}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <ul className="md:hidden border-b border-rule-gray">
            {NAV_ITEMS.map((item) => (
              <li key={item.key} className="border-b border-cream-200 last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-5 py-3 font-sans text-body-sm uppercase tracking-wider text-navy-700 hover:bg-cream-50"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
