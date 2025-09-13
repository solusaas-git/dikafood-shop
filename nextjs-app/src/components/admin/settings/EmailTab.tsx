'use client';

import React, { useState, useEffect } from 'react';
import LucideIcon from '../../ui/icons/LucideIcon';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '@/utils/i18n';

interface EmailSettings {
  _id?: string;
  emailService: 'smtp' | 'gmail';
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  gmailUser: string;
  gmailAppPassword: string;
  fromEmail: string;
  fromName: string;
  forgotPasswordSubject: string;
  testEmail: string;
  lastTested?: string;
  testStatus: 'success' | 'failed' | 'pending';
  testError?: string;
}

const EmailTab: React.FC = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const [settings, setSettings] = useState<EmailSettings>({
    emailService: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPass: '',
    gmailUser: '',
    gmailAppPassword: '',
    fromEmail: 'noreply@dikafood.com',
    fromName: 'DikaFood',
    forgotPasswordSubject: 'Réinitialisation de votre mot de passe - DikaFood',
    testEmail: '',
    testStatus: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Fetch email settings
  const fetchSettings = async () => {
    if (hasInitialLoad) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/email-settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      } else {
        addNotification(t('admin.settings.email.notifications.loadFailed'), 'error');
      }
    } catch (error) {
      console.error('Error fetching email settings:', error);
      addNotification(t('admin.settings.email.notifications.loadError'), 'error');
    } finally {
      setLoading(false);
      setHasInitialLoad(true);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof EmailSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
        addNotification(t('admin.settings.email.notifications.saveSuccess'), 'success');
      } else {
        const errorData = await response.json();
        addNotification(errorData.message || t('admin.settings.email.notifications.saveFailed'), 'error');
      }
    } catch (error) {
      console.error('Error saving email settings:', error);
      addNotification(t('admin.settings.email.notifications.saveError'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Test email configuration
  const handleTestEmail = async () => {
    if (!settings.testEmail) {
      addNotification(t('admin.settings.email.notifications.testEmailRequired'), 'error');
      return;
    }

    setTesting(true);
    try {
      const response = await fetch('/api/admin/email-settings/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ testEmail: settings.testEmail })
      });

      const data = await response.json();
      
      if (response.ok) {
        addNotification(t('admin.settings.email.notifications.testSuccess'), 'success');
        // Refresh settings to get updated test status
        fetchSettings();
      } else {
        addNotification(data.message || t('admin.settings.email.notifications.testFailed'), 'error');
      }
    } catch (error) {
      console.error('Error testing email:', error);
      addNotification(t('admin.settings.email.notifications.testError'), 'error');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LucideIcon name="loader" size="xl" className="animate-spin text-logo-lime" />
        <span className="ml-3 text-gray-600">{t('admin.settings.email.loadingSettings')}</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('admin.settings.email.title')}</h2>
          <p className="text-gray-600">{t('admin.settings.email.subtitle')}</p>
        </div>

        {/* Email Service Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.settings.email.emailService')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              settings.emailService === 'smtp' 
                ? 'border-logo-lime bg-logo-lime/5' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="emailService"
                value="smtp"
                checked={settings.emailService === 'smtp'}
                onChange={(e) => handleInputChange('emailService', e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center">
                <LucideIcon name="mail" size="lg" className="text-logo-lime mr-3" />
                <div>
                  <div className="font-medium">{t('admin.settings.email.smtpServer')}</div>
                  <div className="text-sm text-gray-500">{t('admin.settings.email.smtpDescription')}</div>
                </div>
              </div>
            </label>

            <label className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              settings.emailService === 'gmail' 
                ? 'border-logo-lime bg-logo-lime/5' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="emailService"
                value="gmail"
                checked={settings.emailService === 'gmail'}
                onChange={(e) => handleInputChange('emailService', e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center">
                <LucideIcon name="mail" size="lg" className="text-red-500 mr-3" />
                <div>
                  <div className="font-medium">{t('admin.settings.email.gmail')}</div>
                  <div className="text-sm text-gray-500">{t('admin.settings.email.gmailDescription')}</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* SMTP Configuration */}
        {settings.emailService === 'smtp' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.settings.email.smtpConfiguration')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.settings.email.smtpHost')}
                </label>
                <input
                  type="text"
                  value={settings.smtpHost || ''}
                  onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                  placeholder="smtp.example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.settings.email.smtpPort')}
                </label>
                <input
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
                  placeholder="587"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.settings.email.username')}
                </label>
                <input
                  type="text"
                  value={settings.smtpUser || ''}
                  onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.settings.email.password')}
                </label>
                <input
                  type="password"
                  value={settings.smtpPass || ''}
                  onChange={(e) => handleInputChange('smtpPass', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.smtpSecure}
                  onChange={(e) => handleInputChange('smtpSecure', e.target.checked)}
                  className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {t('admin.settings.email.useSslTls')}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Gmail Configuration */}
        {settings.emailService === 'gmail' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.settings.email.gmailConfiguration')}</h3>
            
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <LucideIcon name="info" size="md" className="text-blue-500 mr-2 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">{t('admin.settings.email.gmailRequired')}</p>
                  <p>{t('admin.settings.email.gmailRequiredDescription')}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.settings.email.gmailAddress')}
                </label>
                <input
                  type="email"
                  value={settings.gmailUser || ''}
                  onChange={(e) => handleInputChange('gmailUser', e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.settings.email.appPassword')}
                </label>
                <input
                  type="password"
                  value={settings.gmailAppPassword || ''}
                  onChange={(e) => handleInputChange('gmailAppPassword', e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* General Email Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.settings.email.generalSettings')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.settings.email.fromEmail')}
              </label>
              <input
                type="email"
                value={settings.fromEmail || ''}
                onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                placeholder="noreply@dikafood.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.settings.email.fromName')}
              </label>
              <input
                type="text"
                value={settings.fromName || ''}
                onChange={(e) => handleInputChange('fromName', e.target.value)}
                placeholder="DikaFood"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.settings.email.forgotPasswordSubject')}
            </label>
            <input
              type="text"
              value={settings.forgotPasswordSubject || ''}
              onChange={(e) => handleInputChange('forgotPasswordSubject', e.target.value)}
              placeholder="Réinitialisation de votre mot de passe - DikaFood"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
            />
          </div>
        </div>

        {/* Test Email */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.settings.email.testConfiguration')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.settings.email.testEmailAddress')}
              </label>
              <input
                type="email"
                value={settings.testEmail || ''}
                onChange={(e) => handleInputChange('testEmail', e.target.value)}
                placeholder="test@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              />
            </div>

            <div>
              <button
                onClick={handleTestEmail}
                disabled={testing || !settings.testEmail}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {testing ? (
                  <>
                    <LucideIcon name="loader" size="sm" className="animate-spin mr-2" />
                    {t('admin.settings.email.testing')}
                  </>
                ) : (
                  <>
                    <LucideIcon name="mail" size="sm" className="mr-2" />
                    {t('admin.settings.email.sendTest')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Status */}
          {settings.lastTested && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LucideIcon 
                    name={settings.testStatus === 'success' ? 'check-circle' : 'x-circle'} 
                    size="sm" 
                    className={settings.testStatus === 'success' ? 'text-green-500' : 'text-red-500'}
                  />
                  <span className="ml-2 text-sm font-medium">
                    {t('admin.settings.email.lastTest')}: {settings.testStatus === 'success' ? t('admin.settings.email.success') : t('admin.settings.email.failed')}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(settings.lastTested).toLocaleString()}
                </span>
              </div>
              {settings.testError && (
                <p className="mt-2 text-sm text-red-600">{settings.testError}</p>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-logo-lime text-dark-green-7 rounded-md hover:bg-logo-lime/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <LucideIcon name="loader" size="sm" className="animate-spin mr-2" />
                {t('admin.settings.email.saving')}
              </>
            ) : (
              <>
                <LucideIcon name="check" size="sm" className="mr-2" />
                {t('admin.settings.email.saveSettings')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTab;
