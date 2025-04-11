import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { EnvelopeSimple, Lock, Eye, EyeSlash, GoogleLogo, FacebookLogo } from '@phosphor-icons/react';
import NavBar from '../../sections/shared/navbar/NavBar';
import Footer from '../../sections/shared/footer/Footer';
import './auth.scss';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ email: formData.email }));

      // Redirect to dashboard or home
      navigate('/');
    } catch (error) {
      setErrors({
        general: 'Login failed. Please check your credentials and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);

    // Simulate social login
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({
        email: `user@${provider}.com`,
        provider
      }));
      navigate('/');
      setLoading(false);
    }, 1000);
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
                {errors.general}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <EnvelopeSimple size={20} />
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
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={20} />
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
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <div className="error-text">{errors.password}</div>}
              </div>

              <div className="form-actions">
                <div className="remember-me">
                  <input type="checkbox" id="remember" name="remember" />
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
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="social-login">
              <p>Or login with</p>
              <div className="social-buttons">
                <button
                  className="social-button google"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <GoogleLogo size={20} />
                  Google
                </button>
                <button
                  className="social-button facebook"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading}
                >
                  <FacebookLogo size={20} />
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