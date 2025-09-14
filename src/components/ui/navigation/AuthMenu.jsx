import React, { useState, useEffect, memo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import translations from './translations/AuthMenu';
import Menu from './Menu';
import MenuTrigger from './MenuTrigger';
import LucideIcon from '../icons/LucideIcon';
import Modal from '../feedback/Modal';
import { LoginForm, SignupForm } from '../auth';
import ResetPasswordForm from '../auth/ResetPasswordForm';
import { useTranslation } from '../../../utils/i18n';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import ContentContainer from '../layout/ContentContainer';
import { eventBus, EVENTS } from '../../../utils/eventBus';
import config from '@/config';

/**
 * Authentication menu component
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isMobile - Whether the component is in mobile view
 * @param {boolean} props.isNavbarMobile - Whether the component is in a mobile navbar
 * @param {Function} props.onClose - Function to call when menu closes
 * @param {boolean} props.isGrouped - Whether the menu is part of a grouped container
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onToggle - Function to call when menu is toggled
 */
const AuthMenu = ({
  isMobile = false,
  isNavbarMobile = false,
  onClose,
  isGrouped = false,
  isOpen,
  onToggle,
}) => {
  const { t } = useTranslation(translations);
  const { isLoggedIn, user, logout, loading, login, signup, refreshProfile } = useAuth();
  const { refreshCart } = useCart();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [formError, setFormError] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Listen for signup success events to handle verification redirect
  useEffect(() => {
    const handleSignupSuccess = (data) => {
      // Close menu on successful signup
      if (onClose) {
        onClose();
      }
      
      // Redirect to verification page with email parameter
      setTimeout(() => {
        const email = data.email || data.data?.email;
        if (email) {
          window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
        } else {
          window.location.href = '/verify-email';
        }
      }, 500);
    };

    // Subscribe to signup success events
    const unsubscribe = eventBus.on(EVENTS.AUTH_SIGNUP_SUCCESS, handleSignupSuccess);

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [onClose]);

  // Check for reset password token in URL - runs immediately on component mount
  useEffect(() => {
    const checkForResetToken = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          setResetToken(token);
          setIsResetPassword(true);
          setIsForgotPassword(false);
          setIsRegistering(false);
          
          // Open the modal - force it to open
          if (onToggle) {
            // Use setTimeout to ensure the component has rendered
            setTimeout(() => {
              onToggle(true);
            }, 100);
          }
          
          // Clean URL without refreshing
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }
    };

    // Run immediately
    checkForResetToken();
    
    // Also run when the component mounts or when the URL changes
    const handlePopState = () => {
      checkForResetToken();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onToggle]);

  // Handle login form submission using auth context
  const handleLoginSubmit = useCallback(async (formData) => {
    setFormError('');
    setLocalLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setFormError('Email and password are required');
        setLocalLoading(false);
        return;
      }

      const credentials = {
        email: formData.email,
        password: formData.password
      };

      // Use auth context login method instead of direct fetch
      const response = await login(credentials);

      if (!response.success) {
        setFormError(response.error || t('login_error'));
        setLocalLoading(false);
        return;
      }

      // Refresh cart to get the transferred items from guest to customer
      try {
        await refreshCart();
      } catch (cartError) {
        console.warn('Failed to refresh cart after login:', cartError);
      }

      // Close menu on successful login
      if (onClose) {
        onClose();
      }

    } catch (err) {
      setFormError(err.message || t('login_error'));
    } finally {
      setLocalLoading(false);
    }
  }, [login, refreshCart, onClose, t]);

  // Handle signup form submission using auth context
  const handleSignupSubmit = useCallback(async (formData) => {
    setFormError('');
    setLocalLoading(true);

    try {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setFormError('All required fields must be filled out');
        setLocalLoading(false);
        return;
      }

      // Parse phone number into the format expected by the backend
      let phoneData = null;

      if (formData.phoneNumber && formData.phoneNumber.trim()) {
        // Parse the international phone number
        const phoneNumber = formData.phoneNumber.trim();
        
        // Extract country calling code (assuming it starts with +)
        if (phoneNumber.startsWith('+')) {
          // For Morocco (+212)
          if (phoneNumber.startsWith('+212')) {
            phoneData = {
              country: 'MA',
              countryCallingCode: '+212',
              national: phoneNumber.substring(4), // Remove +212
              international: phoneNumber
            };
          } else {
            // For other countries, try to extract the calling code
            // This is a simplified approach - you might want to use a phone parsing library
            const callingCodeMatch = phoneNumber.match(/^\+(\d{1,3})/);
            if (callingCodeMatch) {
              const callingCode = '+' + callingCodeMatch[1];
              const nationalNumber = phoneNumber.substring(callingCode.length);
              phoneData = {
                country: 'MA', // Default to Morocco for now
                countryCallingCode: callingCode,
                national: nationalNumber,
                international: phoneNumber
              };
            }
          }
        } else {
          // If no + prefix, assume it's a Moroccan number
          phoneData = {
            country: 'MA',
            countryCallingCode: '+212',
            national: phoneNumber,
            international: '+212' + phoneNumber
          };
        }
      }

      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        ...(phoneData && { phone: phoneData.international }) // Only include phone if provided
      };

      console.log('Sending signup data:', signupData); // Debug log

      // Use auth context signup method
      const response = await signup(signupData);

      if (!response.success) {
        setFormError(response.error || t('register_error'));
        setLocalLoading(false);
        return;
      }

      // Note: Menu close and redirect are handled by the event listener
      // No need to manually close here

    } catch (err) {
      setFormError(err.message || t('register_error'));
    } finally {
      setLocalLoading(false);
    }
  }, [signup, t]);

  // Handle forgot password form submission
  const handleForgotPasswordSubmit = useCallback(async (email) => {
    setFormError('');
    setLocalLoading(true);
    
    try {
      // Call forgot password API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset link');
      }

      // Show success message and reset to login
      const data = await response.json();
      alert(data.message || t('reset_link_sent'));
      setIsForgotPassword(false);
      
    } catch (error) {
      setFormError(error.message || 'Failed to send reset link');
    } finally {
      setLocalLoading(false);
    }
  }, [t]);

  // Handle reset password success
  const handleResetPasswordSuccess = useCallback((message) => {
    alert(message || 'Votre mot de passe a été réinitialisé avec succès');
    setIsResetPassword(false);
    setResetToken('');
    setIsForgotPassword(false);
    setIsRegistering(false);
    setFormError('');
  }, []);

  // Handle back to login from reset password
  const handleBackToLogin = useCallback(() => {
    setIsResetPassword(false);
    setResetToken('');
    setIsForgotPassword(false);
    setIsRegistering(false);
    setFormError('');
  }, []);

  // Handle logout using auth context
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      // Close menu after logout
      if (onClose) {
        onClose();
      }
    } catch (error) {
      setFormError(t('logout_error'));
    }
  }, [logout, onClose, t]);

  // Toggle between login and signup forms
  const toggleAuthMode = useCallback(() => {
    setIsRegistering(!isRegistering);
    setFormError('');
  }, [isRegistering]);

  // Get first name for display in trigger
  const getFirstName = (user) => {
    if (!user) return '';

    // Capitalize first letter of firstName if it exists
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
    }

    if (user.name) {
      const firstName = user.name.split(' ')[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    }

    return '';
  };

  // Get full name for display
  const getFullName = (user) => {
    if (!user) return t('auth.guest');
    if (user.name) return user.name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return t('auth.user');
  };

  // Handler for manually refreshing user profile (only when explicitly requested)
  const refreshUserProfile = useCallback(async () => {
    if (!isLoggedIn) return;

    setIsProfileLoading(true);
    try {
      await refreshProfile(); // force refresh from API
      setFormError(null);
    } catch (err) {
      setFormError(t('auth.profileError'));
    } finally {
      setIsProfileLoading(false);
    }
  }, [isLoggedIn, refreshProfile, t]);

  // Only refresh profile when explicitly requested (removed auto-refresh on menu open)

  // User badge class based on screen size
  const userBadgeClass = isMobile
    ? "absolute -bottom-1 -right-1.5 w-4 h-4 rounded-full bg-logo-lime flex items-center justify-center text-dark-green-7 text-[8px] font-medium ring-1 ring-white"
    : "absolute -bottom-1 -right-1.5 w-5 h-5 rounded-full bg-logo-lime flex items-center justify-center text-dark-green-7 text-[10px] font-medium ring-1 ring-white";

  // Render header content
  const renderHeader = () => {
    if (isLoggedIn && user) {
      return (
        <div className="flex items-center gap-3 py-3 bg-gradient-to-br from-amber-50 to-amber-100/70 border-b border-logo-lime/20">
          <div className="w-10 h-10 rounded-full bg-logo-lime/20 border border-logo-lime/40 flex items-center justify-center ml-3">
            <LucideIcon name="user" size="lg" weight="duotone" className="text-dark-green-7" />
          </div>
          <h3 className="text-lg font-medium text-dark-green-7 truncate max-w-[220px]">{t('profile')}</h3>
        </div>
      );
    }

    // Auth forms header with toggle
    return (
      <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 border-b border-logo-lime/20">
        {/* Title section */}
        <div className="flex items-center gap-3 py-3">
          <div className="w-10 h-10 rounded-full bg-logo-lime/20 border border-logo-lime/40 flex items-center justify-center ml-3">
            <LucideIcon name="user" size="lg" weight="duotone" className="text-dark-green-7" />
          </div>
          <h3 className="text-lg font-medium text-dark-green-7 truncate max-w-[200px]">
            {isResetPassword ? 'Nouveau mot de passe' : (isForgotPassword ? t('forgot_password_title') : (isRegistering ? t('register_title') : t('login')))}
          </h3>
        </div>
        
        {/* Toggle switch - Hide in forgot password and reset password modes */}
        {!isForgotPassword && !isResetPassword && (
          <div className="flex items-center justify-center pb-3">
            <div className="flex bg-white/50 border border-logo-lime/30 rounded-full p-1">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                !isRegistering 
                  ? 'bg-logo-lime/30 text-dark-green-7 shadow-sm' 
                  : 'text-dark-green-6 hover:text-dark-green-7'
              }`}
            >
              {t('login')}
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(true)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                isRegistering 
                  ? 'bg-logo-lime/30 text-dark-green-7 shadow-sm' 
                  : 'text-dark-green-6 hover:text-dark-green-7'
              }`}
            >
              {t('register_link')}
            </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Handle profile button click
  const handleProfileClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to dedicated profile page instead of modal
    window.location.href = '/profile';
    if (onToggle) {
      onToggle(false);
    }
    if (onClose) {
      onClose(); // Close the menu
    }
  }, [onToggle, onClose]);

  // Render login/register form or user profile based on authentication status
  // Forgot Password Form Component
  const ForgotPasswordForm = ({ onSubmit, onBackToLogin, loading, error }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setEmailError('');

      if (!email) {
        setEmailError(t('email_required'));
        return;
      }

      if (!validateEmail(email)) {
        setEmailError(t('email_invalid'));
        return;
      }

      onSubmit(email);
    };

    return (
      <div className="p-6 space-y-4">
        {/* Description */}
        <p className="text-sm text-dark-green-6 text-center leading-relaxed">
          {t('forgot_password_description')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_reset_placeholder')}
              className="w-full px-4 py-3 border border-logo-lime/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-logo-lime/50 focus:border-logo-lime bg-white/90"
              disabled={loading}
            />
            {emailError && (
              <p className="text-xs text-red-600 mt-1">{emailError}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 flex items-center justify-center bg-logo-lime/30 border border-logo-lime/70 text-dark-green-7 font-medium rounded-full transition-colors hover:bg-logo-lime/40 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <LucideIcon name="loader" size="sm" className="mr-2 animate-spin" />
                {t('loading')}
              </>
            ) : (
              <>
                <LucideIcon name="mail" size="sm" className="mr-2" />
                {t('send_reset_link')}
              </>
            )}
          </button>

          {/* Back to Login */}
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-2 text-sm text-logo-lime hover:underline"
          >
            {t('back_to_login_link')}
          </button>
        </form>
      </div>
    );
  };

  const renderContent = () => {
    if (loading || localLoading) {
      return (
        <div className="p-4 flex flex-col items-center justify-center h-32">
          <div className="w-8 h-8 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center mb-3">
            <div className="animate-spin text-dark-green-7">
              <LucideIcon name="circlenotch" size="md" weight="duotone" />
            </div>
          </div>
          <p className="text-dark-green-7 font-medium text-sm">{t('loading')}</p>
        </div>
      );
    }

    if (isLoggedIn && user) {
      return (
        <div className="p-4 bg-gradient-to-br from-amber-50/80 to-amber-100/40">
          {/* User Profile Summary */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-logo-lime/20 border border-logo-lime/40 text-dark-green-7 flex items-center justify-center font-medium text-lg shadow-sm">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-dark-green-7 capitalize truncate">{getFullName(user)}</h3>
              <p className="text-xs text-dark-green-6 truncate">{user.email}</p>
              {(user.isVerified || user.isEmailVerified) ? (
                <span className="inline-flex items-center gap-1 text-xs text-logo-lime font-medium">
                  <LucideIcon name="checkCircle" size="xs" weight="fill" />
                  {t('account_verified')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <LucideIcon name="clock" size="xs" weight="fill" />
                  {t('account_pending')}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white/70 border border-logo-lime/20 rounded-lg text-left text-sm font-medium text-dark-green-7 hover:bg-white/90 transition-all icon-text-separator"
            >
              <div className="w-7 h-7 rounded-full bg-logo-lime/10 border border-logo-lime/20 flex items-center justify-center">
                <LucideIcon name="user" size="sm" weight="duotone" color="dark-green" />
              </div>
              <span>{t('profile')}</span>
            </button>
            
            <div className="flex items-center gap-3 px-4 py-3 bg-white/70 border border-logo-lime/20 rounded-lg text-left text-sm font-medium text-dark-green-7/50 cursor-not-allowed relative group icon-text-separator">
              <div className="w-7 h-7 rounded-full bg-logo-lime/10 border border-logo-lime/20 flex items-center justify-center opacity-70">
                <LucideIcon name="shoppingBag" size="sm" weight="duotone" color="dark-green" />
              </div>
              <span>{t('orders')}</span>
              <div className="absolute right-3 px-1.5 py-0.5 bg-amber-100/70 rounded-full text-[9px] text-amber-700 border border-amber-200/70">
                {t('coming_soon')}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-logo-lime/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white text-feedback-error font-medium rounded-lg border border-feedback-error/30 hover:bg-feedback-error/10 transition-all icon-text-separator text-sm"
            >
              <LucideIcon name="signOut" size="sm" className="text-feedback-error" />
              {t('logout')}
            </button>
          </div>
        </div>
      );
    }

    // Compact Auth Forms
    return (
      <div className="p-4">
        {/* Error Message */}
        {formError && (
          <div className="bg-feedback-error/10 border border-feedback-error/30 text-feedback-error p-3 rounded-lg mb-4 text-sm">
            <div className="flex items-center gap-2">
              <LucideIcon name="warning" size="sm" weight="duotone" color="error" />
              <span className="font-medium">{formError}</span>
            </div>
          </div>
        )}

        {/* Form Content */}
        {isResetPassword ? (
          <ResetPasswordForm
            token={resetToken}
            onSuccess={handleResetPasswordSuccess}
            onBack={handleBackToLogin}
          />
        ) : isForgotPassword ? (
          <ForgotPasswordForm
            onSubmit={handleForgotPasswordSubmit}
            onBackToLogin={() => setIsForgotPassword(false)}
            loading={localLoading}
            error={formError}
          />
        ) : isRegistering ? (
          <SignupForm
            onSubmit={handleSignupSubmit}
            onClose={onClose}
            onBackToLogin={() => setIsRegistering(false)}
            compact={true}
          />
        ) : (
          <LoginForm
            onSubmit={handleLoginSubmit}
            onClose={onClose}
            onForgotPassword={() => setIsForgotPassword(true)}
            compact={true}
          />
        )}
      </div>
    );
  };

  // Trigger component for the menu
  const triggerComponent = (
    <div className="relative flex items-center">
      <MenuTrigger
        variant={isNavbarMobile ? 'transparent' : isMobile ? 'yellow' : 'glass'}
        size={isMobile ? 'icon' : 'md'}
        rounded={isMobile ? 'full' : 'default'}
        isMobile={isMobile}
        isNavbarMobile={isNavbarMobile}
        withCaret={false}
        withMobileIndicator={isMobile && isNavbarMobile && !isGrouped}
        isGrouped={isGrouped}
        isOpen={isOpen}
        className={!isMobile ? 'icon-text-separator' : ''}
        icon={
          <div className="relative flex items-center justify-center">
            <LucideIcon name="user" weight="duotone" size={isMobile ? "md" : "md"} />
          </div>
        }
      >
        {!isMobile && (isLoggedIn && user ? getFirstName(user) : t('account'))}
      </MenuTrigger>
    </div>
  );

  // Memoized Real-time Background Elements Component
  const RealTimeElements = React.memo(() => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [locationInfo, setLocationInfo] = useState(null);
    const [weatherInfo, setWeatherInfo] = useState(null);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);

    // Olive oil tips and benefits in French
    const oliveOilHints = [
      {
        icon: 'leaf',
        text: "L'huile d'olive extra vierge contient plus de 30 composés phénoliques aux propriétés antioxydantes."
      },
      {
        icon: 'heart',
        text: "Consommer 2 cuillères à soupe d'huile d'olive par jour réduit le risque de maladies cardiovasculaires."
      },
      {
        icon: 'star',
        text: "L'huile d'olive marocaine est reconnue mondialement pour sa qualité exceptionnelle et son goût unique."
      },
      {
        icon: 'sun',
        text: "L'huile d'olive se conserve mieux dans un endroit frais et sombre, à l'abri de la lumière."
      },
      {
        icon: 'droplets',
        text: "L'acidité d'une huile d'olive extra vierge ne doit pas dépasser 0,8% pour garantir sa qualité."
      },
      {
        icon: 'brain',
        text: "Les antioxydants de l'huile d'olive protègent le cerveau et améliorent les fonctions cognitives."
      },
      {
        icon: 'shield',
        text: "L'huile d'olive renforce le système immunitaire grâce à ses propriétés anti-inflammatoires."
      },
      {
        icon: 'sparkles',
        text: "L'huile d'olive extra vierge à froid préserve tous ses bienfaits nutritionnels et son arôme."
      },
      {
        icon: 'zap',
        text: "L'huile d'olive augmente l'absorption des vitamines A, D, E et K par l'organisme."
      },
      {
        icon: 'award',
        text: "Le Maroc produit certaines des meilleures huiles d'olive au monde, notamment dans les régions de Meknès et Fès."
      }
    ];

    // Update time every second
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    // Rotate olive oil hints every 5 seconds
    useEffect(() => {
      const hintTimer = setInterval(() => {
        setCurrentHintIndex((prevIndex) => 
          (prevIndex + 1) % oliveOilHints.length
        );
      }, 5000);
      return () => clearInterval(hintTimer);
    }, [oliveOilHints.length]);

    // Get user location and weather - using fallback data to avoid CORS issues
    useEffect(() => {
      // Set fallback location and weather data
      // In production, you could use a backend API to get this data
      setLocationInfo({
        city: 'Casablanca',
        country: 'Maroc',
        timezone: 'Africa/Casablanca'
      });
      
      // Generate random weather data for demo
      const conditions = ['Ensoleillé', 'Nuageux', 'Partiellement nuageux'];
      const temps = [18, 19, 20, 21, 22, 23, 24, 25, 26];
      
      setWeatherInfo({
        temp: temps[Math.floor(Math.random() * temps.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        icon: '01d'
      });
    }, []);

    const formatTime = (date) => {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    };

    const formatDate = (date) => {
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    };

    // Translate weather conditions to French
    const translateWeatherCondition = (condition) => {
      const translations = {
        'Clear': 'Ensoleillé',
        'Clouds': 'Nuageux',
        'Rain': 'Pluvieux',
        'Snow': 'Neigeux',
        'Thunderstorm': 'Orageux',
        'Drizzle': 'Bruine',
        'Mist': 'Brumeux',
        'Fog': 'Brouillard',
        'Haze': 'Voilé',
        'Sunny': 'Ensoleillé'
      };
      return translations[condition] || condition;
    };

    // Translate common country names to French
    const translateCountryName = (country) => {
      const translations = {
        'Morocco': 'Maroc',
        'France': 'France',
        'Spain': 'Espagne',
        'United States': 'États-Unis',
        'United Kingdom': 'Royaume-Uni',
        'Germany': 'Allemagne',
        'Italy': 'Italie',
        'Belgium': 'Belgique',
        'Netherlands': 'Pays-Bas',
        'Canada': 'Canada',
        'Algeria': 'Algérie',
        'Tunisia': 'Tunisie'
      };
      return translations[country] || country;
    };

    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Right Side Panel - All Elements Vertically Stacked */}
        <div className="absolute top-8 right-8 flex flex-col gap-4">
          
          {/* Location */}
          {locationInfo && (
            <div className="text-sm font-medium">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20">
                <LucideIcon name="map-pin" size="sm" className="text-dark-green-7" />
                <span className="text-dark-green-7">{locationInfo.city}, {translateCountryName(locationInfo.country)}</span>
              </div>
            </div>
          )}

          {/* Weather */}
          {weatherInfo && (
            <div className="text-sm font-medium">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20">
                <LucideIcon name="cloud" size="sm" className="text-dark-green-7" />
                <span className="text-dark-green-7">{weatherInfo.temp}°C • {translateWeatherCondition(weatherInfo.condition)}</span>
              </div>
            </div>
          )}

          {/* Time - Larger Card */}
          <div className="font-medium">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg border border-white/30">
              <div className="flex items-center gap-3">
                <LucideIcon name="clock" size="md" className="text-logo-lime" />
                <div>
                  <div className="text-xl font-bold text-dark-green-7">{formatTime(currentTime)}</div>
                  <div className="text-xs text-dark-green-6">{formatDate(currentTime)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Tag */}
          <div className="text-xs">
            <div className="flex items-center gap-2 bg-dark-green-7/90 backdrop-blur-md rounded-full px-3 py-2 shadow-lg border border-logo-lime/30">
              <LucideIcon name="leaf" size="sm" className="text-logo-lime" />
              <span className="text-white">DikaFood • Authenticité Marocaine</span>
            </div>
          </div>

        </div>

        {/* Bottom Center - Dynamic Olive Oil Hints */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-2xl">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 text-center shadow-xl border border-white/30">
            <div className="flex items-center justify-center gap-3">
              <LucideIcon 
                name={oliveOilHints[currentHintIndex].icon} 
                size="md" 
                className="text-logo-lime flex-shrink-0" 
              />
              <p className="text-sm font-medium leading-relaxed text-dark-green-7">
                {oliveOilHints[currentHintIndex].text}
              </p>
            </div>
            {/* Progress indicator */}
            <div className="flex justify-center gap-1 mt-3">
              {oliveOilHints.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-1 rounded-full transition-all duration-300 ${
                    index === currentHintIndex 
                      ? 'bg-logo-lime w-6' 
                      : 'bg-dark-green-6/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Memoized Portal Modal Component to prevent unnecessary re-renders
  const AuthModalPortal = React.useMemo(() => {
    // Prevent rendering if not open
    if (!isOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
        {/* Backdrop with green-tinted blur */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-dark-green-7/30 via-logo-lime/20 to-dark-green-6/40 backdrop-blur-md"
          onClick={(e) => {
            // Only close if clicking directly on the backdrop, not on child elements
            if (e.target === e.currentTarget && onClose) {
              onClose();
            }
          }}
        >
          {/* Real-time elements overlay */}
          <RealTimeElements />
        </div>
        
        {/* Modal Content */}
        <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-logo-lime/30 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-dark-green-6 hover:text-dark-green-7 transition-all shadow-lg hover:shadow-xl border border-logo-lime/20"
          >
            <LucideIcon name="x" size="md" />
          </button>

          {renderHeader && (
            <div className="border-b border-logo-lime/30 bg-gradient-to-r from-logo-lime/5 to-logo-lime/10">
              {renderHeader()}
            </div>
          )}
          
          <div className="max-h-[75vh] overflow-y-auto p-2">
            <div className="space-y-1">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }, [isOpen, isRegistering, isForgotPassword, isResetPassword, formError, localLoading, resetToken]);

  return (
    <>
      {/* Trigger Button */}
      <div 
        className="relative cursor-pointer" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // console.log('AuthMenu clicked, isOpen:', isOpen);
          onToggle(!isOpen);
        }}
      >
        {triggerComponent}
      </div>

      {/* Portal Modal */}
      {AuthModalPortal}

      {/* Profile modal */}
      {isLoggedIn && user && (
        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title={t('profile')}
          size="lg"
        >
          <div className="space-y-6">
            {/* User Profile Header */}
            <ContentContainer
              headerVariant="default"
              bodyClassName="p-0"
            >
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100/70 rounded-t-xl border-b border-logo-lime/20">
                <div className="w-16 h-16 rounded-full bg-logo-lime/20 border border-logo-lime/40 text-dark-green-7 flex items-center justify-center font-medium text-xl shadow-sm">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-dark-green-7 capitalize">{getFullName(user)}</h3>
                  <p className="text-sm text-dark-green-6">{user.email}</p>
                  {user.phone && <p className="text-sm text-dark-green-6">{user.phone}</p>}
                </div>
              </div>

              {/* User Details */}
              <div className="p-6 space-y-4">
                <h4 className="font-medium text-dark-green-7 border-b border-logo-lime/20 pb-2">{t('account_details')}</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-dark-green-6 mb-1">{t('first_name')}</label>
                    <div className="p-2.5 bg-white border border-logo-lime/20 rounded-md text-dark-green-7">
                      {user.firstName || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-dark-green-6 mb-1">{t('last_name')}</label>
                    <div className="p-2.5 bg-white border border-logo-lime/20 rounded-md text-dark-green-7">
                      {user.lastName || '-'}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-dark-green-6 mb-1">{t('email')}</label>
                    <div className="p-2.5 bg-white border border-logo-lime/20 rounded-md text-dark-green-7">
                      {user.email}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-dark-green-6 mb-1">{t('phone')}</label>
                    <div className="p-2.5 bg-white border border-logo-lime/20 rounded-md text-dark-green-7">
                      {user.phone || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </ContentContainer>
          </div>
        </Modal>
      )}
    </>
  );
};

export default memo(AuthMenu);