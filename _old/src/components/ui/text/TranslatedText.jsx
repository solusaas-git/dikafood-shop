import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import getTranslation from '../../../utils/translation';

/**
 * TranslatedText - A component that displays text in the current language
 *
 * @param {Object} props - The component props
 * @param {string} props.path - Dot notation path to the translation key (e.g., "common.buttons.submit")
 * @param {string} props.translationKey - Alternative name for path (for backward compatibility)
 * @param {Object} props.replacements - Optional object with key-value pairs for text replacements
 * @param {string} props.component - HTML element to render (default: 'span')
 * @param {Object} props.componentProps - Props to pass to the rendered element
 */
const TranslatedText = ({
  path,
  translationKey,
  replacements,
  component = 'span',
  ...componentProps
}) => {
  const { language } = useLanguage();
  // Use translationKey as a fallback if path is not provided
  const keyToUse = path || translationKey;
  const translatedText = getTranslation(keyToUse, language, replacements);

  const Component = component;

  return (
    <Component {...componentProps}>
      {translatedText}
    </Component>
  );
};

export default TranslatedText;

/**
 * Helper components for common HTML elements
 */

export const TranslatedHeading = ({ level = 1, path, replacements, ...props }) => {
  const HeadingTag = `h${level}`;
  return (
    <TranslatedText
      path={path}
      replacements={replacements}
      component={HeadingTag}
      {...props}
    />
  );
};

export const TranslatedParagraph = (props) => (
  <TranslatedText component="p" {...props} />
);

export const TranslatedLabel = (props) => (
  <TranslatedText component="label" {...props} />
);

export const TranslatedButton = ({ onClick, className, ...props }) => (
  <button onClick={onClick} className={className}>
    <TranslatedText {...props} />
  </button>
);