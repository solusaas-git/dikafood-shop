import React, { useEffect } from 'react';
import { PhoneInput as ReactInternationalPhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Icon } from '@/components/ui/icons';

/**
 * Modern PhoneInput component using react-international-phone
 * Features:
 * - Real-time country detection as you type
 * - Natural caret positioning and copy/paste behavior
 * - Lightweight with no third-party dependencies
 * - Automatic formatting and validation
 * - Consistent sizing with other form inputs
 * - Morocco as default country for DikaFood
 * - Matches StyledTextField and EnhancedInputField styling patterns
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current phone number value
 * @param {Function} props.onChange - Function called when value changes
 * @param {Function} props.onBlur - Function called when input loses focus
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.error - Whether the input has an error state
 * @param {string} props.errorMessage - Error message to display
 * @param {string} props.defaultCountry - Default country code (e.g., 'ma', 'fr')
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.className - Additional CSS classes
 */
export const PhoneInput = ({
  value = '',
  onChange,
  onBlur,
  placeholder = 'Entrez votre numéro de téléphone',
  error = false,
  errorMessage = '',
  defaultCountry = 'ma', // Default to Morocco for DikaFood
  disabled = false,
  className = '',
  compact = false, // Add compact prop to match other inputs
  ...props
}) => {
  // Clean up any flag preload links created by react-international-phone to prevent console warnings
  useEffect(() => {
    const cleanupPreloadLinks = () => {
      // Remove any existing flag preload links
      const preloadLinks = document.querySelectorAll('link[rel="preload"][href*="flagcdn.com"]');
      preloadLinks.forEach(link => {
        link.remove();
      });
    };

    // Initial cleanup
    cleanupPreloadLinks();

    // Set up a mutation observer to remove any new preload links created by the library
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node is a preload link for flags
              if (node.tagName === 'LINK' && 
                  node.rel === 'preload' && 
                  node.href && 
                  node.href.includes('flagcdn.com')) {
                node.remove();
              }
              // Also check child elements for preload links
              const childPreloadLinks = node.querySelectorAll?.('link[rel="preload"][href*="flagcdn.com"]');
              childPreloadLinks?.forEach(link => link.remove());
            }
          });
        }
      });
    });

    // Observe changes to document head where preload links are typically added
    observer.observe(document.head, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Define responsive sizing based on compact prop
  const paddingY = compact ? 'py-2.5' : 'py-3';
  const paddingX = compact ? 'px-3' : 'px-4';
  const buttonPaddingY = compact ? 'py-2.5' : 'py-3';
  const buttonPaddingX = compact ? 'px-2.5 pl-3 pr-2' : 'px-3 pl-4 pr-2';
  const textSize = compact ? 'text-sm' : 'text-[0.9375rem]';
  const separatorHeight = compact ? 'h-3' : 'h-4';

  return (
    <div className={`phone-input-container ${className}`}>
      {/* Use exact same wrapper structure as EnhancedInputField */}
      <div className="relative">
        <div className={`flex items-center relative rounded-full border bg-white overflow-hidden focus-within:border-logo-lime focus-within:ring-1 focus-within:ring-logo-lime ${
          error ? 'border-feedback-error/60 focus-within:border-feedback-error focus-within:ring-feedback-error/30' : 'border-logo-lime/70'
        }`}>
          <ReactInternationalPhoneInput
            defaultCountry={defaultCountry}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            inputClassName=""
            inputStyle={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              padding: compact ? '0.625rem 0.75rem' : '0.75rem 1rem',
              fontSize: compact ? '0.875rem' : '0.9375rem',
              color: 'rgba(34, 69, 34, 1)',
              width: '100%',
              height: compact ? '2.5rem' : '3rem',
              lineHeight: '1.5',
              display: 'flex',
              alignItems: 'center'
            }}
            containerClassName=""
            containerStyle={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              margin: 0,
              width: '100%',
              height: compact ? '2.5rem' : '3rem',
              display: 'flex',
              alignItems: 'center'
            }}
            countrySelectorStyleProps={{
              buttonClassName: "",
              buttonStyle: {
                border: 'none',
                background: 'transparent',
                padding: compact ? '0.625rem 0.625rem 0.625rem 0.75rem' : '0.75rem 0.75rem 0.75rem 1rem',
                borderRight: '1px solid rgba(139, 195, 74, 0.2)',
                color: 'rgba(34, 69, 34, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                height: compact ? '2.5rem' : '3rem',
                lineHeight: '1.5'
              },
              dropdownStyleProps: {
                className: `
                  bg-white border border-logo-lime/70 rounded-lg shadow-lg
                  max-h-48 overflow-y-auto z-50
                  animate-fade-in-down backdrop-blur-sm bg-white/95
                `
              }
            }}
            {...props}
          />
        </div>
      </div>

      {/* Error Message - Consistent with other inputs */}
      {error && errorMessage && (
        <div className="text-feedback-error text-xs mt-1 ml-4 font-medium flex items-center gap-1 animate-fade-in-down">
          <Icon name="warning-circle" size={14} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;