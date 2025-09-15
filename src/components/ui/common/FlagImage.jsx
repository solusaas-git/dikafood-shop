import React, { useState } from 'react';
// Simple flag URL function - no external service dependency

/**
 * React component for flag images with automatic fallback
 * @param {Object} props - Component props
 * @param {string} props.countryCode - ISO 3166-1 alpha-2 country code
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - CSS classes
 * @param {string} props.format - Image format preference
 * @param {string} props.size - Size for raster formats
 * @param {Object} props.style - Inline styles
 * @returns {JSX.Element} Flag image component
 */
export default function FlagImage({ 
  countryCode, 
  alt, 
  className = '', 
  format = 'svg', 
  size = '32x24',
  style = {},
  ...props 
}) {
  const [hasError, setHasError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  
  // Simple flag URL generation - use higher resolution for crisp display
  const normalizedCode = countryCode?.toUpperCase() || 'XX';
  const primary = `https://flagcdn.com/w80/${countryCode?.toLowerCase() || 'xx'}.png`;

  if (!primary) {
    return null;
  }

  // If both primary and fallback failed, show country code
  if (hasError && fallbackError) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gray-100 border border-gray-300 rounded text-xs font-mono text-gray-600 ${className}`}
        style={{
          width: '24px',
          height: '18px',
          minWidth: '24px',
          minHeight: '18px',
          ...style
        }}
        title={alt || `${countryCode} flag`}
        {...props}
      >
        {normalizedCode}
      </div>
    );
  }

  // If primary failed but we haven't tried fallback yet
  if (hasError && !fallbackError) {
    // Use flagcdn.com as a reliable fallback with higher resolution
    const fallbackUrl = `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
    
    return (
      <img
        src={fallbackUrl}
        alt={alt || `${countryCode} flag`}
        className={className}
        style={{
          imageRendering: 'crisp-edges',
          WebkitImageRendering: 'crisp-edges',
          MozImageRendering: 'crisp-edges',
          ...style
        }}
        onError={() => {
          console.warn(`[FlagImage] Fallback flag failed for ${countryCode}`);
          setFallbackError(true);
        }}
        loading="lazy"
        {...props}
      />
    );
  }

  return (
    <img
      src={primary}
      alt={alt || `${countryCode} flag`}
      className={className}
      style={{
        imageRendering: 'crisp-edges',
        WebkitImageRendering: 'crisp-edges',
        MozImageRendering: 'crisp-edges',
        ...style
      }}
      onError={(e) => {
        console.warn(`[FlagImage] Primary flag failed for ${countryCode}, using fallback`);
        setHasError(true);
      }}
      loading="lazy"
      {...props}
    />
  );
} 