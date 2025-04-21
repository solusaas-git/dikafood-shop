import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import {
  EnvelopeSimple,
  Lock,
  Eye,
  EyeSlash,
  GoogleLogo,
  FacebookLogo,
  WarningCircle,
  SignIn
} from '@phosphor-icons/react';
import NavBar from '../../sections/shared/navbar/NavBar';
import Footer from '../../sections/shared/footer/Footer';
import './auth.scss';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, formData.remember);

      if (result.success) {
        navigate('/');
      } else {
        setErrors({
          general: result.error || 'Login failed. Please check your credentials and try again.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Login failed. Please check your credentials and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);

    try {
      // This would be integrated with actual social login APIs
      const result = await login(`user@${provider}.com`, 'socialAuth', provider);

      if (result.success) {
        navigate('/');
      } else {
        setErrors({
          general: result.error || `${provider} login failed. Please try again.`
        });
      }
    } catch (error) {
      setErrors({
        general: `${provider} login failed. Please try again.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | DikaFood</title>
        <meta name="description" content="Login to your DikaFood account to access exclusive offers, track your orders, and manage your profile." />
      </Helmet>

      <NavBar />

      <div className="auth-page login-page">
        <div className="container">
          <div className="auth-container">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Login to your account to access all features</p>
            </div>

            {errors.general && (
              <div className="error-message">
                <WarningCircle size={20} weight="duotone" />
                {errors.general}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
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
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={20} weight="duotone" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Your password"
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
                    {showPassword ? <EyeSlash size={20} weight="duotone" /> : <Eye size={20} weight="duotone" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="error-text">
                    <WarningCircle size={14} weight="fill" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`auth-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {!loading && <SignIn size={20} weight="duotone" />}
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="social-login">
              <p>Or login with</p>
              <div className="social-buttons">
                <button
                  type="button"
                  className="social-button google"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <GoogleLogo size={20} weight="duotone" />
                  Google
                </button>
                <button
                  type="button"
                  className="social-button facebook"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading}
                >
                  <FacebookLogo size={20} weight="duotone" />
                  Facebook
                </button>
              </div>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Sign up
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

export default Login;