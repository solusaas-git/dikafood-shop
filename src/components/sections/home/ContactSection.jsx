import React, { useState, useCallback } from 'react';
import { ChatCircleText } from "@phosphor-icons/react";
import SectionHeader from '@/components/ui/layout/SectionHeader';
import { useTranslation } from '@/utils/i18n';
import translations from './translations/ContactSection';
import { ContactForm, ContactInfo } from '@/components/features/contact';
import SectionDecorations from '@/components/ui/decorations/SectionDecorations';

/**
 * ContactSection component - Section for contact information and form
 */
const ContactSection = () => {
  const { t, locale } = useTranslation(translations);
  const isRTL = locale === 'ar';

  // Success handler when contact form is submitted
  const handleFormSuccess = useCallback((formData) => {
    // You could add additional handling here if needed
    console.log('Contact form submitted successfully:', formData);
  }, []);

  // Error handler for contact form submission errors
  const handleFormError = useCallback((error) => {
    // You could add additional error handling here if needed
    console.error('Contact form submission error:', error);
  }, []);

  return (
    <section
      id="contact"
      className="w-full py-20 px-4 sm:px-6 md:px-8 flex flex-col items-center relative"
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-light-lime-1/30 via-light-lime-2/20 to-light-yellow-1/15 pointer-events-none"></div>

      <SectionDecorations variant="light" />

      <SectionHeader
        icon={ChatCircleText}
        title={t('title')}
        subtitle={t('subtitle')}
        variant="light"
        className="mb-10 relative z-10"
      />

      <div className={`grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 lg:gap-8 w-full max-w-4xl ${isRTL ? 'rtl' : ''} relative z-10`}>
        {/* Contact Info */}
        <div className="w-full h-full flex">
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:justify-self-end bg-white/80 border border-dark-yellow-1/40 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col">
            <ContactInfo className="h-full flex-1 flex flex-col" />
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-xl mx-auto lg:mx-0 lg:justify-self-start bg-white border border-dark-yellow-1/60 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col">
          <div className="text-center px-6 py-8 border-b border-dark-yellow-1/40 bg-gradient-to-br from-light-yellow-1/70 to-light-yellow-1/40">
            <div className="w-12 h-12 mx-auto mb-4 bg-logo-lime/15 border border-logo-lime/30 rounded-full flex items-center justify-center text-dark-green-7">
              <ChatCircleText size={24} weight="duotone" />
            </div>
            <h3 className="text-2xl font-medium text-dark-green-7 mb-2">{t('contact.form.title')}</h3>
            <p className="text-dark-green-6 text-sm">{t('contact.form.subtitle')}</p>
          </div>

          <div className="p-6 flex-1">
            <ContactForm
              onSuccess={handleFormSuccess}
              onError={handleFormError}
              className="h-full flex flex-col"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;