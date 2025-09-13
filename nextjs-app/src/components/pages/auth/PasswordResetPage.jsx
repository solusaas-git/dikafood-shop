import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '@/utils/i18n';
import Icon from '@components/ui/icons/Icon';
import config from '@/config';

const translations = {
  en: {
    title: "Reset Your Password",
    step1_title: "Enter Your Email",
    step1_message: "Enter your email address to receive a password reset code.",
    step2_title: "Enter Reset Code",
    step2_message: "Enter the 6-digit code sent to your email:",
    step3_title: "Create New Password",
    step3_message: "Enter your new password:",
    email_placeholder: "Enter your email",
    code_placeholder: "Enter 6-digit code",
    password_placeholder: "New password",
    confirm_password_placeholder: "Confirm new password",
    send_code_button: "Send Reset Code",
    verify_code_button: "Verify Code",
    reset_password_button: "Reset Password",
    resend_code_button: "Resend Code",
    back_to_login: "Back to Login",
    success_title: "Password Reset Successfully!",
    success_message: "Your password has been reset. You can now log in with your new password.",
    login_button: "Go to Login",
    code_sent: "Reset code sent to your email.",
    invalid_code: "Invalid or expired reset code.",
    passwords_dont_match: "Passwords don't match.",
    password_requirements: "Password must be 8-30 characters with uppercase, lowercase, number, and special character."
  },
  fr: {
    title: "Réinitialiser votre mot de passe",
    step1_title: "Saisissez votre email",
    step1_message: "Saisissez votre adresse email pour recevoir un code de réinitialisation.",
    step2_title: "Saisissez le code de réinitialisation",
    step2_message: "Saisissez le code à 6 chiffres envoyé à votre email :",
    step3_title: "Créer un nouveau mot de passe",
    step3_message: "Saisissez votre nouveau mot de passe :",
    email_placeholder: "Saisissez votre email",
    code_placeholder: "Saisissez le code à 6 chiffres",
    password_placeholder: "Nouveau mot de passe",
    confirm_password_placeholder: "Confirmez le nouveau mot de passe",
    send_code_button: "Envoyer le code",
    verify_code_button: "Vérifier le code",
    reset_password_button: "Réinitialiser le mot de passe",
    resend_code_button: "Renvoyer le code",
    back_to_login: "Retour à la connexion",
    success_title: "Mot de passe réinitialisé avec succès !",
    success_message: "Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
    login_button: "Aller à la connexion",
    code_sent: "Code de réinitialisation envoyé à votre email.",
    invalid_code: "Code de réinitialisation invalide ou expiré.",
    passwords_dont_match: "Les mots de passe ne correspondent pas.",
    password_requirements: "Le mot de passe doit contenir 8-30 caractères avec majuscule, minuscule, chiffre et caractère spécial."
  }
};

const PasswordResetPage = () => {
  const { t } = useTranslation(translations);
  const router = useRouter();
  const { success, error } = useNotification();
  
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: password, 4: success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${config.API.backendUrl}/public/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success(t('code_sent'));
        setStep(2);
      } else {
        error(data.error || 'Failed to send reset code');
      }
    } catch (err) {
      error('Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (code.length === 6) {
      setStep(3);
    } else {
      error('Please enter a valid 6-digit code');
    }
  };

  const validatePassword = (pwd) => {
    if (pwd.length < 8 || pwd.length > 30) return false;
    if (!/[A-Z]/.test(pwd)) return false;
    if (!/[a-z]/.test(pwd)) return false;
    if (!/[0-9]/.test(pwd)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return false;
    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      error(t('password_requirements'));
      return;
    }

    if (password !== confirmPassword) {
      error(t('passwords_dont_match'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${config.API.backendUrl}/public/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword: password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success(t('success_message'));
        setStep(4);
      } else {
        error(data.error || t('invalid_code'));
      }
    } catch (err) {
      error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${config.API.backendUrl}/public/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success(t('code_sent'));
      } else {
        error(data.error || 'Failed to resend code');
      }
    } catch (err) {
      error('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <Icon name="lock" size="2xl" className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">{t('step1_title')}</h1>
            <p className="text-neutral-700 text-lg mb-8 leading-relaxed">{t('step1_message')}</p>
            
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email_placeholder')}
                  className="w-full py-4 px-6 border-2 border-neutral-300 rounded-xl focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-300"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Sending...' : t('send_code_button')}
              </button>
            </form>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Icon name="mail" size="2xl" className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">{t('step2_title')}</h1>
            <p className="text-neutral-700 text-lg mb-8 leading-relaxed">{t('step2_message')}</p>
            
            <div className="bg-light-green-1 rounded-lg p-4 mb-6">
              <p className="text-sm text-logo-green">
                <strong>Email:</strong> {email}
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder={t('code_placeholder')}
                  className="w-full text-center text-2xl font-mono tracking-widest py-4 px-6 border-2 border-blue-500/30 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                  maxLength={6}
                  autoComplete="off"
                />
              </div>
              
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={code.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {t('verify_code_button')}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="w-full bg-gradient-to-r from-neutral-400 to-neutral-500 text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 transform disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : t('resend_code_button')}
                </button>
              </div>
            </form>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <Icon name="key" size="2xl" className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">{t('step3_title')}</h1>
            <p className="text-neutral-700 text-lg mb-8 leading-relaxed">{t('step3_message')}</p>
            
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password_placeholder')}
                  className="w-full py-4 px-6 border-2 border-green-500/30 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('confirm_password_placeholder')}
                  className="w-full py-4 px-6 border-2 border-green-500/30 rounded-xl focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Resetting...' : t('reset_password_button')}
              </button>
            </form>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-logo-green to-dark-green-2 flex items-center justify-center shadow-lg">
              <Icon name="check" size="2xl" className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-dark-green-7 mb-4">{t('success_title')}</h1>
            <p className="text-neutral-700 text-lg mb-8 leading-relaxed">{t('success_message')}</p>
            
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-logo-green to-dark-green-2 text-white py-4 px-8 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
            >
              {t('login_button')}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-green-1 via-light-yellow-1/50 to-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        <div className="bg-gradient-to-br from-neutral-50 to-light-yellow-1/30 rounded-3xl shadow-2xl p-8 border border-logo-lime/20">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <h2 className="text-4xl font-bold text-logo-green mb-2">DikaFood</h2>
              <p className="text-xs text-neutral-600 uppercase tracking-widest">Authentic Moroccan Products</p>
            </div>
          </div>
          
          {renderStep()}

          {/* Back to Login */}
          {step < 4 && (
            <div className="text-center mt-8">
              <button
                onClick={() => router.push('/login')}
                className="text-neutral-600 hover:text-logo-green transition-colors duration-300"
              >
                {t('back_to_login')}
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} DikaFood. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage; 