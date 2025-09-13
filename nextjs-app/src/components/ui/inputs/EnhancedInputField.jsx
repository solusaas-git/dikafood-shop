import React, { useState } from 'react';
import Icon from '../icons/Icon';

/**
 * Enhanced input field component with icons and separators
 * Shared component for consistent form styling across auth forms
 *
 * @param {Object} props - Component props
 * @param {string} props.icon - Icon name to display
 * @param {boolean} props.compact - Whether to use compact styling
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.type - Input type
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.className - Additional CSS classes
 */
const EnhancedInputField = ({ icon, compact = false, ...props }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPasswordField = props.type === 'password';
  const inputType = isPasswordField ? (passwordVisible ? 'text' : 'password') : props.type;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const iconSize = compact ? 'sm' : 'md';
  const paddingY = compact ? 'py-2.5' : 'py-3';
  const paddingX = compact ? 'px-3' : 'px-4';
  const leftPadding = compact ? 'pl-10' : 'pl-12';
  const rightPadding = compact ? (isPasswordField ? 'pr-10' : 'pr-3') : (isPasswordField ? 'pr-12' : 'pr-4');
  const iconLeft = compact ? 'left-3' : 'left-4';
  const iconRight = compact ? 'right-3' : 'right-4';
  const separatorHeight = compact ? 'h-3' : 'h-4';
  const separatorRight = compact ? 'right-[-0.4rem]' : 'right-[-0.5rem]';
  const textSize = compact ? 'text-sm' : '';

  return (
    <div className="relative">
      <div className="flex items-center relative rounded-full border border-logo-lime/70 bg-white overflow-hidden focus-within:border-logo-lime focus-within:ring-1 focus-within:ring-logo-lime">
        {/* Icon with subtle separator */}
        <div className={`absolute ${iconLeft} top-1/2 -translate-y-1/2 flex items-center justify-center text-dark-green-6/70 after:content-[''] after:absolute after:${separatorRight} after:top-1/2 after:-translate-y-1/2 after:w-px after:${separatorHeight} after:bg-logo-lime/20`}>
          <Icon name={icon} weight="duotone" size={iconSize} />
        </div>

        <input
          {...props}
          type={inputType}
          className={`w-full ${paddingY} ${paddingX} ${leftPadding} ${rightPadding} text-dark-green-7 focus:outline-none bg-transparent placeholder:text-dark-green-6/70 ${textSize}`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute ${iconRight} top-1/2 -translate-y-1/2 flex items-center justify-center text-dark-green-6/70 hover:text-dark-green-7 transition-colors focus:outline-none`}
          >
            <Icon 
              name={passwordVisible ? "eyeSlash" : "eye"} 
              weight="duotone" 
              size={iconSize} 
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default EnhancedInputField; 