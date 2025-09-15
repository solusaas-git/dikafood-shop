import React from 'react';
import { Accordion } from '@/components/ui/data-display';
import { Question } from "@phosphor-icons/react";
import SectionHeader from '@/components/ui/layout/SectionHeader';
import { useTranslation } from '../../../utils/i18n';
import translations from './translations/FAQSection';
import SectionDecorations from '../../ui/decorations/SectionDecorations';

export default function FAQSection() {
  const { t, locale } = useTranslation(translations);

  // Create FAQ items dynamically from translations
  const items = Array.from({ length: 6 }, (_, i) => {
    const index = i + 1;
    return {
      title: t(`faq.${index}.title`),
      content: locale === 'fr' || locale === 'en' ? (
        // For Latin scripts, process newlines as line breaks
        t(`faq.${index}.content`).split('\n\n').map((paragraph, pIndex) => (
          <p key={pIndex} className="mb-4 last:mb-0">
            {paragraph.split('\n').map((line, lIndex) => (
              <React.Fragment key={lIndex}>
                {line.startsWith('•') ? (
                  <span className="text-white font-medium block mb-2">{line}</span>
                ) : line}
                {lIndex < paragraph.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        ))
      ) : (
        // For Arabic, slightly different layout
        <p className="text-right">
          {t(`faq.${index}.content`).split('\n\n').map((paragraph, pIndex) => (
            <React.Fragment key={pIndex}>
              {paragraph.split('\n').map((line, lIndex) => (
                <React.Fragment key={lIndex}>
                  {line.startsWith('•') ? (
                    <span className="text-white font-medium block mb-2">{line}</span>
                  ) : line}
                  {lIndex < paragraph.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
              {pIndex < t(`faq.${index}.content`).split('\n\n').length - 1 && <br className="mb-4" />}
            </React.Fragment>
          ))}
        </p>
      )
    };
  });

  return (
    <section className="w-full py-12 md:py-20 px-4 sm:px-6 md:px-8 flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-dark-green-6 to-dark-green-7">
      {/* Section Decorations with white variant for dark background */}
      <SectionDecorations
        variant="white"
        positions={['bottom-right']}
        customStyles={{
          bottomRight: {
            opacity: 0.15,
            transform: 'scale(1.2) translate(20px, 20px)'
          }
        }}
      />

      {/* Top divider with gradient */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-light-green-1/15 to-transparent"></div>

      {/* Bottom divider with gradient */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-light-green-1/15 to-transparent"></div>

      <SectionHeader
        icon={Question}
        title={t('title')}
        subtitle={t('subtitle')}
        variant="dark"
        customIconStyles={{
          iconClassName: 'text-white'
        }}
        className="mb-6 md:mb-10 relative z-10"
      />

      <div className="w-full max-w-3xl relative z-10">
        <Accordion items={items} />
      </div>
    </section>
  );
}