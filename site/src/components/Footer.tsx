'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dollar-900 text-cream-200 mt-16">
      <div className="max-w-content mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-serif text-headline-md text-cream-50 mb-2">
              DINHEIROLOGIA
            </h2>
            <p className="font-sans text-body-sm text-cream-300 mb-4">
              {t('tagline')}
            </p>
            <p className="font-sans text-caption text-cream-400">
              {t('disclaimer')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-sans text-body-sm uppercase tracking-wider text-cream-400 mb-4">
              {nav('home')}
            </h3>
            <ul className="space-y-2">
              <li><Link href="/?cat=mercados" className="font-sans text-body-sm text-cream-300 hover:text-gold-light transition-colors">{nav('markets')}</Link></li>
              <li><Link href="/?cat=trading" className="font-sans text-body-sm text-cream-300 hover:text-gold-light transition-colors">{nav('trading')}</Link></li>
              <li><Link href="/?cat=investimentos" className="font-sans text-body-sm text-cream-300 hover:text-gold-light transition-colors">{nav('investments')}</Link></li>
              <li><Link href="/?cat=negocios" className="font-sans text-body-sm text-cream-300 hover:text-gold-light transition-colors">{nav('business')}</Link></li>
              <li><Link href="/calendario" className="font-sans text-body-sm text-cream-300 hover:text-gold-light transition-colors">{nav('calendar')}</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-sans text-body-sm uppercase tracking-wider text-cream-400 mb-4">
              {nav('about')}
            </h3>
            <p className="font-sans text-body-sm text-cream-300 mb-4">
              Est. 2008
            </p>
            <Link href="/sobre" className="font-sans text-body-sm text-gold-light hover:text-gold transition-colors">
              {nav('about')} →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dollar-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-caption text-cream-500">
            &copy; {year} Dinheirologia. {t('rights')}.
          </p>
          <p className="font-sans text-caption text-cream-500 italic">
            &ldquo;Um homem precisa ser gentil, controlado, mas precisa representar perigo tambem.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
