import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../../utils/i18n';

/**
 * ArabicText component
 * A specialized component for rendering Arabic text with the Cairo font
 *
 * @param {Object} props - Component props
 * @param {string} props.children - The text content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.weight - Font weight (light, regular, medium, semibold, bold)
 * @param {string} props.size - Text size (xs, sm, base, lg, xl, 2xl, etc.)
 * @param {boolean} props.alwaysArabic - Whether to always use Arabic styling regardless of current locale
 */
const ArabicText = ({
  children,
  className = '',
  weight = 'regular',
  size = 'base',
  alwaysArabic = false,
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

  // Map text sizes to Tailwind classes
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  const classes = [
    // Only apply font-arabic if we're using Arabic styling
    isArabicStyling ? 'font-arabic' : '',
    // Set direction based on styling
    isArabicStyling ? 'rtl' : '',
    // Apply weight and size classes
    weightClasses[weight] || 'font-normal',
    sizeClasses[size] || 'text-base',
    // Add custom classes
    className
  ].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      dir={isArabicStyling ? 'rtl' : 'ltr'}
      lang={isArabicStyling ? 'ar' : undefined}
      {...rest}
    >
      {children}
    </span>
  );
};

ArabicText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  weight: PropTypes.oneOf(['light', 'regular', 'medium', 'semibold', 'bold']),
  size: PropTypes.oneOf(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']),
  alwaysArabic: PropTypes.bool,
};

export default ArabicText;