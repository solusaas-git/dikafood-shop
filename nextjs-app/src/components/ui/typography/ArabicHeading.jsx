import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../../utils/i18n';

/**
 * ArabicHeading component
 * A specialized component for rendering Arabic headings with the Cairo font
 * and proper RTL styling
 *
 * @param {Object} props - Component props
 * @param {string} props.children - The text content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.weight - Font weight (light, regular, medium, semibold, bold)
 * @param {string} props.size - Heading size (h1, h2, h3, h4, h5, h6)
 * @param {boolean} props.alwaysArabic - Whether to always use Arabic styling regardless of current locale
 * @param {string} props.as - Element to render as (h1, h2, h3, div, etc.)
 */
const ArabicHeading = ({
  children,
  className = '',
  weight = 'semibold',
  size = 'h2',
  alwaysArabic = false,
  as: Component = 'h2',
  ...rest
}) => {
  const { locale } = useTranslation();

  // Only apply Arabic styling if the locale is Arabic or alwaysArabic is true
  const isArabicStyling = locale === 'ar' || alwaysArabic;

  // Map font weights to Tailwind classes
  const weightClasses = {
    light: 'font-light',
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  // Map heading sizes to Tailwind classes
  const sizeClasses = {
    h1: 'text-4xl md:text-5xl',
    h2: 'text-3xl md:text-4xl',
    h3: 'text-2xl md:text-3xl',
    h4: 'text-xl md:text-2xl',
    h5: 'text-lg md:text-xl',
    h6: 'text-base md:text-lg',
  };

  const classes = [
    // Apply font-heading by default, and font-arabic-heading for Arabic
    isArabicStyling ? 'font-arabic-heading' : 'font-heading',
    // Set direction based on styling
    isArabicStyling ? 'rtl' : '',
    // Apply weight and size classes
    weightClasses[weight] || 'font-semibold',
    sizeClasses[size] || 'text-3xl md:text-4xl',
    // Adjust line height for headings
    isArabicStyling ? 'leading-relaxed' : 'leading-tight',
    // Add custom classes
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={classes}
      dir={isArabicStyling ? 'rtl' : 'ltr'}
      lang={isArabicStyling ? 'ar' : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
};

ArabicHeading.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  weight: PropTypes.oneOf(['light', 'regular', 'medium', 'semibold', 'bold']),
  size: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  alwaysArabic: PropTypes.bool,
  as: PropTypes.elementType,
};

export default ArabicHeading;