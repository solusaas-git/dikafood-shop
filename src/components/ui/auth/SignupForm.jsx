import React, { useState } from 'react';
import Link from 'next/link';
import { StyledTextField, Checkbox, PhoneInput, EnhancedInputField } from '../inputs';
import Icon from '../icons/Icon';
import { useTranslation } from '../../../utils/i18n';
import translations from '../navigation/translations/AuthMenu';

/**
 * Enhanced Signup form component with proper icons, muted colors, phone input, and compact mode support
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onBackToLogin - Handler to go back to login form
 * @param {boolean} props.compact - Whether to use compact styling
 */
const SignupForm = ({ onSubmit, onClose, onBackToLogin, compact = false }) => {
  const { t } = useTranslation(translations);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle phone number change separately
  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value || ''
    }));

    // Clear phone error when user changes phone
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('first_name_required') || 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('last_name_required') || 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = t('email_required') || 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('email_invalid') || 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = t('password_required') || 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = t('password_too_short') || 'Password must be at least 8 characters';
    } else if (formData.password.length > 30) {
      newErrors.password = t('password_too_long') || 'Password must be at most 30 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = t('password_uppercase') || 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = t('password_lowercase') || 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = t('password_number') || 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = t('password_special') || 'Password must contain at least one special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('confirm_password_required') || 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwords_dont_match') || 'Passwords don\'t match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t('terms_required') || 'You must agree to the terms';
    }

    // Phone validation (optional but validate format if provided)
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = t('phone_invalid') || 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Create a clean object with the needed properties
      const signupData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phoneNumber.trim() || undefined // Use 'phone' field name expected by backend
      };

      if (onSubmit) {
        onSubmit(signupData);
      }
    } else {
      console.error('Form validation failed:', errors);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} noValidate suppressHydrationWarning>
        <div className="space-y-1.5 md:space-y-2">
          <div className="grid grid-cols-2 gap-1 md:gap-1.5">
            <div>
              <EnhancedInputField
                id="signup-firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('first_name_placeholder')}
                icon="user"
                compact={compact}
                required
              />
              {errors.firstName && (
                <p className="mt-0.5 text-[10px] text-feedback-error flex items-center gap-0.5 ml-2">
                  <Icon name="warning" size="xs" />
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <EnhancedInputField
                id="signup-lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('last_name_placeholder')}
                icon="user"
                compact={compact}
                required
              />
              {errors.lastName && (
                <p className="mt-0.5 text-[10px] text-feedback-error flex items-center gap-0.5 ml-2">
                  <Icon name="warning" size="xs" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <EnhancedInputField
              id="signup-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('email_placeholder')}
              icon="envelope"
              compact={compact}
              required
            />
            {errors.email && (
              <p className="mt-0.5 text-[10px] text-feedback-error flex items-center gap-0.5 ml-2">
                <Icon name="warning" size="xs" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <PhoneInput
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              placeholder={t('phone_placeholder') || '+212XXXXXXXXX'}
              error={!!errors.phoneNumber}
              errorMessage={errors.phoneNumber}
              defaultCountry="ma"
              compact={compact}
              className="phone-input-signup-compact"
            />
          </div>

          <div>
            <EnhancedInputField
              id="signup-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('password_placeholder')}
              icon="lock"
              compact={compact}
              required
            />
            {errors.password && (
              <p className="mt-0.5 text-[10px] text-feedback-error flex items-center gap-0.5 ml-2">
                <Icon name="warning" size="xs" />
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <EnhancedInputField
              id="signup-confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t('confirm_password_placeholder')}
              icon="lock"
              compact={compact}
              required
            />
            {errors.confirmPassword && (
              <p className="mt-0.5 text-[10px] text-feedback-error flex items-center gap-0.5 ml-2">
                <Icon name="warning" size="xs" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="mt-1.5 mb-2 md:mt-2 md:mb-3">
          <Checkbox
            id="signup-agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            label={
              <span className="text-xs">
                {t('agree_terms_1')}{' '}
                <Link href="/terms" className="text-logo-lime hover:underline" onClick={(e) => e.stopPropagation()}>
                  {t('terms_conditions')}
                </Link>{' '}
                {t('agree_terms_2')}
              </span>
            }
          />
          {errors.agreeTerms && (
            <p className="mt-0.5 text-[10px] text-feedback-error flex items-center gap-0.5 ml-2">
              <Icon name="warning" size="xs" />
              {errors.agreeTerms}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 md:py-2.5 px-3 md:px-4 flex items-center justify-center bg-logo-lime/30 border border-logo-lime/70 text-dark-green-7 font-medium rounded-full transition-colors hover:bg-logo-lime/40 text-xs md:text-sm"
        >
          <Icon name="user" weight="duotone" size="sm" color="dark-green" className="mr-2" />
          {t('register_button')}
        </button>
      </form>
    );
  }

  // Original form for non-compact mode
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <EnhancedInputField
              id="signup-firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t('first_name_placeholder')}
              icon="user"
              compact={compact}
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-feedback-error flex items-center gap-1 ml-3">
                <Icon name="warning" size="xs" />
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <EnhancedInputField
              id="signup-lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t('last_name_placeholder')}
              icon="user"
              compact={compact}
              required
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-feedback-error flex items-center gap-1 ml-3">
                <Icon name="warning" size="xs" />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <EnhancedInputField
            id="signup-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('email_placeholder')}
            icon="envelope"
            compact={compact}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-feedback-error flex items-center gap-1 ml-3">
              <Icon name="warning" size="xs" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <PhoneInput
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            placeholder={t('phone_placeholder') || '+212XXXXXXXXX'}
            error={!!errors.phoneNumber}
            errorMessage={errors.phoneNumber}
            defaultCountry="ma"
            compact={compact}
            className="phone-input-signup"
          />
        </div>

        <div>
          <EnhancedInputField
            id="signup-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('password_placeholder')}
            icon="lock"
            compact={compact}
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-feedback-error flex items-center gap-1 ml-3">
              <Icon name="warning" size="xs" />
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <EnhancedInputField
            id="signup-confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t('confirm_password_placeholder')}
            icon="lock"
            compact={compact}
            required
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-feedback-error flex items-center gap-1 ml-3">
              <Icon name="warning" size="xs" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 mb-6">
        <Checkbox
          id="signup-agreeTerms"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          label={
            <span>
              {t('agree_terms_1')}{' '}
              <Link href="/terms" className="text-logo-lime hover:underline" onClick={(e) => e.stopPropagation()}>
                {t('terms_conditions')}
              </Link>{' '}
              {t('agree_terms_2')}
            </span>
          }
        />
        {errors.agreeTerms && (
          <p className="mt-1 text-sm text-feedback-error flex items-center gap-1 ml-3">
            <Icon name="warning" size="xs" />
            {errors.agreeTerms}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-4 flex items-center justify-center bg-logo-lime/30 border border-logo-lime/70 text-dark-green-7 font-medium rounded-full transition-colors hover:bg-logo-lime/40"
      >
        <Icon name="userPlus" weight="duotone" size="md" color="dark-green" className="mr-2" />
        {t('create_account_button')}
      </button>
    </form>
  );
};

export default SignupForm;