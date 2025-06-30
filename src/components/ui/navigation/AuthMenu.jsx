import React, { useState, useEffect, memo, useCallback } from 'react';
import translations from './translations/AuthMenu';
import Menu from './Menu';
import MenuTrigger from './MenuTrigger';
import Icon from '../icons/Icon';
import Modal from '../feedback/Modal';
import { LoginForm, SignupForm } from '../auth';
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
      let phoneData = {
        country: 'MA',
        countryCallingCode: '+212',
        national: '600000000',
        international: '+212600000000'
      };

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
        }
      }

      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: phoneData.international || undefined // Use 'phone' field name expected by backend
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

  // Note: Removed automatic profile refresh on menu open
  // SessionService now manages auth state and user data is already current

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
            <Icon name="user" size="lg" weight="duotone" className="text-dark-green-7" />
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
            <Icon name="user" size="lg" weight="duotone" className="text-dark-green-7" />
          </div>
          <h3 className="text-lg font-medium text-dark-green-7 truncate max-w-[200px]">
            {isRegistering ? t('register_title') : t('login')}
          </h3>
        </div>
        
        {/* Toggle switch */}
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
      </div>
    );
  };

  // Handle profile button click
  const handleProfileClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileModalOpen(true);
    if (onToggle) {
      onToggle(false);
    }
    if (onClose) {
      onClose(); // Close the menu when opening the modal
    }
  }, [onToggle, onClose]);

  // Render login/register form or user profile based on authentication status
  const renderContent = () => {
    if (loading || localLoading) {
      return (
        <div className="p-4 flex flex-col items-center justify-center h-32">
          <div className="w-8 h-8 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center mb-3">
            <div className="animate-spin text-dark-green-7">
              <Icon name="circlenotch" size="md" weight="duotone" />
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
              {user.isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs text-logo-lime font-medium">
                  <Icon name="checkCircle" size="xs" weight="fill" />
                  {t('account_verified')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Icon name="clock" size="xs" weight="fill" />
                  {t('account_pending')}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 px-6 py-3 bg-white/70 border border-logo-lime/20 rounded-lg text-left text-sm font-medium text-dark-green-7 hover:bg-white/90 transition-all icon-text-separator"
            >
              <div className="w-7 h-7 rounded-full bg-logo-lime/10 border border-logo-lime/20 flex items-center justify-center">
                <Icon name="user" size="sm" weight="duotone" color="dark-green" />
              </div>
              <span>{t('profile')}</span>
            </button>
            
            <div className="flex items-center gap-3 px-6 py-3 bg-white/70 border border-logo-lime/20 rounded-lg text-left text-sm font-medium text-dark-green-7/50 cursor-not-allowed relative group icon-text-separator">
              <div className="w-7 h-7 rounded-full bg-logo-lime/10 border border-logo-lime/20 flex items-center justify-center opacity-70">
                <Icon name="shoppingBag" size="sm" weight="duotone" color="dark-green" />
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
              className="flex items-center justify-center gap-2 py-2.5 px-8 bg-white text-feedback-error font-medium rounded-lg border border-feedback-error/30 hover:bg-feedback-error/10 transition-all icon-text-separator text-sm"
            >
              <Icon name="signOut" size="sm" className="text-feedback-error" />
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
              <Icon name="warning" size="sm" weight="duotone" color="error" />
              <span className="font-medium">{formError}</span>
            </div>
          </div>
        )}

        {/* Form Content */}
        {isRegistering ? (
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
        withCaret={!isMobile}
        withMobileIndicator={isMobile && isNavbarMobile && !isGrouped}
        isGrouped={isGrouped}
        isOpen={isOpen}
        className={!isMobile ? 'icon-text-separator' : ''}
        icon={
          <div className="relative flex items-center justify-center">
            <Icon name="user" weight="duotone" size={isMobile ? "md" : "md"} />
          </div>
        }
      >
        {!isMobile && (isLoggedIn && user ? getFirstName(user) : t('account'))}
      </MenuTrigger>
    </div>
  );

  return (
    <>
      <Menu
        variant="auth"
        isMobile={isMobile}
        isNavbarMobile={isNavbarMobile}
        onClose={onClose}
        onToggle={onToggle}
        trigger={triggerComponent}
        header={renderHeader}
        headerPadding="none"
        containerClassName="w-80"
        position={isNavbarMobile ? "right" : "right"}
        menuId={`auth-menu-${isNavbarMobile ? 'mobile' : 'desktop'}`}
        isOpen={isOpen}
      >
        {renderContent()}
      </Menu>

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