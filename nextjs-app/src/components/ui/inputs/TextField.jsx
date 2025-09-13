import React, { useState } from 'react';
import { tv } from 'tailwind-variants';
import { FormIcon } from '../icons';

// Styles for text field components
const styles = {
  container: tv({
    base: 'relative w-full',
  }),

  inputWrapper: tv({
    base: 'relative flex items-center overflow-hidden rounded-md border border-neutral-300 bg-white transition-all focus-within:border-dark-green-6 focus-within:ring-1 focus-within:ring-dark-green-6',
    variants: {
      size: {
        sm: 'h-9',
        md: 'h-11',
        lg: 'h-13',
      },
      state: {
        default: '',
        error: 'border-feedback-error focus-within:border-feedback-error focus-within:ring-feedback-error',
        success: 'border-feedback-success focus-within:border-feedback-success focus-within:ring-feedback-success',
        disabled: 'bg-neutral-100 border-neutral-200',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }),

  input: tv({
    base: 'w-full h-full px-3 bg-transparent border-0 focus:outline-none focus:ring-0',
    variants: {
      hasLeftIcon: {
        true: 'pl-9',
      },
      hasRightIcon: {
        true: 'pr-9',
      },
      state: {
        default: 'text-dark-green-7 placeholder:text-neutral-400',
        error: 'text-dark-green-7 placeholder:text-neutral-400',
        success: 'text-dark-green-7 placeholder:text-neutral-400',
        disabled: 'text-neutral-500 placeholder:text-neutral-400 cursor-not-allowed',
      },
    },
    defaultVariants: {
      hasLeftIcon: false,
      hasRightIcon: false,
      state: 'default',
    },
  }),

  leftIcon: 'absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none',
  rightIcon: 'absolute right-3 top-1/2 -translate-y-1/2',

  label: tv({
    base: 'block font-medium mb-1',
    variants: {
      state: {
        default: 'text-dark-green-7',
        error: 'text-feedback-error',
        success: 'text-feedback-success',
        disabled: 'text-neutral-500',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }),

  error: 'text-feedback-error text-sm mt-1',
  helper: 'text-neutral-500 text-sm mt-1',
};

/**
 * TextField component for text inputs
 *
 * @param {string} id - Input id attribute
 * @param {string} name - Input name attribute
 * @param {string} value - Input value
 * @param {function} onChange - Change handler function
 * @param {string} label - Input label
 * @param {string} placeholder - Input placeholder
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} size - Input size (sm, md, lg)
 * @param {string} state - Input state (default, error, success, disabled)
 * @param {string} error - Error message
 * @param {string} helperText - Helper text
 * @param {string} leftIcon - Left icon field type (email, password, etc.)
 * @param {string} rightIcon - Right icon state (error, success, etc.)
 * @param {function} onRightIconClick - Right icon click handler
 * @param {boolean} required - Whether the field is required
 * @param {string} className - Additional CSS classes
 */
export default function TextField({
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  size = 'md',
  state = 'default',
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconClick,
  required = false,
  className,
  ...props
}) {
  // For password field visibility toggle
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPasswordField = type === 'password';

  // If it's a password field, we need to toggle the type
  const inputType = isPasswordField
    ? (passwordVisible ? 'text' : 'password')
    : type;

  // Determine the right icon state for password fields
  const passwordRightIcon = passwordVisible ? 'visible' : 'hidden';

  // Use either the provided right icon or the password visibility toggle
  const effectiveRightIcon = isPasswordField ? passwordRightIcon : rightIcon;

  // Handle right icon click
  const handleRightIconClick = isPasswordField
    ? () => setPasswordVisible(!passwordVisible)
    : onRightIconClick;

  // Determine input state based on error and disabled props
  const inputState = props.disabled ? 'disabled' : (error ? 'error' : state);

  return (
    <div className={styles.container({ className })}>
      {label && (
        <label htmlFor={id} className={styles.label({ state: inputState })}>
          {label}
          {required && <span className="text-feedback-error ml-1">*</span>}
        </label>
      )}

      <div className={styles.inputWrapper({ size, state: inputState })}>
        {leftIcon && (
          <div className={styles.leftIcon}>
            <FormIcon field={leftIcon} size="sm" />
          </div>
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={inputState === 'disabled'}
          className={styles.input({
            hasLeftIcon: !!leftIcon,
            hasRightIcon: !!effectiveRightIcon,
            state: inputState,
          })}
          {...props}
        />

        {effectiveRightIcon && (
          <div className={styles.rightIcon}>
            <FormIcon
              field={isPasswordField ? 'password' : null}
              state={effectiveRightIcon}
              position="right"
              size="sm"
              className="cursor-pointer"
              onClick={handleRightIconClick}
            />
          </div>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {!error && helperText && <p className={styles.helper}>{helperText}</p>}
    </div>
  );
}