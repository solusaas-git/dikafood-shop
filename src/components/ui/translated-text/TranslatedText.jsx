import React from 'react';
import './translated-text.scss';

/**
 * SimpleText component - replaces TranslatedText component
 * Simply displays the text passed in as a prop
 */
function SimpleText({
  text,
  children,
  className = '',
  ...props
}) {
  // Just display the text or children directly
  const content = text || children;

  return (
    <span className={`simple-text ${className}`} {...props}>
      {content}
    </span>
  );
}

export default SimpleText;