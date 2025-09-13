import React from 'react';
import { tv } from 'tailwind-variants';
import {
  EnvelopeSimple,
  Phone,
  Buildings
} from "@phosphor-icons/react";
import { useTranslation } from '@/utils/i18n';
import translations from '@/components/sections/home/translations/ContactSection';

/**
 * Styles for the contact info component using tailwind-variants
 */
const styles = tv({
  slots: {
    // Card container
    card: 'h-full flex flex-col',

    // Card header
    header: 'text-center px-6 py-8 border-b border-dark-yellow-1/40 bg-gradient-to-br from-light-yellow-1/70 to-light-yellow-1/40',
    iconWrapper: 'w-12 h-12 mx-auto mb-4 bg-logo-lime/15 border border-logo-lime/30 rounded-full flex items-center justify-center text-dark-green-7',
    title: 'text-2xl font-medium text-dark-green-7 mb-2',
    subtitle: 'text-dark-green-6 text-sm',

    // Contact items list
    list: 'p-6 flex flex-col gap-4 flex-1',
    item: 'flex gap-4 items-start p-4 bg-gradient-to-br from-light-yellow-1/40 to-light-yellow-1/20 border border-dark-yellow-1/40 rounded-xl shadow-sm',
    itemIcon: 'text-dark-green-7 flex-shrink-0 mt-1',
    itemContent: 'flex flex-col gap-1',
    itemLabel: 'text-xs font-semibold text-dark-green-7 uppercase tracking-wider',
    itemValue: 'text-dark-green-6 text-sm hover:text-dark-green-7 transition-colors',
  }
});

/**
 * ContactInfo component - Displays contact information in a styled card
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS class for the container
 */
const ContactInfo = ({ className = '' }) => {
  const { t, locale } = useTranslation(translations);
  const isRTL = locale === 'ar';

  // Generate styles
  const s = styles();

  return (
    <div className={`${s.card()} ${className} ${isRTL ? 'rtl' : ''}`}>
      <div className={s.header()}>
        <div className={s.iconWrapper()}>
          <EnvelopeSimple size={24} weight="duotone" />
        </div>
        <h3 className={s.title()}>{t('contact.info.title')}</h3>
        <p className={s.subtitle()}>{t('contact.info.subtitle')}</p>
      </div>

      <div className={s.list()}>
        {/* Phone information */}
        <div className={s.item()}>
          <Phone size={24} weight="duotone" className={s.itemIcon()} />
          <div className={s.itemContent()}>
            <span className={s.itemLabel()}>{t('contact.info.phone.label')}</span>
            <a
              href="tel:+212535942682"
              className={s.itemValue()}
            >
              +212 5 359-42682
            </a>
            <a
              href="tel:+212661323704"
              className={s.itemValue()}
            >
              +212 6 613-23704
            </a>
          </div>
        </div>

        {/* Email information */}
        <div className={s.item()}>
          <EnvelopeSimple size={24} weight="duotone" className={s.itemIcon()} />
          <div className={s.itemContent()}>
            <span className={s.itemLabel()}>{t('contact.info.email.label')}</span>
            <a
              href="mailto:contact@dikafood.ma"
              className={s.itemValue()}
            >
              contact@dikafood.ma
            </a>
          </div>
        </div>

        {/* Address information */}
        <div className={s.item()}>
          <Buildings size={24} weight="duotone" className={s.itemIcon()} />
          <div className={s.itemContent()}>
            <span className={s.itemLabel()}>{t('contact.info.address.label')}</span>
            <a
              href="https://maps.app.goo.gl/mJRgbWpwp2ZVFtnx8"
              target="_blank"
              rel="noopener noreferrer"
              className={s.itemValue()}
            >
              18 Rue Zenata, Fès 30000, Maroc
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;