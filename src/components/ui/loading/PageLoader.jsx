import React from 'react';
import PropTypes from 'prop-types';
import SectionDecorations from '@components/ui/decorations/SectionDecorations';

/**
 * PageLoader component for full-screen loading states
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display (default: "Chargement...")
 * @param {string} props.className - Additional class names
 * @param {Object} props.style - Additional inline styles
 */
const PageLoader = ({
  message = "Chargement...",
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${className || ""}`}
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        ...(style || {})
      }}
      {...props}
    >
      {/* Section Decorations with white variant for dark background */}
      <SectionDecorations
        variant="white"
        positions={['bottom-right']}
        customStyles={{
          bottomRight: {
            opacity: 0.15,
            transform: 'scale(1.2) translate(20px, 20px)'
          }
        }}
      />

      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="w-24 h-24 relative animate-pulse">
          <img
            src="/favicon.svg"
            alt="Loading"
            className="w-full h-full animate-spin-slow"
            style={{
              animationDuration: '3s',
              filter: 'drop-shadow(0 0 8px rgba(168, 203, 56, 0.5))'
            }}
          />
        </div>
        <p className="text-dark-green-7 mt-4 font-medium">{message}</p>
      </div>
    </div>
  );
};

PageLoader.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default PageLoader;
