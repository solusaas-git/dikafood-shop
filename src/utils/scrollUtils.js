/**
 * Utility functions for scrolling to specific sections
 */

/**
 * Scrolls to the top of the page
 *
 * @param {Object} options - Scroll behavior options
 * @param {string} options.behavior - The scroll behavior ('auto', 'smooth')
 * @param {number} options.delay - Delay in ms before scrolling (useful after navigation)
 */
export const scrollToTop = (options = {}) => {
  const { behavior = 'smooth', delay = 0 } = options;

  if (delay > 0) {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior });
    }, delay);
  } else {
    window.scrollTo({ top: 0, behavior });
  }
};

/**
 * Scrolls to a specific section by ID
 *
 * @param {string} sectionId - The ID of the section to scroll to
 * @param {Object} options - Scroll behavior options
 * @param {string} options.behavior - The scroll behavior ('auto', 'smooth')
 * @param {number} options.delay - Delay in ms before scrolling (useful after navigation)
 */
export const scrollToSection = (sectionId, options = {}) => {
  const { behavior = 'smooth', delay = 0 } = options;

  if (delay > 0) {
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior });
      }
    }, delay);
  } else {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior });
    }
  }
};

/**
 * Scrolls to the catalog section
 *
 * @param {Object} options - Scroll behavior options
 */
export const scrollToCatalog = (options = {}) => {
  scrollToSection('catalog', options);
};

export default {
  scrollToTop,
  scrollToSection,
  scrollToCatalog
};