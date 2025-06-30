import React from 'react';
import { tv } from 'tailwind-variants';
import ContentContainer from '../layout/ContentContainer';

/**
 * Form component styles
 */
const formStyles = tv({
  base: 'space-y-6',
  variants: {
    variant: {
      default: '',
      condensed: 'space-y-4',
      inline: 'flex flex-row gap-4 items-start',
      stacked: 'flex flex-col gap-6',
    },
    padding: {
      default: 'p-6',
      none: 'p-0',
      sm: 'p-4',
      lg: 'p-8',
    }
  },
  defaultVariants: {
    variant: 'default',
    padding: 'default',
  }
});

/**
 * Form group container styles
 */
const formGroupStyles = tv({
  base: 'space-y-4',
  variants: {
    layout: {
      default: 'grid grid-cols-1',
      inline: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      stacked: 'flex flex-col gap-4',
      grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
      responsive: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    },
  },
  defaultVariants: {
    layout: 'default',
  }
});

/**
 * Form group footer styles
 */
const formFooterStyles = tv({
  base: 'flex mt-6',
  variants: {
    align: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    },
    variant: {
      default: 'pt-4 border-t border-amber-100',
      clean: '',
      colored: 'pt-4 border-t border-logo-lime/20',
    }
  },
  defaultVariants: {
    align: 'between',
    variant: 'default',
  }
});

/**
 * Form button styles for primary action
 */
const formButtonStyles = tv({
  base: 'inline-flex items-center gap-1 px-5 py-2.5 rounded-full transition-colors font-medium text-sm shadow-sm',
  variants: {
    variant: {
      primary: 'bg-logo-lime hover:bg-logo-lime/90 text-dark-green-7 border border-logo-lime/70',
      secondary: 'bg-white border border-amber-200 text-gray-700 hover:bg-amber-50',
      danger: 'bg-feedback-error hover:bg-feedback-error/90 text-white border border-feedback-error/70',
    },
    loading: {
      true: 'opacity-70 cursor-wait',
    }
  },
  defaultVariants: {
    variant: 'primary',
    loading: false,
  }
});

/**
 * Generalized Form component
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form content
 * @param {function} props.onSubmit - Form submit handler
 * @param {string} props.variant - Form variant (default, condensed, inline, stacked)
 * @param {string} props.className - Additional CSS class for the form
 * @param {boolean} props.withContainer - Whether to wrap form in ContentContainer
 * @param {Object} props.headerContent - Content for the header (if withContainer is true)
 * @param {string} props.headerVariant - Header variant (if withContainer is true)
 * @param {React.ReactNode} props.footer - Custom footer content
 * @param {React.ReactNode} props.submitButton - Custom submit button
 * @param {React.ReactNode} props.cancelButton - Custom cancel button
 * @param {string} props.submitText - Text for submit button
 * @param {string} props.cancelText - Text for cancel button
 * @param {function} props.onCancel - Cancel handler
 * @param {string} props.footerAlign - Footer alignment (left, center, right, between)
 * @param {boolean} props.loading - Whether form is in loading state
 * @param {string} props.footerVariant - Footer variant (default, clean, colored)
 * @param {string} props.padding - Padding for the form body
 */
const Form = ({
  children,
  onSubmit,
  variant = 'default',
  className = '',
  withContainer = false,
  headerContent = null,
  headerVariant = 'default',
  footer = null,
  submitButton = null,
  cancelButton = null,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel = null,
  footerAlign = 'between',
  loading = false,
  footerVariant = 'default',
  padding = 'default',
  ...props
}) => {
  const formContent = (
    <form onSubmit={onSubmit} className={formStyles({ variant, className })} {...props}>
      {children}

      {(footer || submitButton || cancelButton || submitText || (cancelText && onCancel)) && (
        <div className={formFooterStyles({ align: footerAlign, variant: footerVariant })}>
          {footer || (
            <>
              {cancelButton || (onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className={formButtonStyles({ variant: 'secondary' })}
                  disabled={loading}
                >
                  {cancelText}
                </button>
              ))}

              {submitButton || (
                <button
                  type="submit"
                  className={formButtonStyles({ variant: 'primary', loading })}
                  disabled={loading}
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-dark-green-7/30 border-t-dark-green-7 animate-spin rounded-full mr-2"></div>
                  )}
                  {submitText}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </form>
  );

  if (withContainer) {
    return (
      <ContentContainer
        title={headerContent}
        headerVariant={headerVariant}
        bodyClassName={formStyles({ padding })}
      >
        {formContent}
      </ContentContainer>
    );
  }

  return formContent;
};

/**
 * Form.Group component for grouping form fields
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form group content
 * @param {string} props.layout - Layout variant (default, inline, stacked, grid, responsive)
 * @param {string} props.className - Additional CSS class
 * @param {string} props.label - Group label
 */
Form.Group = function FormGroup({
  children,
  layout = 'default',
  className = '',
  label = null,
  ...props
}) {
  return (
    <div className="space-y-2" {...props}>
      {label && (
        <h3 className="flex items-center gap-1.5 text-dark-green-1 font-medium">
          {typeof label === 'string' ? label : label}
        </h3>
      )}

      <div className={formGroupStyles({ layout, className })}>
        {children}
      </div>
    </div>
  );
};

/**
 * Form.InputWithIcon component for input fields with an icon
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Input name
 * @param {string} props.type - Input type
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.className - Additional CSS class
 */
Form.InputWithIcon = function FormInputWithIcon({
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 border border-amber-200 rounded-full focus:ring-2 focus:ring-logo-lime/50 focus:border-logo-lime outline-none transition bg-white ${error ? 'border-feedback-error ring-1 ring-feedback-error/30' : ''} ${className}`}
          {...props}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      </div>

      {error && (
        <div className="text-feedback-error text-xs flex items-center gap-1 ml-3">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Form.Select component for select dropdowns with optional icon
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Select name
 * @param {string} props.value - Select value
 * @param {function} props.onChange - Change handler
 * @param {Array} props.options - Options array [{value, label}]
 * @param {string} props.placeholder - Placeholder text
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.loading - Whether options are loading
 * @param {string} props.className - Additional CSS class
 */
Form.Select = function FormSelect({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  icon = null,
  error,
  required = false,
  loading = false,
  className = '',
  ...props
}) {
  const baseClass = "w-full pl-10 pr-4 py-2.5 border border-amber-200 rounded-full focus:ring-2 focus:ring-logo-lime/50 focus:border-logo-lime outline-none transition bg-white appearance-none";

  return (
    <div className="space-y-1">
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseClass} ${error ? 'border-feedback-error ring-1 ring-feedback-error/30' : ''} ${className}`}
          {...props}
        >
          <option value="" disabled hidden>{loading ? 'Loading...' : placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {error && (
        <div className="text-feedback-error text-xs flex items-center gap-1 ml-3">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Form.RadioGroup component for radio button groups
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Radio group name
 * @param {string} props.value - Selected value
 * @param {function} props.onChange - Change handler
 * @param {Array} props.options - Options array [{value, label, description, icon}]
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS class for the container
 * @param {string} props.optionClassName - Additional CSS class for individual options
 */
Form.RadioGroup = function FormRadioGroup({
  name,
  value,
  onChange,
  options = [],
  error,
  className = '',
  optionClassName = '',
  ...props
}) {
  // Determine if this should be a row layout based on className
  const isRowLayout = className.includes('flex');
  const baseContainerClass = isRowLayout ? '' : 'space-y-3';
  
  // Check if this is for delivery methods or shop selection (to apply special styling)
  const isDeliveryMethod = name === 'deliveryMethodId';
  const isShopSelection = name === 'selectedShop';
  
  return (
    <div className={`${baseContainerClass} ${className}`} {...props}>
      {options.map((option, index) => (
        <div 
          key={option.value || `option-${index}`} 
          className={`
            border ${(isDeliveryMethod || isShopSelection) ? 'border-lime-300/60' : 'border-amber-200'} 
            rounded-lg overflow-hidden min-h-[80px]
            ${(isDeliveryMethod || isShopSelection) ? 'bg-gradient-to-br from-yellow-50/80 to-yellow-100/50' : ''} 
            ${optionClassName}
          `}
        >
          <label htmlFor={`${name}-${option.value}`} className="flex items-center cursor-pointer h-full min-h-[80px]">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className="sr-only"
            />
            <div className={`
              p-4 flex-1 flex items-center justify-between h-full
              ${value === option.value 
                ? ((isDeliveryMethod || isShopSelection) ? 'bg-yellow-100/70' : 'bg-logo-lime/10') 
                : ((isDeliveryMethod || isShopSelection) ? 'hover:bg-yellow-50/70' : 'hover:bg-amber-50')
              }
            `}>
              <div className="flex items-center">
                {/* Only show icon if it exists and this is not a delivery method or shop selection */}
                {option.icon && !isDeliveryMethod && !isShopSelection && <div className="mr-3">{option.icon}</div>}
                <div className={`
                  w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                  ${value === option.value
                    ? ((isDeliveryMethod || isShopSelection) ? 'border-dark-green-7 bg-lime-100/60' : 'border-dark-green-1 bg-logo-lime/10')
                    : ((isDeliveryMethod || isShopSelection) ? 'border-lime-400' : 'border-gray-300')
                  }
                `}>
                  {value === option.value && (
                    <div className={`w-2.5 h-2.5 rounded-full ${(isDeliveryMethod || isShopSelection) ? 'bg-dark-green-7' : 'bg-dark-green-1'}`}></div>
                  )}
                </div>
                <div className="flex-1">
                  <span className={`
                    block font-medium text-sm
                    ${(isDeliveryMethod || isShopSelection) ? 'text-dark-green-7' : 'text-gray-800'}
                  `}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className={`
                      text-xs mt-1 block
                      ${(isDeliveryMethod || isShopSelection) ? 'text-dark-green-6' : 'text-gray-500'}
                    `}>
                      {option.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </label>
        </div>
      ))}

      {error && (
        <div className="text-feedback-error text-sm flex items-center gap-1 ml-3">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Form.Textarea component
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Textarea name
 * @param {string} props.value - Textarea value
 * @param {function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.className - Additional CSS class
 */
Form.Textarea = function FormTextarea({
  name,
  value,
  onChange,
  placeholder,
  icon = null,
  error,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 border border-amber-200 rounded-lg focus:ring-2 focus:ring-logo-lime/50 focus:border-logo-lime outline-none transition bg-white min-h-[100px] ${error ? 'border-feedback-error ring-1 ring-feedback-error/30' : ''} ${className}`}
          {...props}
        />

        {icon && (
          <div className="absolute top-3 left-0 pl-3 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <div className="text-feedback-error text-xs flex items-center gap-1 ml-3">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Form;