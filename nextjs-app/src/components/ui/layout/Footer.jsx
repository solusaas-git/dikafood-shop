import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '../icons/Icon';
import { useTranslation } from '../../../utils/i18n';
import translations from './translations/Footer';
import { Section } from './';
import SectionDecorations from '../decorations/SectionDecorations';

// Social media links
const SOCIAL_LINKS = [
  { icon: 'facebookLogo', href: 'https://facebook.com/dikafood', label: 'Facebook' },
  { icon: 'instagramLogo', href: 'https://instagram.com/dikafood', label: 'Instagram' },
  { icon: 'twitterLogo', href: 'https://twitter.com/dikafood', label: 'Twitter' },
];

export default function Footer() {
  const { t } = useTranslation(translations);
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call an API to add the email to your newsletter list
    setSubscribed(true);
    setEmail('');
  };

  return (
    <Section
      background="gradient"
      backgroundGradient="brandGreen"
      overlayType="vignette"
      padding="large"
      width="full"
      className="text-white relative overflow-hidden"
    >
      {/* Footer decoration */}
      <SectionDecorations
        variant="white"
        positions={['bottom-right']}
        customStyles={{
          bottomRight: {
            opacity: 0.15,
            transform: 'translate(30px, 30px) scale(1.2)'
          }
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div>
            <Link href="/">
              <img
                src="/images/logo-light.svg"
                alt="DikaFood Logo"
                className="h-12 mb-4"
              />
            </Link>
            <p className="text-white/90 mb-4 max-w-sm text-sm">
              {t('mission')}
            </p>

            {/* Social media links */}
            <div className="flex space-x-4 mt-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white hover:text-dark-yellow-1 transition-colors"
                >
                  <Icon name={social.icon} size="md" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="mb-4 pb-2 border-b border-white/10">
              <h4 className="font-medium text-white text-lg">{t('section_navigation')}</h4>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Link href="/" className="text-white/90 hover:text-dark-yellow-1 transition-colors text-sm">
                {t('nav_home')}
              </Link>
              <Link href="/about" className="text-white/90 hover:text-dark-yellow-1 transition-colors text-sm">
                {t('nav_about')}
              </Link>
              <Link href="/shop" className="text-white/90 hover:text-dark-yellow-1 transition-colors text-sm">
                {t('products_viewall')}
              </Link>
              <Link href="/contact" className="text-white/90 hover:text-dark-yellow-1 transition-colors text-sm">
                {t('nav_contact')}
              </Link>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <div className="mb-4 pb-2 border-b border-white/10">
              <h4 className="font-medium text-white text-lg">{t('newsletter_title')}</h4>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10 relative overflow-hidden">
              {/* Diagonal lines texture */}
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 10px)',
                  backgroundSize: '20px 20px'
                }}
              ></div>

              {/* Subtle glow effect */}
              <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-dark-yellow-1/10 rounded-full"></div>

              <div className="relative z-10">
                <p className="text-white/90 mb-4 text-sm">
                  {t('newsletter_text')}
                </p>

                {subscribed ? (
                  <div className="bg-dark-yellow-1/20 p-3 rounded-full border border-dark-yellow-1/30 mt-2">
                    <p className="text-white text-sm">{t('subscribe_success')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('email_placeholder')}
                        required
                        className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-logo-lime/50 w-full sm:flex-1"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2 bg-logo-lime text-dark-green-7 rounded-full font-medium hover:bg-logo-lime/90 transition-colors whitespace-nowrap shadow-sm flex items-center justify-center gap-2"
                      >
                        <span>{t('subscribe')}</span>
                        <Icon name="envelope" size="sm" className="inline-block" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Copyright and links */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-baseline pt-8 mt-8 border-t border-white/10 text-sm">
          <p className="text-white/80 mb-2 md:mb-0">© {currentYear} Dikafood. {t('copyright')}</p>
          <div className="flex space-x-4">
            <Link href="/terms" className="text-white/80 hover:text-dark-yellow-1 transition-colors">
              {t('legal_terms')}
            </Link>
            <span className="text-white/50">·</span>
            <Link href="/privacy" className="text-white/80 hover:text-dark-yellow-1 transition-colors">
              {t('legal_privacy')}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}