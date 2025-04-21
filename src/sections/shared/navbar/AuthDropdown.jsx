import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  User,
  SignIn,
  CaretDown,
  SignOut,
  Package,
  CreditCard,
  Gear,
  WarningCircle,
  UserPlus,
  ArrowLeft,
  PaperPlaneRight
} from '@phosphor-icons/react';
import './auth-dropdown.scss';

// Import modals
import ProfileModal from '../../../components/profile/ProfileModal';
import OrdersModal from '../../../components/profile/OrdersModal';
import PaymentModal from '../../../components/profile/PaymentModal';
import SettingsModal from '../../../components/profile/SettingsModal';

const AuthDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const { login, register, isLoggedIn, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const dropdownRef = useRef(null);

  // Modal states
  const [activeModal, setActiveModal] = useState(null);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsRegistering(false);
      setIsForgotPassword(false);
      setResetSent(false);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleForgotPasswordChange = (e) => {
    const { value } = e.target;
    setForgotPasswordData({
      email: value
    });

    // Clear error when user starts typing
    if (errors.email) {
      setErrors({
        ...errors,
        email: ''
      });
    }
  };

  const validateLogin = () => {
    const newErrors = {};

    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};

    if (!registerData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!registerData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForgotPassword = () => {
    const newErrors = {};

    if (!forgotPasswordData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(forgotPasswordData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!validateLogin()) return;

    setLoading(true);

    try {
      const result = await login(loginData.email, loginData.password, loginData.remember);

      if (result.success) {
        // Login succeeded - don't close the dropdown, it will transform to profile menu
        // Reset form data
        setLoginData({
          email: '',
          password: '',
          remember: false
        });
      } else {
        setErrors({
          general: result.error || 'Login failed. Please check your credentials.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Login failed. Please check your credentials.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!validateRegister()) return;

    setLoading(true);

    try {
      const userData = {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email
      };

      const result = await register(userData);

      if (result.success) {
        // Registration succeeded - don't close the dropdown, it will transform to profile menu
        // Reset form data
        setRegisterData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setErrors({
          general: result.error || 'Registration failed. Please try again.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validateForgotPassword()) return;

    setLoading(true);

    try {
      // Mock API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetSent(true);

      // Clear form data
      setForgotPasswordData({
        email: ''
      });
    } catch (error) {
      setErrors({
        general: 'Failed to send reset link. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileNavigation = (modalType) => {
    setActiveModal(modalType);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleCloseModal = (nextModalType) => {
    // If a next modal type is provided, open that modal
    if (nextModalType && typeof nextModalType === 'string') {
      setActiveModal(nextModalType);
    } else {
      // Otherwise just close the current modal
      setActiveModal(null);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setIsForgotPassword(false);
    setErrors({});
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsRegistering(false);
    setErrors({});
  };

  const goBackToLogin = () => {
    setIsForgotPassword(false);
    setIsRegistering(false);
    setResetSent(false);
    setErrors({});
  };

  const renderLoginForm = () => (
    <div className="auth-dropdown-content login-form">
      <div className="dropdown-header">
        <h3>Sign In</h3>
        <p>Access your account</p>
      </div>

      {errors.general && (
        <div className="error-message dropdown-error">
          <WarningCircle size={16} weight="fill" />
          {errors.general}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="dropdown-form">
        <div className="form-group">
          <div className="input-with-icon">
            <EnvelopeSimple size={18} weight="duotone" />
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={loginData.email}
              onChange={handleLoginChange}
              className={errors.email ? 'error' : ''}
            />
          </div>
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        <div className="form-group">
          <div className="input-with-icon">
            <Lock size={18} weight="duotone" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Your password"
              value={loginData.password}
              onChange={handleLoginChange}
              className={errors.password ? 'error' : ''}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlash size={16} weight="duotone" />
              ) : (
                <Eye size={16} weight="duotone" />
              )}
            </button>
          </div>
          {errors.password && <div className="error-text">{errors.password}</div>}
        </div>

        <div className="form-actions">
          <div className="remember-me">
            <input
              type="checkbox"
              id="dropdown-remember"
              name="remember"
              checked={loginData.remember}
              onChange={handleLoginChange}
            />
            <label htmlFor="dropdown-remember">Remember me</label>
          </div>
          <button
            type="button"
            className="forgot-password"
            onClick={toggleForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className={`dropdown-btn primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {!loading && <SignIn size={16} weight="duotone" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="dropdown-footer">
          <p>
            Don't have an account?{' '}
            <button type="button" className="dropdown-link" onClick={toggleAuthMode}>
              Register
            </button>
          </p>
        </div>
      </form>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="auth-dropdown-content register-form">
      <div className="dropdown-header">
        <button
          type="button"
          className="back-button"
          onClick={goBackToLogin}
          aria-label="Back to login"
        >
          <ArrowLeft size={16} weight="bold" />
        </button>
        <h3>Create Account</h3>
        <p>Join our community</p>
      </div>

      {errors.general && (
        <div className="error-message dropdown-error">
          <WarningCircle size={16} weight="fill" />
          {errors.general}
        </div>
      )}

      <form onSubmit={handleRegisterSubmit} className="dropdown-form">
        <div className="form-row">
          <div className="form-group">
            <div className="input-with-icon">
              <User size={18} weight="duotone" />
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                className={errors.firstName ? 'error' : ''}
              />
            </div>
            {errors.firstName && <div className="error-text">{errors.firstName}</div>}
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <User size={18} weight="duotone" />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                className={errors.lastName ? 'error' : ''}
              />
            </div>
            {errors.lastName && <div className="error-text">{errors.lastName}</div>}
          </div>
        </div>

        <div className="form-group">
          <div className="input-with-icon">
            <EnvelopeSimple size={18} weight="duotone" />
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={registerData.email}
              onChange={handleRegisterChange}
              className={errors.email ? 'error' : ''}
            />
          </div>
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>

        <div className="form-group">
          <div className="input-with-icon">
            <Lock size={18} weight="duotone" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create password"
              value={registerData.password}
              onChange={handleRegisterChange}
              className={errors.password ? 'error' : ''}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlash size={16} weight="duotone" />
              ) : (
                <Eye size={16} weight="duotone" />
              )}
            </button>
          </div>
          {errors.password && <div className="error-text">{errors.password}</div>}
        </div>

        <div className="form-group">
          <div className="input-with-icon">
            <Lock size={18} weight="duotone" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm password"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
          </div>
          {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
        </div>

        <button
          type="submit"
          className={`dropdown-btn primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {!loading && <UserPlus size={16} weight="duotone" />}
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="dropdown-footer">
          <p>
            Already have an account?{' '}
            <button type="button" className="dropdown-link" onClick={goBackToLogin}>
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );

  const renderForgotPasswordForm = () => (
    <div className="auth-dropdown-content forgot-password-form">
      <div className="dropdown-header">
        <button
          type="button"
          className="back-button"
          onClick={goBackToLogin}
          aria-label="Back to login"
        >
          <ArrowLeft size={16} weight="bold" />
        </button>
        <h3>Reset Password</h3>
        <p>We'll send you a reset link</p>
      </div>

      {errors.general && (
        <div className="error-message dropdown-error">
          <WarningCircle size={16} weight="fill" />
          {errors.general}
        </div>
      )}

      {resetSent ? (
        <div className="dropdown-form">
          <div className="text-wrapper">
            <p style={{ color: 'var(--logo-green)', textAlign: 'center', margin: '16px 0' }}>
              Password reset link has been sent to your email address. Please check your inbox.
            </p>
          </div>
          <button
            type="button"
            className="dropdown-btn secondary"
            onClick={goBackToLogin}
          >
            <ArrowLeft size={16} weight="duotone" />
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleForgotPasswordSubmit} className="dropdown-form">
          <div className="text-wrapper">
            <p>Enter your email address and we'll send you a link to reset your password.</p>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <EnvelopeSimple size={18} weight="duotone" />
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                value={forgotPasswordData.email}
                onChange={handleForgotPasswordChange}
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <button
            type="submit"
            className={`dropdown-btn primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {!loading && <PaperPlaneRight size={16} weight="duotone" />}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="dropdown-footer">
            <p>
              Remembered your password?{' '}
              <button type="button" className="dropdown-link" onClick={goBackToLogin}>
                Sign In
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  );

  const renderProfileMenu = () => (
    <div className="auth-dropdown-content profile-menu">
      <div className="dropdown-header">
        <span className="user-name">
          {user?.firstName ? `Hi, ${user.firstName}` : 'My Account'}
        </span>
      </div>

      <div className="dropdown-items">
        <button
          type="button"
          onClick={() => handleProfileNavigation('profile')}
          aria-label="My Profile"
        >
          <User size={20} weight="duotone" />
          My Profile
        </button>

        <button
          type="button"
          onClick={() => handleProfileNavigation('orders')}
          aria-label="My Orders"
        >
          <Package size={20} weight="duotone" />
          My Orders
        </button>

        <button
          type="button"
          onClick={() => handleProfileNavigation('payment')}
          aria-label="Payment Methods"
        >
          <CreditCard size={20} weight="duotone" />
          Payment Methods
        </button>

        <button
          type="button"
          onClick={() => handleProfileNavigation('settings')}
          aria-label="Settings"
        >
          <Gear size={20} weight="duotone" />
          Settings
        </button>

        <div className="dropdown-divider"></div>

        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
          aria-label="Sign Out"
        >
          <SignOut size={20} weight="duotone" />
          Sign Out
        </button>
      </div>
    </div>
  );

  const renderAuthContent = () => {
    if (isLoggedIn) {
      return renderProfileMenu();
    } else if (isRegistering) {
      return renderRegisterForm();
    } else if (isForgotPassword) {
      return renderForgotPasswordForm();
    } else {
      return renderLoginForm();
    }
  };

  return (
    <>
    <div className="auth-dropdown" ref={dropdownRef}>
      <button
        className="dropdown-trigger"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isLoggedIn ? (
          <>
            <User size={20} weight="duotone" />
            <span className="username-display">{user?.firstName || 'Account'}</span>
            <CaretDown
              size={14}
              weight="bold"
              className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
            />
          </>
        ) : (
          <>
            <SignIn size={20} weight="duotone" />
            <span className="username-display">Sign In</span>
            <CaretDown
              size={14}
              weight="bold"
              className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
            />
          </>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-container">
          {renderAuthContent()}
        </div>
      )}
    </div>

      {/* Modals */}
      <ProfileModal
        isOpen={activeModal === 'profile'}
        onClose={handleCloseModal}
        initialSection="profile"
      />
      <OrdersModal
        isOpen={activeModal === 'orders'}
        onClose={handleCloseModal}
        initialSection="orders"
      />
      <PaymentModal
        isOpen={activeModal === 'payment'}
        onClose={handleCloseModal}
        initialSection="payment"
      />
      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={handleCloseModal}
        initialSection="settings"
      />
    </>
  );
};

export default AuthDropdown;