import React, { useState, useCallback, useEffect } from 'react';
import { tv } from 'tailwind-variants';
import { paths } from '@/utils/paths';
import { Button, PhoneInput } from '@/components/ui/inputs';
import { validateName, validateEmail } from '@/utils/validation';
// Removed old useApi hook import
import { api } from '@/services/api';
import { Icon } from '@/components/ui/icons';
import { useTranslation } from '@/utils/i18n';
import translations from '@/components/sections/home/translations/CatalogSection';

const styles = {
  container: 'w-full',
  form: 'flex flex-col gap-5',
  fieldsContainer: 'flex flex-col gap-5 mb-6',
  field: 'relative bg-white rounded-full overflow-hidden border border-logo-lime/30 focus-within:border-logo-lime/60 focus-within:ring-1 focus-within:ring-logo-lime/30 shadow-sm',
  fieldIcon: 'absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-dark-green-7/70 after:content-[""] after:absolute after:right-[-0.5rem] after:top-1/2 after:-translate-y-1/2 after:w-px after:h-4 after:bg-logo-lime/20',
  fieldInput: 'w-full h-12 py-0 px-3 pl-10 text-dark-green-7 focus:outline-none bg-white/90 placeholder:text-dark-green-6/50 text-[0.9375rem]',
  fieldError: 'text-feedback-error text-xs mt-0 ml-3 font-medium flex items-center gap-1 animate-fade-in-down',
  submitError: `
    flex items-center gap-1 p-3 bg-light-yellow-1/50
    border border-dark-yellow-2/30 rounded-lg text-dark-yellow-2
    text-sm font-medium animate-fade-in mb-4
  `,
  submitBtn: `
    w-full py-3.5 flex items-center justify-center
    bg-logo-lime/30 border border-logo-lime/70
    text-dark-green-7 font-medium rounded-full
    transition-colors hover:bg-logo-lime/40
  `,
};

const INITIAL_FORM_STATE = {
  name: '',
  surname: '',
  email: '',
  telephone: ''
};

export default function CatalogForm({ onSubmitSuccess, initialData = INITIAL_FORM_STATE, className = '' }) {
  const { t, locale } = useTranslation(translations);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
      case 'surname':
        return !value ? t('form.name.error.required') : value.length < 2 ? t('form.name.error.length') : '';
      case 'email':
        return !value ? t('form.email.error.required') : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? t('form.email.error.format') : '';
      case 'telephone': {
        if (!value) return t('form.phone.error.required');
        // Basic phone validation - check if it's a valid international format
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return !phoneRegex.test(value) ? t('form.phone.error.format') : '';
      }
      default:
        return '';
    }
  }, [t]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Mark all fields as touched when submitting
    setTouched(Object.keys(formData).reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {}));

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

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

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
      telephone: true
    }));

    if (touched.telephone) {
      const error = validateField('telephone', formData.telephone);
      setErrors(prev => ({
        ...prev,
        telephone: error
      }));
    }
  }, [touched, validateField, formData.telephone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Since we only have download endpoints, simulate a successful request
      // and provide catalog URLs for both languages
      onSubmitSuccess({
        userData: {
          ...formData,
          submittedAt: new Date().toISOString(),
          catalogUrls: {
            fr: '/api/catalogs/fr',
            ar: '/api/catalogs/ar'
          }
        }
      });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRTL = locale === 'ar';

  return (
    <div className={`${styles.container} ${className}`}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Display submit error if any */}
        {submitError && (
          <div className={styles.submitError}>
            <Icon name="warning-circle" className="text-dark-yellow-2" size={20} />
            <span>{t('form.submit.error')}</span>
          </div>
        )}

        <div className={styles.fieldsContainer}>
          {/* Name field */}
          <div className={`${styles.field} ${errors.name && touched.name ? 'border-feedback-error/60 ring-1 ring-feedback-error/30' : ''}`}>
            <div className={styles.fieldIcon}>
              <Icon name="user" size={20} />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder={t('form.name.placeholder')}
              className={styles.fieldInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          {errors.name && touched.name && (
            <div className={styles.fieldError}>
              <Icon name="warning-circle" size={14} />
              <span>{errors.name}</span>
            </div>
          )}

          {/* Surname field */}
          <div className={`${styles.field} ${errors.surname && touched.surname ? 'border-feedback-error/60 ring-1 ring-feedback-error/30' : ''}`}>
            <div className={styles.fieldIcon}>
              <Icon name="user" size={20} />
            </div>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder={t('form.surname.placeholder')}
              className={styles.fieldInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          {errors.surname && touched.surname && (
            <div className={styles.fieldError}>
              <Icon name="warning-circle" size={14} />
              <span>{errors.surname}</span>
            </div>
          )}

          {/* Email field */}
          <div className={`${styles.field} ${errors.email && touched.email ? 'border-feedback-error/60 ring-1 ring-feedback-error/30' : ''}`}>
            <div className={styles.fieldIcon}>
              <Icon name="envelope" size={20} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder={t('form.email.placeholder')}
              className={styles.fieldInput}
              dir="ltr" /* Email is always LTR */
            />
          </div>
          {errors.email && touched.email && (
            <div className={styles.fieldError}>
              <Icon name="warning-circle" size={14} />
              <span>{errors.email}</span>
            </div>
          )}

          {/* Phone field with international format */}
          <PhoneInput
            value={formData.telephone}
            onChange={value => setFormData(prev => ({
              ...prev,
              telephone: value || ''
            }))}
            onBlur={handlePhoneBlur}
            placeholder={t('form.phone.placeholder')}
            error={errors.telephone && touched.telephone}
            errorMessage={errors.telephone}
            defaultCountry="ma"
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className={styles.submitBtn}
          iconName={isSubmitting ? 'circlenotch' : undefined}
          iconAnimation={isSubmitting ? 'spin' : undefined}
          iconPosition="right"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? t('form.submitting') || 'Submitting...' : t('form.submit')}
        </Button>
      </form>
    </div>
  );
}