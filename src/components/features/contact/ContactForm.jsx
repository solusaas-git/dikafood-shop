import React, { useState, useCallback, useEffect } from 'react';
import { tv } from 'tailwind-variants';
import {
  User,
  At,
  Phone,
  EnvelopeSimple,
  Warning,
  CheckCircle,
  ChatCircleText
} from "@phosphor-icons/react";
// Contact service removed - using simple state management
import { validateName, validateEmail, validatePhone } from '@/utils/validation';
import { useTranslation } from '@/utils/i18n';
import { PhoneInput } from '@/components/ui/inputs';
import translations from '@/components/sections/home/translations/ContactSection';

/**
 * Styles for the contact form using tailwind-variants
 */
const styles = tv({
  slots: {
    // Form container
    container: 'w-full',

    // Form content
    content: 'flex flex-col gap-6 h-full',

    // Form layout
    row: 'grid grid-cols-1 md:grid-cols-2 gap-4',

    // Form input fields
    field: 'relative',
    input: 'w-full bg-white/90 border border-logo-lime/30 focus:border-logo-lime/60 focus:ring-1 focus:ring-logo-lime/30 rounded-full py-3 pl-10 pr-4 text-dark-green-7 placeholder:text-dark-green-6/50 focus:outline-none shadow-sm',
    textarea: 'w-full bg-white/90 border border-logo-lime/30 focus:border-logo-lime/60 focus:ring-1 focus:ring-logo-lime/30 rounded-2xl py-3 pl-10 pr-4 text-dark-green-7 placeholder:text-dark-green-6/50 focus:outline-none min-h-[120px] resize-none shadow-sm flex-1',
    phoneField: 'rounded-full overflow-hidden border border-logo-lime/30 focus-within:border-logo-lime/60 focus-within:ring-1 focus-within:ring-logo-lime/30 shadow-sm bg-white/90',
    inputIcon: 'absolute left-3 top-3 text-dark-green-7/70 after:content-[""] after:absolute after:right-[-0.5rem] after:top-1/2 after:-translate-y-1/2 after:w-px after:h-4 after:bg-logo-lime/20',

    // Form validation and messages
    error: 'text-xs text-feedback-error mt-0 ml-3 flex items-center gap-1',
    errorIcon: 'text-feedback-error flex-shrink-0',
    submitError: 'flex items-center gap-2 p-3 bg-feedback-error/10 border border-feedback-error/30 rounded-lg text-feedback-error text-sm',
    submitSuccess: 'flex items-center gap-2 p-3 bg-feedback-success/10 border border-feedback-success/30 rounded-lg text-feedback-success text-sm',

    // Form submission button
    submitBtn: 'flex items-center justify-center gap-3 min-w-[200px] py-3.5 px-6 bg-logo-lime/30 border border-logo-lime/70 text-dark-green-7 font-medium rounded-full transition-colors hover:bg-logo-lime/40',
    submitBtnDisabled: 'opacity-70 cursor-not-allowed',
    submitBtnSuccess: 'bg-feedback-success hover:bg-feedback-success text-white',
  }
});

/**
 * Initial state of the form
 */
const INITIAL_FORM_STATE = {
  name: '',
  surname: '',
  email: '',
  phone: '',
  message: ''
};

/**
 * ContactForm component - Reusable contact form with validation and submission
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Callback function called on successful form submission
 * @param {Function} props.onError - Callback function called on form submission error
 * @param {Object} props.initialData - Initial data for the form
 * @param {string} props.source - Source of the form ('landing' or 'contact')
 * @param {Object} props.className - Additional CSS class for the form container
 */
const ContactForm = ({
  onSuccess,
  onError,
  initialData = INITIAL_FORM_STATE,
  source = 'landing',
  className = ''
}) => {
  const { t, locale } = useTranslation(translations);
  const isRTL = locale === 'ar';

  // Generate all styles
  const s = styles();

  // Form state
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simple state management for contact form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Form validation functions
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
      case 'surname':
        return !value ? t('form.name.error.required') : value.length < 2 ? t('form.name.error.format') : '';
      case 'email':
        return !value ? t('form.email.error.required') : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? t('form.email.error.format') : '';
      case 'phone': {
        if (!value) return t('form.phone.error.required');
        // Basic phone validation - check if it's a valid international format
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return !phoneRegex.test(value) ? t('form.phone.error.format') : '';
      }
      case 'message':
        return !value || value.trim() === '' ? t('form.message.error.required') : '';
      default:
        return '';
    }
  }, [t]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Mark all fields as touched
    setTouched(
      Object.keys(formData).reduce((obj, key) => ({ ...obj, [key]: true }), {})
    );

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  // Event handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handlePhoneChange = useCallback((value) => {
    setFormData(prev => ({
      ...prev,
      phone: value || ''
    }));

    // Clear error when user changes phone
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Only validate if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  const handlePhoneBlur = useCallback(() => {
    setTouched(prev => ({
      ...prev,
      phone: true
    }));

    if (touched.phone) {
      const error = validateField('phone', formData.phone);
      setErrors(prev => ({
        ...prev,
        phone: error
      }));
    }
  }, [touched, validateField, formData.phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Prepare form data for API
      const contactData = {
        name: `${formData.name} ${formData.surname}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: source || 'landing' // Use prop or default to 'landing'
      };

      // Submit to contact leads API
      const response = await fetch('/api/contact-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to submit contact form');
      }

      // Show success message
      setSubmitSuccess(true);

      // Call onSuccess callback if provided
      if (typeof onSuccess === 'function') {
        onSuccess(formData);
      }

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          surname: '',
          email: '',
          phone: '',
          message: ''
        });
        setTouched({});
        setErrors({});
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitError(error.message || t('form.error.general'));

      // Call onError callback if provided
      if (typeof onError === 'function') {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={`${s.content()} ${className}`} onSubmit={handleSubmit} noValidate suppressHydrationWarning>
      <div className={s.row()}>
        <div className={s.field()}>
          <input
            type="text"
            name="name"
            placeholder={t('form.name.placeholder')}
            className={`${s.input()} ${touched.name && errors.name ? 'border-feedback-error' : ''}`}
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            dir={isRTL ? 'rtl' : 'ltr'}
            required
          />
          <User size={18} weight="duotone" className={`${s.inputIcon()} ${isRTL ? 'left-auto right-3' : ''}`} />
          {touched.name && errors.name && (
            <div className={s.error()}>
              <Warning size={12} weight="duotone" className={s.errorIcon()} />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        <div className={s.field()}>
          <input
            type="text"
            name="surname"
            placeholder={t('form.surname.placeholder')}
            className={`${s.input()} ${touched.surname && errors.surname ? 'border-feedback-error' : ''}`}
            value={formData.surname}
            onChange={handleInputChange}
            onBlur={handleBlur}
            dir={isRTL ? 'rtl' : 'ltr'}
            required
          />
          <User size={18} weight="duotone" className={`${s.inputIcon()} ${isRTL ? 'left-auto right-3' : ''}`} />
          {touched.surname && errors.surname && (
            <div className={s.error()}>
              <Warning size={12} weight="duotone" className={s.errorIcon()} />
              <span>{errors.surname}</span>
            </div>
          )}
        </div>
      </div>

      <div className={s.row()}>
        <div className={s.field()}>
          <input
            type="email"
            name="email"
            placeholder={t('form.email.placeholder')}
            className={`${s.input()} ${touched.email && errors.email ? 'border-feedback-error' : ''}`}
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            dir="ltr"
            required
          />
          <At size={18} weight="duotone" className={`${s.inputIcon()} ${isRTL ? 'left-auto right-3' : ''}`} />
          {touched.email && errors.email && (
            <div className={s.error()}>
              <Warning size={12} weight="duotone" className={s.errorIcon()} />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        <div className={s.field()}>
          <PhoneInput
            value={formData.phone}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            placeholder={t('form.phone.placeholder')}
            error={touched.phone && errors.phone}
            errorMessage={errors.phone}
            defaultCountry="ma"
          />
        </div>
      </div>

      <div className={`${s.field()} flex-1 flex flex-col`}>
        <textarea
          name="message"
          placeholder={t('form.message.placeholder')}
          className={`${s.textarea()} ${touched.message && errors.message ? 'border-feedback-error' : ''}`}
          value={formData.message}
          onChange={handleInputChange}
          onBlur={handleBlur}
          dir={isRTL ? 'rtl' : 'ltr'}
          required
        />
        <EnvelopeSimple size={18} weight="duotone" className={`${s.inputIcon()} ${isRTL ? 'left-auto right-3' : ''}`} />
        {touched.message && errors.message && (
          <div className={s.error()}>
            <Warning size={12} weight="duotone" className={s.errorIcon()} />
            <span>{errors.message}</span>
          </div>
        )}
      </div>

      {errors.submit && (
        <div className={s.submitError()}>
          <Warning size={16} weight="duotone" />
          <span>{errors.submit}</span>
        </div>
      )}

      {submitSuccess && (
        <div className={s.submitSuccess()}>
          <CheckCircle size={16} weight="duotone" />
          <span>{t('form.submit.success')}</span>
        </div>
      )}

      <button
        type="submit"
        className={`${s.submitBtn()} ${isSubmitting ? s.submitBtnDisabled() : ''} ${submitSuccess ? s.submitBtnSuccess() : ''} mt-auto`}
        disabled={isSubmitting || submitSuccess}
      >
        {submitSuccess ? (
          <CheckCircle size={20} weight="duotone" />
        ) : (
          <ChatCircleText size={20} weight="duotone" />
        )}
        <span className="whitespace-nowrap">
          {isSubmitting
            ? t('form.submitting')
            : submitSuccess
                ? t('form.submit.success')
                : t('form.submit')}
        </span>
      </button>
    </form>
  );
};

export default ContactForm;