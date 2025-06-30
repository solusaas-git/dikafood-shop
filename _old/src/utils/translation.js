import translations from '../translations';

/**
 * Get translated text based on the current language
 * @param {string} path - Dot notation path to the translation key (e.g., "common.buttons.submit")
 * @param {string} language - Current language code ('fr' or 'en')
 * @param {Object} replacements - Optional object with key-value pairs for text replacements
 * @returns {string} - Translated text
 */
export const getTranslation = (path, language, replacements = {}) => {
  try {
    // Handle undefined or empty path
    if (!path) {
      console.error('Translation path is undefined or empty');
      return '[Missing translation key]';
    }

    // Split the path into segments
    const segments = path.split('.');

    // Navigate through the translations object using the path segments
    let result = translations;
    for (const segment of segments) {
      if (!result[segment]) {
        console.warn(`Translation key not found: ${path}`);
        return path; // Return the path itself as fallback
      }
      result = result[segment];
    }

    // Get the translation for the current language
    const translation = result[language];

    if (!translation) {
      console.warn(`No translation found for language "${language}" at path "${path}"`);
      // Fallback to French if no translation exists for the current language
      return result.fr || path;
    }

    // Process any replacements
    if (Object.keys(replacements).length > 0) {
      return Object.entries(replacements).reduce(
        (text, [key, value]) => text.replace(new RegExp(`{${key}}`, 'g'), value),
        translation
      );
    }

    return translation;
  } catch (error) {
    console.error(`Error getting translation for "${path}":`, error);
    return path || '[Missing translation key]'; // Return the path itself as fallback or a default message
  }
};

/**
 * Create a translation function with predefined language
 * @param {string} language - Language code to use for translations
 * @returns {Function} - Function that accepts a path and optional replacements
 */
export const createTranslator = (language) => {
  return (path, replacements) => getTranslation(path, language, replacements);
};

export default getTranslation;