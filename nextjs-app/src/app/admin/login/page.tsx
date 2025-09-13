'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LucideIcon from '../../../components/ui/icons/LucideIcon';
import { useTranslation } from '../../../utils/i18n';

export default function AdminLogin() {
  const { login, user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Check if user has admin privileges
      if (user?.role === 'admin' || user?.role === 'manager') {
        router.push('/admin');
      } else {
        // Regular user, redirect to main site
        router.push('/');
      }
    }
  }, [user, isAuthenticated, loading, router]);

  // Don't show loading state for login page - show form immediately
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-logo-lime"></div>
  //     </div>
  //   );
  // }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = t('admin.login.error.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('admin.login.error.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('admin.login.error.passwordRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      if (result.success) {
        const userRole = result.user?.role;
        if (userRole === 'admin' || userRole === 'manager') {
          router.push('/admin');
        } else {
          setErrors({ general: t('admin.login.error.accessDenied') });
        }
      } else {
        setErrors({ general: result.message || t('admin.login.error.loginFailed') });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: t('admin.login.error.tryAgain') });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-logo-lime rounded-full flex items-center justify-center">
            <LucideIcon name="storefront" size="lg" className="text-gray-700" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('admin.login.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('admin.login.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST" action="#">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('admin.login.email.label')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-logo-lime focus:border-logo-lime focus:z-10 sm:text-sm`}
                  placeholder={t('admin.login.email.placeholder')}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <LucideIcon name="envelopesimple" size="sm" className="text-gray-400" />
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('admin.login.password.label')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`appearance-none relative block w-full px-3 py-2 pl-10 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-logo-lime focus:border-logo-lime focus:z-10 sm:text-sm`}
                  placeholder={t('admin.login.password.placeholder')}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <LucideIcon name="lock" size="sm" className="text-gray-400" />
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-logo-lime focus:ring-logo-lime border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                {t('admin.login.rememberMe')}
              </label>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-dark-green-7 bg-logo-lime hover:bg-logo-lime/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-logo-lime disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-green-7 mr-2"></div>
                  {t('admin.login.signingIn')}
                </div>
              ) : (
                <div className="flex items-center">
                  <LucideIcon name="signin" size="sm" className="mr-2 text-gray-700" />
                  {t('admin.login.button')}
                </div>
              )}
            </button>
          </div>

          {/* Back to main site */}
          <div className="text-center">
            <a
              href="/"
              className="text-sm text-logo-lime hover:text-logo-lime/80"
            >
              {t('admin.login.backToSite')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
