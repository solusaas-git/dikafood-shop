import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Eye, EyeSlash, CheckCircle, WarningCircle, ArrowLeft, Password, SignIn } from '@phosphor-icons/react';
import NavBar from '../../sections/shared/navbar/NavBar';
import Footer from '../../sections/shared/footer/Footer';
import './auth.scss';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Extract token from URL parameters
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');

    if (!tokenParam) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      return;
    }

    setToken(tokenParam);
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const validate = () => {
    if (!formData.password) {
      setError('Please enter a new password');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful password reset
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | DikaFood</title>
        <meta name="description" content="Reset your DikaFood account password" />
      </Helmet>

      <NavBar />

      <div className="auth-page">
        <div className="container">
          <div className="auth-container">
            <div className="auth-header">
              <h1>Reset Password</h1>
              <p>Create a new password for your account</p>
            </div>

            {error && (
              <div className="error-message">
                <WarningCircle size={20} weight="duotone" />
                {error}
              </div>
            )}

            {success ? (
              <>
                <div className="success-message">
                  <CheckCircle size={20} weight="duotone" />
                  Password reset successful!
                </div>
                <p style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--color-text-secondary)' }}>
                  Your password has been reset successfully. You will be redirected to the login page shortly.
                </p>
                <div className="auth-actions">
                  <Link to="/login" className="auth-button">
                    <SignIn size={20} weight="duotone" />
                    Login Now
                  </Link>
                </div>
              </>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <div className="input-with-icon">
                    <Lock size={20} weight="duotone" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Enter your new password"
                      value={formData.password}
                      onChange={handleChange}
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
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-with-icon">
                    <Lock size={20} weight="duotone" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeSlash size={20} weight="duotone" /> : <Eye size={20} weight="duotone" />}
                    </button>
                  </div>
                </div>

                <p className="password-requirements" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                  Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                </p>

                <button
                  type="submit"
                  className={`auth-button ${loading ? 'loading' : ''}`}
                  disabled={loading || !token}
                >
                  {!loading && <Password size={20} weight="duotone" />}
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )}

            <div className="auth-footer">
              <p>
                <Link to="/login" className="auth-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <ArrowLeft size={16} />
                  Back to Login
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

export default ResetPassword;