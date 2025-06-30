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

const AuthDropdown = ({ onClose, isMobile = false, isNavbarMobile = false }) => {
  const navigate = useNavigate();
  const { login, register, isLoggedIn, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const dropdownRef = useRef(null);

  // Modal states - track all modals with a single state
  const [modalState, setModalState] = useState({
    activeModal: null,
    isModalOpen: false
  });

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
    // Close dropdown and open selected modal
    setIsOpen(false);
    setModalState({
      activeModal: modalType,
      isModalOpen: true
    });

    if (onClose) onClose();
  };

  const handleModalChange = (nextModalType) => {
    // If next modal type is provided, switch to that modal
    if (nextModalType && typeof nextModalType === 'string') {
      setModalState({
        activeModal: nextModalType,
        isModalOpen: true
      });
    } else {
      // Otherwise close the modal
      setModalState({
        activeModal: null,
        isModalOpen: false
      });
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
        <h3>Se Connecter</h3>
        <p>Accéder à votre compte</p>
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
              placeholder="Votre adresse email"
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
              placeholder="Votre mot de passe"
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
            <label htmlFor="dropdown-remember">Me souvenir</label>
          </div>
          <button
            type="button"
            className="forgot-password"
            onClick={toggleForgotPassword}
          >
            Mot de passe oublié ?
          </button>
        </div>

        <button
          type="submit"
          className={`dropdown-btn primary ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {!loading && <SignIn size={16} weight="duotone" />}
          {loading ? 'Connexion en cours...' : 'Se Connecter'}
        </button>

        <div className="dropdown-footer">
          <p>
            Pas de compte ?{' '}
            <button type="button" className="dropdown-link" onClick={toggleAuthMode}>
              Créer un compte
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
        <h3>Créer un compte</h3>
        <p>Rejoignez notre communauté</p>
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
                placeholder="Prénom"
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
                placeholder="Nom"
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
              placeholder="Votre adresse email"
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
              placeholder="Créer un mot de passe"
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
              placeholder="Confirmer le mot de passe"
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
          {loading ? 'Création du compte en cours...' : 'Créer un compte'}
        </button>

        <div className="dropdown-footer">
          <p>
            Vous avez déjà un compte ?{' '}
            <button type="button" className="dropdown-link" onClick={goBackToLogin}>
              Se Connecter
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
        <h3>Réinitialiser le mot de passe</h3>
        <p>Nous vous enverrons un lien de réinitialisation</p>
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
            <p>Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
          </div>
          <div className="form-group">
            <div className="input-with-icon">
              <EnvelopeSimple size={18} weight="duotone" />
              <input
                type="email"
                name="email"
                placeholder="Votre adresse email"
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
            {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </button>

          <div className="dropdown-footer">
            <p>
              Vous avez déjà un compte ?{' '}
              <button type="button" className="dropdown-link" onClick={goBackToLogin}>
                Se Connecter
              </button>
            </p>
          </div>
        </form>
      )}
    </div>
  );

  const renderProfileMenu = () => (
    <div className="profile-menu">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            <User size={isMobile ? 22 : 24} weight="duotone" />
          </div>
          <div className="profile-name">
            <span className="name">{user.firstName} {user.lastName}</span>
            <span className="email">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="profile-action" onClick={() => handleProfileNavigation('PROFILE')}>
          <User size={isMobile ? 18 : 20} weight="duotone" />
          <span>Mon Profil</span>
        </button>
        <button className="profile-action" onClick={() => handleProfileNavigation('ORDERS')}>
          <Package size={isMobile ? 18 : 20} weight="duotone" />
          <span>Mes Commandes</span>
        </button>
        <button className="profile-action" onClick={() => handleProfileNavigation('PAYMENT')}>
          <CreditCard size={isMobile ? 18 : 20} weight="duotone" />
          <span>Moyens de Paiement</span>
        </button>
        <button className="profile-action" onClick={() => handleProfileNavigation('SETTINGS')}>
          <Gear size={isMobile ? 18 : 20} weight="duotone" />
          <span>Paramètres</span>
        </button>
      </div>

      <div className="logout-action">
        <button className="logout-button" onClick={handleLogout}>
          <SignOut size={isMobile ? 18 : 20} weight="duotone" />
          <span>Déconnexion</span>
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

  // Render the appropriate modal based on modalState
  const renderModal = () => {
    switch(modalState.activeModal) {
      case 'PROFILE':
        return (
          <ProfileModal
            isOpen={modalState.isModalOpen}
            onClose={handleModalChange}
            user={user}
          />
        );
      case 'ORDERS':
        return (
          <OrdersModal
            isOpen={modalState.isModalOpen}
            onClose={handleModalChange}
          />
        );
      case 'PAYMENT':
        return (
          <PaymentModal
            isOpen={modalState.isModalOpen}
            onClose={handleModalChange}
          />
        );
      case 'SETTINGS':
        return (
          <SettingsModal
            isOpen={modalState.isModalOpen}
            onClose={handleModalChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`auth-dropdown ${isMobile ? 'mobile' : ''}`} ref={dropdownRef}>
      <button
        className={`dropdown-trigger ${isOpen ? 'active' : ''} ${isMobile ? 'mobile' : ''}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isLoggedIn ? (
          <>
            <User weight="duotone" size={isMobile ? 20 : 20} />
            {!isMobile && <span className="btn-text">Mon Compte</span>}
            {/* Always show dropdown arrow for navbar mobile, or desktop */}
            {(!isMobile || isNavbarMobile) && (
              <CaretDown
                weight="bold"
                className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                size={isMobile ? 14 : 14}
              />
            )}
          </>
        ) : (
          <>
            <SignIn weight="duotone" size={isMobile ? 20 : 20} />
            {!isMobile && <span className="btn-text">Connexion</span>}
            {/* Always show dropdown arrow for navbar mobile, or desktop */}
            {(!isMobile || isNavbarMobile) && (
              <CaretDown
                weight="bold"
                className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                size={isMobile ? 14 : 14}
              />
            )}
          </>
        )}
      </button>

      {isOpen && (
        <div className={`dropdown-container ${isMobile ? 'mobile' : ''} ${isNavbarMobile ? 'navbar-mobile' : ''}`}>
          {renderAuthContent()}
        </div>
      )}

      {/* Render the active modal */}
      {renderModal()}
    </div>
  );
};

export default AuthDropdown;