import React, { useState } from 'react';
import Link from 'next/link';
import { StyledTextField, Checkbox, EnhancedInputField } from '../inputs';
import Icon from '../icons/Icon';
import { useTranslation } from '../../../utils/i18n';
import translations from '../navigation/translations/AuthMenu';

/**
 * Enhanced Login form component with proper icons, muted colors, and compact mode support
 *
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onGoToSignup - Handler to go to signup form
 * @param {Function} [props.onForgotPassword] - Optional handler for forgot password (if not provided, uses Link to /forgot-password)
 * @param {boolean} props.compact - Whether to use compact styling
 */
const LoginForm = ({ onSubmit, onClose, onGoToSignup, onForgotPassword, compact = false }) => {
  const { t } = useTranslation(translations);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t('email_required') || 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('email_invalid') || 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = t('password_required') || 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const loginData = {
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      };

      if (onSubmit) {
        onSubmit(loginData);
      }
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} noValidate suppressHydrationWarning>
        <div className="space-y-3">
          <div>
            <EnhancedInputField
              id="login-email"
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
              <p className="mt-1 text-xs text-feedback-error flex items-center gap-1 ml-3">
                <Icon name="warning" size="xs" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <EnhancedInputField
              id="login-password"
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
              <p className="mt-1 text-xs text-feedback-error flex items-center gap-1 ml-3">
                <Icon name="warning" size="xs" />
                {errors.password}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 mb-4">
          <Checkbox
            id="login-rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            label={<span className="text-xs">{t('remember_me')}</span>}
          />
          {onForgotPassword ? (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-logo-lime hover:underline"
            >
              {t('forgot_password')}
            </button>
          ) : (
            <Link 
              href="/forgot-password" 
              className="text-xs text-logo-lime hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {t('forgot_password')}
            </Link>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 flex items-center justify-center bg-logo-lime/30 border border-logo-lime/70 text-dark-green-7 font-medium rounded-full transition-colors hover:bg-logo-lime/40 text-sm"
        >
          <Icon name="signIn" weight="duotone" size="sm" color="dark-green" className="mr-2" />
          {t('login_button')}
        </button>
      </form>
    );
  }

  // Original form for non-compact mode
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div>
          <EnhancedInputField
            id="login-email"
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
          <EnhancedInputField
            id="login-password"
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
      </div>

      <div className="flex items-center justify-between mt-5 mb-6">
        <Checkbox
          id="login-rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleChange}
          label={t('remember_me')}
        />
        {onForgotPassword ? (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-logo-lime hover:underline"
          >
            {t('forgot_password')}
          </button>
        ) : (
          <Link 
            href="/forgot-password" 
            className="text-sm text-logo-lime hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t('forgot_password')}
          </Link>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-4 flex items-center justify-center bg-logo-lime/30 border border-logo-lime/70 text-dark-green-7 font-medium rounded-full transition-colors hover:bg-logo-lime/40"
      >
        <Icon name="signIn" weight="duotone" size="md" color="dark-green" className="mr-2" />
        {t('login_button')}
      </button>
    </form>
  );
};

export default LoginForm;