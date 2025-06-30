/**
 * Translation initialization
 * This file loads and initializes all translations for the application
 */
import { initTranslations } from '../utils/i18n';

// Import shared translations for global use
const globalTranslations = {
  fr: {
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.submit': 'Envoyer',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
  },
  en: {
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
  },
  ar: {
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.back': 'عودة',
    'common.next': 'التالي',
    'common.submit': 'إرسال',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
  }
};

/**
 * Initialize translations with global translations
 * Component-specific translations are registered directly by components
 */
export function initializeTranslations() {
  // Initialize with global translations
  initTranslations(globalTranslations, 'fr');
}

export default initializeTranslations;