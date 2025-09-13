import React from 'react';

/**
 * SectionDecorations component for adding SVG decorations to sections
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - The color variant of the section ('light', 'lime', 'dark', 'yellow', 'white')
 * @param {string} props.position - The decoration position ('top-right', 'bottom-left', 'top-left', 'bottom-right')
 * @param {Object} props.customStyles - Optional custom styles to apply to the SVG decorations
 */
export const SectionDecoration = ({
  variant = 'light',
  position = 'top-right',
  customStyles = {}
}) => {
  // Determine which SVG to use based on position
  const svgFile = position.includes('right')
    ? '/images/decorations/65676684_9595802.svg'
    : '/images/decorations/65676536_9596044.svg';

  // Determine rotation based on position
  const rotation = position.includes('bottom') ? 'rotate-180' : '';

  // Set positioning classes based on position
  const positionClasses = {
    'top-right': 'absolute top-0 right-0',
    'bottom-left': 'absolute bottom-0 left-0',
    'top-left': 'absolute top-0 left-0',
    'bottom-right': 'absolute bottom-0 right-0'
  };

  // Set transform values based on position
  const transformValues = {
    'top-right': 'translate(20px, -20px)',
    'bottom-left': 'translate(-20px, 20px)',
    'top-left': 'translate(-20px, -20px)',
    'bottom-right': 'translate(20px, 20px)'
  };

  // Set filter values based on variant
  const filterValues = {
    'light': 'sepia(10%) hue-rotate(0deg) saturate(0.5) brightness(1.2)',
    'lime': 'sepia(100%) hue-rotate(70deg) saturate(0.8) brightness(1.1)',
    'dark': 'sepia(100%) hue-rotate(140deg) saturate(1) brightness(0.8)',
    'yellow': 'sepia(100%) hue-rotate(30deg) saturate(1.5) brightness(1.1)',
    'white': 'sepia(0%) brightness(3) saturate(0) contrast(0.8) invert(0.9)'
  };

  // Calculate decoration size based on position
  const sizeClasses = position.includes('top') ? 'w-64 h-64' : 'w-48 h-48';

  return (
    <img
      src={svgFile}
      alt=""
      className={`${positionClasses[position]} ${sizeClasses} opacity-30 object-contain ${rotation}`}
      style={{
        transform: transformValues[position],
        filter: filterValues[variant],
        ...customStyles
      }}
      aria-hidden="true"
    />
  );
};

/**
 * SectionDecorations component for adding a set of decorations to a section
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - The color variant of the section ('light', 'lime', 'dark', 'yellow', 'white')
 * @param {boolean} props.withCircles - Whether to include circle decorations (deprecated, kept for backward compatibility)
 * @param {Object} props.customStyles - Optional custom styles to apply
 * @param {Array} props.positions - Array of positions to show decorations at (e.g. ['top-right', 'bottom-left'])
 */
const SectionDecorations = ({
  variant = 'light',
  withCircles = false, // Now defaults to false
  customStyles = {},
  positions = ['top-right', 'bottom-left']
}) => {
  return (
    <>
      {/* Corner SVG Decorations */}
      {positions.includes('top-right') && (
        <SectionDecoration
          variant={variant}
          position="top-right"
          customStyles={customStyles.topRight}
        />
      )}

      {positions.includes('bottom-left') && (
        <SectionDecoration
          variant={variant}
          position="bottom-left"
          customStyles={customStyles.bottomLeft}
        />
      )}

      {positions.includes('top-left') && (
        <SectionDecoration
          variant={variant}
          position="top-left"
          customStyles={customStyles.topLeft}
        />
      )}

      {positions.includes('bottom-right') && (
        <SectionDecoration
          variant={variant}
          position="bottom-right"
          customStyles={customStyles.bottomRight}
        />
      )}
    </>
  );
};

export default SectionDecorations;