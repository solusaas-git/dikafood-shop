import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '@/utils/i18n';
import Icon from '@components/ui/icons/Icon';
import config from '@/config';

const translations = {
  en: {
    processing_title: "Verifying Your Account",
    processing_message: "Please wait while we verify your account...",
    success_title: "Account Verified Successfully!",
    success_message: "Welcome to DikaFood! Your account has been verified and you can now start exploring our authentic Moroccan products.",
    error_title: "Verification Failed",
    error_message: "We couldn't verify your account. Please try again or contact support.",
    code_title: "Enter Verification Code",
    code_message: "Please enter the 6-digit verification code sent to your email:",
    code_placeholder: "Enter 6-digit code",
    verify_button: "Verify Account",
    resend_button: "Resend Code",
    login_button: "Start Shopping",
    home_button: "Explore Products",
    try_again: "Try Again",
    invalid_code: "Invalid verification code. Please check and try again.",
    code_sent: "New verification code sent to your email.",
    features: {
      authentic: "🥖 Authentic artisanal products",
      delivery: "🚚 Fast and secure delivery", 
      quality: "⭐ Premium quality guaranteed"
    }
  },
  fr: {
    processing_title: "Vérification de votre compte",
    processing_message: "Veuillez patienter pendant que nous vérifions votre compte...",
    success_title: "Compte vérifié avec succès !",
    success_message: "Bienvenue chez DikaFood ! Votre compte a été vérifié et vous pouvez maintenant commencer à explorer nos produits marocains authentiques.",
    error_title: "Échec de la vérification",
    error_message: "Nous n'avons pas pu vérifier votre compte. Veuillez réessayer ou contacter le support.",
    code_title: "Saisissez le code de vérification",
    code_message: "Veuillez saisir le code de vérification à 6 chiffres envoyé à votre email :",
    code_placeholder: "Saisissez le code à 6 chiffres",
    verify_button: "Vérifier le compte",
    resend_button: "Renvoyer le code",
    login_button: "Commencer vos achats",
    home_button: "Explorer les produits",
    try_again: "Réessayer",
    invalid_code: "Code de vérification invalide. Veuillez vérifier et réessayer.",
    code_sent: "Nouveau code de vérification envoyé à votre email.",
    features: {
      authentic: "🥖 Produits artisanaux authentiques",
      delivery: "🚚 Livraison rapide et sécurisée", 
      quality: "⭐ Qualité premium garantie"
    }
  }
};

const VerificationSuccessPage = () => {
  const { t } = useTranslation(translations);
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const { checkAuth } = useAuth();
  const { success, error } = useNotification();
  const [status, setStatus] = useState('code_input'); // 'code_input', 'processing', 'success', 'error'
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Get email from URL params (passed from signup)
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email, redirect to signup
      router.push('/signup');
    }
  }, [searchParams, router]);

  const verifyCode = async (code, userEmail) => {
    setStatus('processing');
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: userEmail, code })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.success || t('success_message'));
        success('Email verified successfully!');
        
        // Refresh auth state and redirect on successful verification
        setTimeout(async () => {
          await checkAuth();
          router.push('/checkout');
        }, 1500); // Add a small delay for the user to see the success message
      } else {
        setStatus('error');
        setMessage(data.error || t('invalid_code'));
        error('Email verification failed');
      }
    } catch (err) {
      setStatus('error');
      setMessage(t('error_message'));
      error('Email verification failed');
    }
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (verificationCode.length === 6 && email) {
      verifyCode(verificationCode, email);
    } else {
      error('Please enter a valid 6-digit code');
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success(t('code_sent'));
      } else {
        error(data.error || 'Failed to resend code');
      }
    } catch (err) {
      error('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleStartShopping = () => {
    router.push('/shop');
  };

  const handleExploreProducts = () => {
    router.push('/');
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  const renderContent = () => {
    switch (status) {
      case 'code_input':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-logo-lime to-logo-lime/80 flex items-center justify-center shadow-lg">
              <Icon name="mail" size="2xl" className="text-dark-green-7" />
            </div>
            <h1 className="text-3xl font-bold text-dark-green-7 mb-4">{t('code_title')}</h1>
            <p className="text-neutral-700 text-lg mb-8 leading-relaxed">{t('code_message')}</p>
            
            {email && (
              <div className="bg-light-green-1 rounded-lg p-4 mb-6">
                <p className="text-sm text-logo-green">
                  <strong>Email:</strong> {email}
                </p>
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  placeholder={t('code_placeholder')}
                  className="w-full text-center text-2xl font-mono tracking-widest py-4 px-6 border-2 border-logo-lime/30 rounded-xl focus:border-logo-lime focus:outline-none focus:ring-4 focus:ring-logo-lime/20 transition-all duration-300"
                  maxLength={6}
                  autoComplete="off"
                />
              </div>
              
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={verificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-logo-green to-dark-green-2 text-white py-4 px-8 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {t('verify_button')}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="w-full bg-gradient-to-r from-logo-lime to-logo-lime/80 text-dark-green-7 py-3 px-6 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 transform disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : t('resend_button')}
                </button>
              </div>
            </form>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-logo-lime to-logo-lime/80 flex items-center justify-center shadow-lg">
              <Icon name="circlenotch" size="2xl" className="text-dark-green-7 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-dark-green-7 mb-4">{t('processing_title')}</h1>
            <p className="text-neutral-700 text-lg mb-8">{t('processing_message')}</p>
            <div className="flex items-center justify-center">
              <div className="w-8 h-1 bg-logo-lime rounded-full mr-2 animate-pulse"></div>
              <div className="w-8 h-1 bg-logo-lime/60 rounded-full mr-2 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-8 h-1 bg-logo-lime/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-logo-green to-dark-green-2 flex items-center justify-center shadow-lg">
              <Icon name="check" size="2xl" className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-dark-green-7 mb-4">{t('success_title')}</h1>
            <p className="text-neutral-700 text-lg mb-8 leading-relaxed">{message}</p>
            
            {/* Features Section */}
            <div className="bg-gradient-to-br from-light-green-1 to-light-yellow-1/30 rounded-2xl p-6 mb-8 border border-logo-lime/20">
              <h3 className="text-lg font-semibold text-logo-green mb-4">🌟 Ce qui vous attend</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center text-neutral-700">
                  <span className="text-logo-lime mr-3 text-xl">🥖</span>
                  <span className="text-sm">{t('features.authentic')}</span>
                </div>
                <div className="flex items-center text-neutral-700">
                  <span className="text-logo-lime mr-3 text-xl">🚚</span>
                  <span className="text-sm">{t('features.delivery')}</span>
                </div>
                <div className="flex items-center text-neutral-700">
                  <span className="text-logo-lime mr-3 text-xl">⭐</span>
                  <span className="text-sm">{t('features.quality')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleStartShopping}
                className="w-full bg-gradient-to-r from-logo-green to-dark-green-2 text-white py-4 px-8 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
              >
                {t('login_button')}
              </button>
              <button
                onClick={handleExploreProducts}
                className="w-full bg-gradient-to-r from-logo-lime to-logo-lime/80 text-dark-green-7 py-4 px-8 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform border border-logo-lime"
              >
                {t('home_button')}
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <Icon name="warning" size="2xl" className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">{t('error_title')}</h1>
            <p className="text-neutral-700 text-lg mb-8 leading-relaxed">{message}</p>
            
            {/* Support Section */}
            <div className="bg-light-yellow-1 border-l-4 border-logo-lime rounded-r-2xl p-6 mb-8">
              <p className="text-neutral-700 text-sm leading-relaxed">
                <strong className="text-logo-green">🔒 Besoin d'aide ?</strong><br />
                Contactez notre équipe à <a href="mailto:support@dikafood.com" className="text-logo-green underline">support@dikafood.com</a>
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setStatus('code_input');
                  setVerificationCode('');
                  setMessage('');
                }}
                className="w-full bg-gradient-to-r from-logo-green to-dark-green-2 text-white py-4 px-8 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
              >
                {t('try_again')}
              </button>
              <button
                onClick={handleExploreProducts}
                className="w-full bg-gradient-to-r from-logo-lime to-logo-lime/80 text-dark-green-7 py-4 px-8 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
              >
                {t('home_button')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-green-1 via-light-yellow-1/50 to-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-gradient-to-br from-neutral-50 to-light-yellow-1/30 rounded-3xl shadow-2xl p-8 border border-logo-lime/20">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <h2 className="text-4xl font-bold text-logo-green mb-2">DikaFood</h2>
              <p className="text-xs text-neutral-600 uppercase tracking-widest">Authentic Moroccan Products</p>
            </div>
          </div>
          
          {renderContent()}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} DikaFood. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccessPage; 