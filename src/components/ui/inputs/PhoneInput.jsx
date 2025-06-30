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

  return (
    <div className={`phone-input-container ${error ? 'error' : ''} ${className}`}>
      {/* Phone Input Field */}
      <div className="relative">
        <ReactInternationalPhoneInput
          defaultCountry={defaultCountry}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          inputClassName={`
            w-full py-3 px-4 text-dark-green-7 
            bg-white border border-logo-lime/70 rounded-full
            focus:outline-none focus:border-logo-lime focus:ring-1 focus:ring-logo-lime
            placeholder:text-dark-green-6/70 text-[0.9375rem]
            transition-all duration-200
            ${error ? 'border-feedback-error/60 focus:border-feedback-error focus:ring-feedback-error/30' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          countrySelectorStyleProps={{
            buttonClassName: `
              py-3 px-3 pl-4 pr-2 border-r border-logo-lime/30
              hover:bg-logo-lime/5 transition-colors duration-200
              focus:outline-none focus:bg-logo-lime/10
              rounded-l-full flex items-center gap-2
              text-dark-green-6/70
              after:content-[""] after:absolute after:right-[-1px] after:top-1/2 after:-translate-y-1/2 after:w-px after:h-4 after:bg-logo-lime/30
              ${error ? 'border-feedback-error/60 after:bg-feedback-error/30' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `,
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