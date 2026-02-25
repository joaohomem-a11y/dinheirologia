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
    <header className="bg-paper-white">
      {/* Top utility bar */}
      <div className="max-w-content mx-auto px-4 py-2 flex items-center justify-between">
        <time className="font-sans text-caption text-navy-400 capitalize">{today}</time>
        <div className="flex items-center gap-2">
          {LOCALES.map((loc) => (
            <Link
              key={loc.code}
              href={pathname}
              locale={loc.code}
              className={`px-2 py-0.5 text-caption font-sans transition-colors ${
                locale === loc.code
                  ? 'bg-dollar-700 text-cream-50'
                  : 'hover:bg-cream-100 text-navy-400'
              }`}
            >
              {loc.flag} {loc.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Newspaper masthead */}
      <div className="border-t-3 border-b-3 border-dollar-800">
        <div className="max-w-content mx-auto px-4 py-5 text-center">
          <div className="border-b border-dollar-700 mb-3 pb-3">
            <Link href="/" className="inline-block">
              <h1 className="font-serif tracking-[0.06em] text-dollar-900" style={{ fontSize: '3.8rem', lineHeight: '1' }}>
                DINHEIROLOGIA
              </h1>
            </Link>
          </div>
          <p className="font-body text-body-sm italic text-navy-400">
            {locale === 'pt' ? 'Sua leitura sobre dinheiro, sem frescuras' :
             locale === 'en' ? 'Your money read, no BS attached' :
             'Tu lectura sobre dinero, sin rodeos'}
          </p>
        </div>
      </div>

      {/* Navigation bar - dollar green */}
      <nav className="bg-dollar-800">
        <div className="max-w-content mx-auto px-4">
          {/* Desktop nav */}
          <ul className="hidden md:flex items-center justify-center gap-0">
            <li>
              <Link
                href="/"
                className="block px-5 py-3 font-sans text-body-sm uppercase tracking-[0.15em] text-cream-100 hover:text-cream-50 hover:bg-dollar-700 transition-colors"
              >
                {t('home')}
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="block px-5 py-3 font-sans text-body-sm uppercase tracking-[0.15em] text-cream-100 hover:text-cream-50 hover:bg-dollar-700 transition-colors"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <div className="md:hidden flex justify-center py-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="font-sans text-body-sm uppercase tracking-wider text-cream-100 px-4 py-2"
              aria-label="Menu"
            >
              {mobileOpen ? '✕ Fechar' : '☰ Menu'}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <ul className="md:hidden border-t border-dollar-600">
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block px-5 py-3 font-sans text-body-sm uppercase tracking-wider text-cream-100 hover:bg-dollar-700 border-b border-dollar-600"
                >
                  {t('home')}
                </Link>
              </li>
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-5 py-3 font-sans text-body-sm uppercase tracking-wider text-cream-100 hover:bg-dollar-700 border-b border-dollar-600 last:border-0"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}
