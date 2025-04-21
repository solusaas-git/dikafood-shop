import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { EnvelopeSimple, ArrowLeft, CheckCircle, WarningCircle, PaperPlaneTilt } from '@phosphor-icons/react';
import NavBar from '../../sections/shared/navbar/NavBar';
import Footer from '../../sections/shared/footer/Footer';
import './auth.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful request
      setSuccess(true);
    } catch (err) {
      setError('Unable to send reset link. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password | DikaFood</title>
        <meta name="description" content="Reset your DikaFood account password" />
      </Helmet>

      <NavBar />

      <div className="auth-page">
        <div className="container">
          <div className="auth-container">
            <div className="auth-header">
              <h1>Forgot Password</h1>
              <p>Enter your email to receive a password reset link</p>
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
                  Reset link sent! Please check your email
                </div>
                <p style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--color-text-secondary)' }}>
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
                <div className="auth-actions">
                  <Link to="/login" className="auth-button">
                    <ArrowLeft size={20} weight="duotone" />
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <EnvelopeSimple size={20} weight="duotone" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      className={error ? 'error' : ''}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`auth-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {!loading && <PaperPlaneTilt size={20} weight="duotone" />}
                  {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;