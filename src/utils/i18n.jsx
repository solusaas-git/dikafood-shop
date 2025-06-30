/**
 * Simple internationalization utility for the DikaFood modernized components
 */

import React, { createContext, useContext, useState } from 'react';

// Define available languages
export const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: 'FR' },
  { code: 'en', name: 'English', flag: 'US' },
  { code: 'ar', name: 'العربية', flag: 'MA' }
];

// Default language
let currentLanguage = 'fr';

// Translation cache
const translations = {
  fr: {}, // French translations
  en: {}, // English translations
  ar: {}, // Arabic translations
};

/**
 * Initialize the i18n system with translations
 * @param {Object} translationData - Object containing translations for different languages
 * @param {string} defaultLanguage - Default language code
 */
export function initTranslations(translationData = {}, defaultLanguage = 'fr') {
  // Merge new translations with existing ones
  Object.keys(translationData).forEach(lang => {
    translations[lang] = {
      ...translations[lang],
      ...translationData[lang],
    };
  });

  // Set default language
  currentLanguage = defaultLanguage;
}

/**
 * Register component translations
 * @param {string} componentName - Name of the component
 * @param {Object} componentTranslations - Translations for the component
 */
export function registerComponentTranslations(componentName, compTranslations) {
  // In the simplified version, we don't actually store these
}

/**
 * Set the current language
 * @param {string} lang - Language code
 */
export function setLanguage(lang) {
  if (translations[lang]) {
    // Update the global language variable
    currentLanguage = lang;

    // Update HTML attributes for language and direction
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    if (lang === 'ar') {
      document.documentElement.classList.add('rtl-active');
      document.documentElement.classList.add('arabic-active');

      // Force all arab-specific CSS to be applied
      document.querySelectorAll('.font-heading').forEach(el => {
        el.classList.add('arabic-heading-refresh');
        setTimeout(() => el.classList.remove('arabic-heading-refresh'), 50);
      });
    } else {
      document.documentElement.classList.remove('rtl-active');
      document.documentElement.classList.remove('arabic-active');
    }

    return true;
  }
  return false;
}

/**
 * Get current language
 * @returns {string} Current language code
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * Translate a key (simplified implementation)
 * @param {string} key - Translation key
 * @param {Object} params - Parameters for interpolation (unused in simplified version)
 * @returns {string} Translated text
 */
export function t(key) {
  return translations[currentLanguage]?.[key] || key;
}

// Create i18n context
const I18nContext = createContext({
  locale: 'fr',
  setLocale: () => {},
});

// I18n Provider component
export function I18nProvider({ children, defaultLocale = 'fr' }) {
  const [locale, setLocaleState] = useState(defaultLocale);

  // Initialize on mount with the default locale
  React.useEffect(() => {
    setLanguage(defaultLocale);

    // Check if there's a stored language preference
    const storedLanguage = localStorage.getItem('dika_language');
    if (storedLanguage && translations[storedLanguage]) {
      setLanguage(storedLanguage);
      setLocaleState(storedLanguage);
    }
  }, [defaultLocale]);

  // Custom setLocale that also updates the global language setting
  const setLocale = (newLocale) => {
    if (setLanguage(newLocale)) {
      // Store the language preference
      localStorage.setItem('dika_language', newLocale);
      setLocaleState(newLocale);

      // Notify brands section of language change
      const brandsSection = document.getElementById('brands-section');
      if (brandsSection) {
        // Create and dispatch a custom event
        const event = new CustomEvent('language-changed');
        brandsSection.dispatchEvent(event);
      }
    }
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

// Custom hook to use i18n (improved to work with component-local translations)
export function useTranslation(componentTranslations = null) {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  // Get the global locale from context
  const { locale } = context;

  // If component translations are provided, use those for this component
  const translateWithComponentTranslations = (key, params = {}) => {
    if (componentTranslations && componentTranslations[locale] && componentTranslations[locale][key]) {
      let text = componentTranslations[locale][key];

      // Simple parameter replacement
      if (params) {
        Object.keys(params).forEach(param => {
          text = text.replace(`{${param}}`, params[param]);
        });
      }

      return text;
    }

    // Fallback to global translations
    return translations[locale]?.[key] || key;
  };

  return {
    ...context,
    t: translateWithComponentTranslations,
    locale
  };
}

// Hook to simply get and set the locale
export function useLocale() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useLocale must be used within an I18nProvider');
  }

  return {
    locale: context.locale,
    setLocale: context.setLocale
  };
}

// Export default as a generic translate function
export default t;