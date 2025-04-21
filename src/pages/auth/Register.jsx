import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import {
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  User,
  GoogleLogo,
  FacebookLogo,
  Phone,
  WarningCircle,
  UserPlus
} from '@phosphor-icons/react';
import NavBar from '../../sections/shared/navbar/NavBar';
import Footer from '../../sections/shared/footer/Footer';
import './auth.scss';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
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

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // Prepare user data, excluding confirmPassword and agreeTerms
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      const result = await register(userData);

      if (result.success) {
        navigate('/');
      } else {
        setErrors({
          general: result.error || 'Registration failed. Please try again later.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Registration failed. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider) => {
    setLoading(true);

    try {
      const userData = {
        firstName: 'User',
        lastName: provider.charAt(0).toUpperCase() + provider.slice(1),
        email: `user@${provider}.com`,
        provider
      };

      const result = await register(userData);

      if (result.success) {
        navigate('/');
      } else {
        setErrors({
          general: result.error || `${provider} registration failed. Please try again.`
        });
      }
    } catch (error) {
      setErrors({
        general: `${provider} registration failed. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | DikaFood</title>
        <meta name="description" content="Create a DikaFood account to enjoy exclusive offers, faster checkout, order tracking, and more." />
      </Helmet>

      <NavBar />

      <div className="auth-page register-page">
        <div className="container">
          <div className="auth-container">
            <div className="auth-header">
              <h1>Create Your Account</h1>
              <p>Join DikaFood and get access to exclusive offers</p>
            </div>

            {errors.general && (
              <div className="error-message">
                <WarningCircle size={20} weight="duotone" />
                {errors.general}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-with-icon">
                    <User size={20} weight="duotone" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                  </div>
                  {errors.firstName && (
                    <div className="error-text">
                      <WarningCircle size={14} weight="fill" />
                      {errors.firstName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-with-icon">
                    <User size={20} weight="duotone" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                  </div>
                  {errors.lastName && (
                    <div className="error-text">
                      <WarningCircle size={14} weight="fill" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <EnvelopeSimple size={20} weight="duotone" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && (
                  <div className="error-text">
                    <WarningCircle size={14} weight="fill" />
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={20} weight="duotone" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                </div>
                {errors.phone && (
                  <div className="error-text">
                    <WarningCircle size={14} weight="fill" />
                    {errors.phone}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={20} weight="duotone" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeSlash size={20} weight="duotone" />
                    ) : (
                      <Eye size={20} weight="duotone" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="error-text">
                    <WarningCircle size={14} weight="fill" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={20} weight="duotone" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeSlash size={20} weight="duotone" />
                    ) : (
                      <Eye size={20} weight="duotone" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="error-text">
                    <WarningCircle size={14} weight="fill" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="form-group checkbox-group">
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className={errors.agreeTerms ? 'error' : ''}
                  />
                  <label htmlFor="agreeTerms">
                    I agree to the <Link to="/terms">Terms of Service</Link> and{' '}
                    <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <div className="error-text">
                    <WarningCircle size={14} weight="fill" />
                    {errors.agreeTerms}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? (
                  'Creating Account...'
                ) : (
                  <>
                    <UserPlus size={20} weight="duotone" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-buttons">
              <button
                type="button"
                className="btn btn-social btn-google"
                onClick={() => handleSocialRegister('google')}
                disabled={loading}
              >
                <GoogleLogo size={20} weight="duotone" />
                Google
              </button>
              <button
                type="button"
                className="btn btn-social btn-facebook"
                onClick={() => handleSocialRegister('facebook')}
                disabled={loading}
              >
                <FacebookLogo size={20} weight="duotone" />
                Facebook
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="link">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;