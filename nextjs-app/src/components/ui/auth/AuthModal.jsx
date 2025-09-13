import React, { useState, useEffect } from 'react';
import Modal from '../feedback/Modal';
import Icon from '../icons/Icon';
import { useTranslation } from '@/utils/i18n';
import translations from '../navigation/translations/AuthMenu';
import { LoginForm, SignupForm } from './';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { EVENTS } from '@/utils/eventBus';
import config from '@/config';

/**
 * AuthModal component
 * Shows a login/signup modal when a guest tries to access a restricted page
 * Enhanced with event-driven auth state management
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Function} props.onSuccess - Function to call when login/signup is successful
 * @param {string} props.redirectPath - Path to redirect to after successful login/signup
 */
const AuthModal = ({ isOpen, onClose, onSuccess, redirectPath = '/checkout' }) => {
  const { t } = useTranslation(translations);
  const { login, signup, loading: authLoading, eventBus } = useAuth();
  const { refreshCart } = useCart();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('pending');
  const [authActivity, setAuthActivity] = useState([]);

  // Listen to auth events for better UX and feedback
  useEffect(() => {
    if (!eventBus) return;

    const unsubscribers = [];

    // Login attempt
    unsubscribers.push(eventBus.on(EVENTS.AUTH_LOGIN_ATTEMPT, (data) => {
      setAuthActivity(prev => [`Attempting login for ${data.email}...`, ...prev.slice(0, 2)]);
      setLoading(true);
      setError('');
    }));

    // Login success
    unsubscribers.push(eventBus.on(EVENTS.AUTH_LOGIN_SUCCESS, (data) => {
      setAuthActivity(prev => [`✅ Login successful! Welcome ${data.user?.name || data.user?.email}`, ...prev.slice(0, 2)]);
      
      // Refresh cart after successful login
      setTimeout(async () => {
        try {
          await refreshCart();
          setAuthActivity(prev => [`🛒 Cart synchronized`, ...prev.slice(0, 2)]);
        } catch (cartError) {
          console.warn('Failed to refresh cart after login:', cartError);
          setAuthActivity(prev => [`⚠️ Cart sync warning`, ...prev.slice(0, 2)]);
        }
        
        // Call onSuccess to update the app state.
        // The parent component is now responsible for closing the modal.
        if (onSuccess) {
          onSuccess({ isNewUser: false });
        }
        
        setLoading(false);
      }, 100);
    }));

    // Login failed
    unsubscribers.push(eventBus.on(EVENTS.AUTH_LOGIN_FAILED, (data) => {
      setError(data.error || 'Login failed. Please check your credentials.');
      setAuthActivity(prev => [`❌ Login failed: ${data.error}`, ...prev.slice(0, 2)]);
      setLoading(false);
    }));

    // Login error
    unsubscribers.push(eventBus.on(EVENTS.AUTH_LOGIN_ERROR, (data) => {
      setError(data.error || 'Login error occurred');
      setAuthActivity(prev => [`🔴 Login error: ${data.error}`, ...prev.slice(0, 2)]);
      setLoading(false);
    }));

    // Logout
    unsubscribers.push(eventBus.on(EVENTS.AUTH_LOGOUT, () => {
      // Reset form state if user logs out while modal is open
      setIsRegistering(false);
      setError('');
      setAuthActivity([]);
    }));

    // Signup attempt
    unsubscribers.push(eventBus.on(EVENTS.AUTH_SIGNUP_ATTEMPT, (data) => {
      setAuthActivity(prev => [`Creating account for ${data.email}...`, ...prev.slice(0, 2)]);
      setLoading(true);
      setError('');
    }));

    // Signup success
    unsubscribers.push(eventBus.on(EVENTS.AUTH_SIGNUP_SUCCESS, (data) => {
      setAuthActivity(prev => [`✅ Account created! Welcome ${data.user?.name || data.user?.email}`, ...prev.slice(0, 2)]);
      
      // Refresh cart after successful signup (to transfer from guest)
      setTimeout(async () => {
        try {
          await refreshCart();
          setAuthActivity(prev => [`🛒 Cart synchronized`, ...prev.slice(0, 2)]);
        } catch (cartError) {
          console.warn('Failed to refresh cart after signup:', cartError);
          setAuthActivity(prev => [`⚠️ Cart sync warning`, ...prev.slice(0, 2)]);
        }
        
        // Call onSuccess to update the app state and continue checkout
        if (onSuccess) {
          onSuccess({ isNewUser: true }); // Pass flag to indicate new user
        }
        
        setLoading(false);
      }, 100);
    }));

    // Signup failed
    unsubscribers.push(eventBus.on(EVENTS.AUTH_SIGNUP_FAILED, (data) => {
      setError(data.error || 'Account creation failed. Please try again.');
      setAuthActivity(prev => [`❌ Signup failed: ${data.error}`, ...prev.slice(0, 2)]);
      setLoading(false);
    }));

    // Signup error
    unsubscribers.push(eventBus.on(EVENTS.AUTH_SIGNUP_ERROR, (data) => {
      setError(data.error || 'Signup error occurred');
      setAuthActivity(prev => [`🔴 Signup error: ${data.error}`, ...prev.slice(0, 2)]);
      setLoading(false);
    }));

    // Cleanup function
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [eventBus, refreshCart, onSuccess, onClose]);

  // Test API connection when modal opens
  useEffect(() => {
    if (isOpen) {
      testApiConnection();
      setAuthActivity([]);
    }
  }, [isOpen]);

  // Test API connection
  const testApiConnection = async () => {
    try {
      const response = await fetch(`${config.API.backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const status = response.ok ? 'connected' : 'error';
      setApiStatus(status);

      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
      }
    } catch (error) {
      setApiStatus('failed');
    }
  };

  // Handle login form submission - simplified since events handle the flow
  const handleLoginSubmit = async (formData) => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      // The auth events will handle loading states and success/error flows
      await login({
        email: formData.email,
        password: formData.password
      });
    } catch (error) {
      // Error is handled by event listeners
      console.error('Login submission error:', error);
    }
  };

  // Handle signup form submission - simplified since events handle the flow
  const handleSignupSubmit = async (formData) => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('All required fields must be filled out');
      return;
    }

    try {
      // Parse phone number into the format expected by the backend.
      let phoneData = null;

      if (formData.phoneNumber && formData.phoneNumber.trim()) {
        const phoneNumber = formData.phoneNumber.trim();
        if (phoneNumber.startsWith('+212')) {
          phoneData = {
            country: 'MA',
            countryCallingCode: '+212',
            national: phoneNumber.substring(4),
            international: phoneNumber
          };
        } else if (phoneNumber.startsWith('+')) {
            const callingCodeMatch = phoneNumber.match(/^\+(\d{1,3})/);
            if (callingCodeMatch) {
              const callingCode = '+' + callingCodeMatch[1];
              const nationalNumber = phoneNumber.substring(callingCode.length);
              phoneData = {
                country: 'MA', // Defaulting to 'MA' as a fallback.
                countryCallingCode: callingCode,
                national: nationalNumber,
                international: phoneNumber
              };
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

      // The auth events will handle loading states and success/error flows
      await signup(signupData);
    } catch (error) {
      // Error is handled by event listeners
      console.error('Signup submission error:', error);
    }
  };

  // Toggle between login and signup forms
  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setAuthActivity([]);
  };

  // Use combined loading state from local and context
  const isLoading = loading || authLoading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
      closeOnOverlayClick={true}
      overlayClassName="z-[100]" // Ensure it's above the checkout footer
    >
      <div className="flex flex-col">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 border-b border-logo-lime/20">
          {/* Title section */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-logo-lime/20 border border-logo-lime/40 flex items-center justify-center">
                <Icon name="user" size="lg" weight="duotone" className="text-dark-green-7" />
              </div>
              <h3 className="text-lg font-medium text-dark-green-7 truncate max-w-[200px]">
                {isRegistering ? t('register_title') : t('login')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-dark-green-7 hover:bg-logo-lime/20"
              aria-label="Close"
            >
              <Icon name="x" size="md" />
            </button>
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

        <div className="p-4">
          {isRegistering ? (
            <SignupForm
              onSubmit={handleSignupSubmit}
              onClose={onClose}
              onBackToLogin={toggleAuthMode}
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
      </div>

      {/* Activity indicator for auth events */}
      {authActivity.length > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="text-xs text-blue-700">
            {authActivity[0]}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-6 flex flex-col items-center justify-center h-48">
          <div className="w-12 h-12 rounded-full bg-logo-lime/15 border border-logo-lime/30 flex items-center justify-center mb-4">
            <div className="animate-spin text-dark-green-7">
              <Icon name="circlenotch" size="lg" weight="duotone" />
            </div>
          </div>
          <p className="text-dark-green-7 font-medium">{t('loading')}</p>
          <p className="text-sm text-dark-green-6 mt-1">{t('loading_message')}</p>
          {authActivity.length > 0 && (
            <div className="mt-3 space-y-1">
              {authActivity.slice(0, 3).map((activity, index) => (
                <p key={index} className="text-xs text-gray-600 text-center">
                  {activity}
                </p>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="px-5 py-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <p className="flex items-start">
                <Icon name="warning" size="sm" className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AuthModal;