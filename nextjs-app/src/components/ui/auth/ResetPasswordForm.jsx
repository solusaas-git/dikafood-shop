'use client';

import React, { useState } from 'react';
import LucideIcon from '../icons/LucideIcon';
import { useTranslation } from '../../../utils/i18n';

/**
 * Reset Password Form Component
 * @param {Object} props
 * @param {string} props.token - Reset token from URL
 * @param {Function} props.onSuccess - Callback when password is reset successfully
 * @param {Function} props.onBack - Callback to go back to login
 */
const ResetPasswordForm = ({ token, onSuccess, onBack }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess?.(data.message || 'Mot de passe réinitialisé avec succès');
      } else {
        setErrors({ 
          general: data.message || 'Une erreur est survenue lors de la réinitialisation' 
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ 
        general: 'Erreur de connexion. Veuillez réessayer.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-logo-lime/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <LucideIcon name="lock" size="xl" className="text-logo-lime" />
        </div>
        <h2 className="text-2xl font-bold text-dark-green-7 mb-2">
          Nouveau mot de passe
        </h2>
        <p className="text-gray-600 text-sm">
          Choisissez un nouveau mot de passe sécurisé pour votre compte
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
            <LucideIcon name="alertcircle" size="sm" className="text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{errors.general}</span>
          </div>
        )}

        {/* New Password */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Entrez votre nouveau mot de passe"
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent transition-colors ${
                errors.password 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <LucideIcon name={showPassword ? 'eyeoff' : 'eye'} size="md" />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-xs mt-1 flex items-center">
              <LucideIcon name="alertcircle" size="xs" className="mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirmez votre nouveau mot de passe"
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent transition-colors ${
                errors.confirmPassword 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <LucideIcon name={showConfirmPassword ? 'eyeoff' : 'eye'} size="md" />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-xs mt-1 flex items-center">
              <LucideIcon name="alertcircle" size="xs" className="mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-medium mb-2">Exigences du mot de passe :</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className="flex items-center">
              <LucideIcon 
                name={formData.password.length >= 8 ? "check" : "x"} 
                size="xs" 
                className={formData.password.length >= 8 ? "text-green-500 mr-2" : "text-gray-400 mr-2"} 
              />
              Au moins 8 caractères
            </li>
            <li className="flex items-center">
              <LucideIcon 
                name={formData.password === formData.confirmPassword && formData.password ? "check" : "x"} 
                size="xs" 
                className={formData.password === formData.confirmPassword && formData.password ? "text-green-500 mr-2" : "text-gray-400 mr-2"} 
              />
              Les mots de passe correspondent
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-logo-lime text-dark-green-7 rounded-lg hover:bg-logo-lime/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium transition-colors"
        >
          {loading ? (
            <>
              <LucideIcon name="loader" size="sm" className="animate-spin mr-2" />
              Réinitialisation...
            </>
          ) : (
            <>
              <LucideIcon name="check" size="sm" className="mr-2" />
              Réinitialiser le mot de passe
            </>
          )}
        </button>

        {/* Back to Login */}
        <button
          type="button"
          onClick={onBack}
          className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center justify-center transition-colors"
          disabled={loading}
        >
          <LucideIcon name="arrow-left" size="sm" className="mr-2" />
          Retour à la connexion
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
