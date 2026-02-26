'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import MarketTicker from '@/components/MarketTicker';

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

  const today = new Date().toLocaleDateString(
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <header className="bg-paper-white">
      {/* Market ticker */}
      <MarketTicker />

      {/* Main header bar: date left | logo center | language right */}
      <div className="max-w-content mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Left: date + mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden font-sans text-body-sm text-navy-600 p-1"
              aria-label="Menu"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
            <time className="hidden sm:block font-sans text-caption text-navy-400 capitalize">
              {today}
            </time>
          </div>

          {/* Center: WSJ-style masthead */}
          <Link href="/" className="block">
            <div className="wsj-masthead py-3">
              <h1 className="font-serif text-navy-900 text-[1.6rem] sm:text-[2.2rem] lg:text-[2.8rem] leading-none tracking-[0.18em] font-bold">
                DINHEIROLOGIA.
              </h1>
            </div>
          </Link>

          {/* Right: language switcher */}
          <div className="flex items-center gap-1">
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
      </div>

      {/* Navigation bar */}
      <nav className="bg-dollar-800 border-t border-dollar-700">
        <div className="max-w-content mx-auto px-4">
          {/* Desktop nav */}
          <ul className="hidden md:flex items-center justify-center gap-0">
            <li>
              <Link
                href="/"
                className="block px-5 py-2.5 font-sans text-body-sm uppercase tracking-[0.15em] text-cream-100 hover:text-cream-50 hover:bg-dollar-700 transition-colors"
              >
                {t('home')}
              </Link>
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="block px-5 py-2.5 font-sans text-body-sm uppercase tracking-[0.15em] text-cream-100 hover:text-cream-50 hover:bg-dollar-700 transition-colors"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

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
