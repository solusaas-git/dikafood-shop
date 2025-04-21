import React, { useState, useEffect } from 'react';
import Modal from '../ui/modal/Modal';
import ModalNavSidebar from './ModalNavSidebar';
import { useAuth } from '../../context/AuthContext';
import { Lock, Bell, Globe, ShieldCheck, ToggleLeft, ToggleRight } from '@phosphor-icons/react';
import './profile-modals.scss';

const SettingsModal = ({ isOpen, onClose, initialSection = 'settings' }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    newsletter: true
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    savePaymentInfo: true,
    saveOrderHistory: true
  });

  // Reset success message when modal opens
  useEffect(() => {
    if (isOpen && changePasswordSuccess) {
      setChangePasswordSuccess(false);
    }
  }, [isOpen, changePasswordSuccess]);

  const handleSectionChange = (section) => {
    // If we need to navigate to other modals entirely
    if (section !== 'settings' && onClose) {
      onClose(section);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    // Simple validation
    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Current password is required';
    if (!newPassword) errors.newPassword = 'New password is required';
    else if (newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // In a real app, you would call an API to change the password
    // For demo, we'll just show a success message
    setChangePasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors({});

    // Hide success message after 3 seconds
    setTimeout(() => {
      setChangePasswordSuccess(false);
    }, 3000);
  };

  const handleToggleNotification = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handleTogglePrivacy = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
  };

  const renderSettingsContent = () => {
    return (
      <div className="settings-modal">
        <div className="settings-section">
          <h4>
            <Lock size={18} weight="duotone" />
            Change Password
          </h4>

          {changePasswordSuccess && (
            <div className="success-message">
              Password changed successfully!
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={passwordErrors.currentPassword ? 'error' : ''}
              />
              {passwordErrors.currentPassword && (
                <div className="error-text">{passwordErrors.currentPassword}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={passwordErrors.newPassword ? 'error' : ''}
              />
              {passwordErrors.newPassword && (
                <div className="error-text">{passwordErrors.newPassword}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={passwordErrors.confirmPassword ? 'error' : ''}
              />
              {passwordErrors.confirmPassword && (
                <div className="error-text">{passwordErrors.confirmPassword}</div>
              )}
            </div>

            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </form>
        </div>

        <div className="settings-section">
          <h4>
            <Bell size={18} weight="duotone" />
            Notification Preferences
          </h4>

          <div className="settings-options">
            <div className="setting-option">
              <div className="setting-text">
                <span>Order updates</span>
                <small>Get notified about your order status</small>
              </div>
              <button
                className="toggle-btn"
                onClick={() => handleToggleNotification('orderUpdates')}
              >
                {notificationSettings.orderUpdates ? (
                  <ToggleRight size={28} weight="fill" className="toggle-on" />
                ) : (
                  <ToggleLeft size={28} weight="regular" className="toggle-off" />
                )}
              </button>
            </div>

            <div className="setting-option">
              <div className="setting-text">
                <span>Promotions and deals</span>
                <small>Receive promotions, discounts, and special offers</small>
              </div>
              <button
                className="toggle-btn"
                onClick={() => handleToggleNotification('promotions')}
              >
                {notificationSettings.promotions ? (
                  <ToggleRight size={28} weight="fill" className="toggle-on" />
                ) : (
                  <ToggleLeft size={28} weight="regular" className="toggle-off" />
                )}
              </button>
            </div>

            <div className="setting-option">
              <div className="setting-text">
                <span>New product announcements</span>
                <small>Be the first to know about new products</small>
              </div>
              <button
                className="toggle-btn"
                onClick={() => handleToggleNotification('newProducts')}
              >
                {notificationSettings.newProducts ? (
                  <ToggleRight size={28} weight="fill" className="toggle-on" />
                ) : (
                  <ToggleLeft size={28} weight="regular" className="toggle-off" />
                )}
              </button>
            </div>

            <div className="setting-option">
              <div className="setting-text">
                <span>Weekly newsletter</span>
                <small>Get our weekly newsletter with recipes and tips</small>
              </div>
              <button
                className="toggle-btn"
                onClick={() => handleToggleNotification('newsletter')}
              >
                {notificationSettings.newsletter ? (
                  <ToggleRight size={28} weight="fill" className="toggle-on" />
                ) : (
                  <ToggleLeft size={28} weight="regular" className="toggle-off" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h4>
            <ShieldCheck size={18} weight="duotone" />
            Privacy Settings
          </h4>

          <div className="settings-options">
            <div className="setting-option">
              <div className="setting-text">
                <span>Share usage data</span>
                <small>Help us improve by sharing anonymous usage data</small>
              </div>
              <button
                className="toggle-btn"
                onClick={() => handleTogglePrivacy('shareData')}
              >
                {privacySettings.shareData ? (
                  <ToggleRight size={28} weight="fill" className="toggle-on" />
                ) : (
                  <ToggleLeft size={28} weight="regular" className="toggle-off" />
                )}
              </button>
            </div>

            <div className="setting-option">
              <div className="setting-text">
                <span>Save payment information</span>
                <small>Securely save payment methods for faster checkout</small>
              </div>
              <button
                className="toggle-btn"
                onClick={() => handleTogglePrivacy('savePaymentInfo')}
              >
                {privacySettings.savePaymentInfo ? (
                  <ToggleRight size={28} weight="fill" className="toggle-on" />
                ) : (
                  <ToggleLeft size={28} weight="regular" className="toggle-off" />
                )}
              </button>
            </div>

            <div className="setting-option">
              <div className="setting-text">
                <span>Save order history</span>
                <small>Keep a record of your previous orders</small>
              </div>
              <button
                className="toggle-btn"
                onClick={() => handleTogglePrivacy('saveOrderHistory')}
              >
                {privacySettings.saveOrderHistory ? (
                  <ToggleRight size={28} weight="fill" className="toggle-on" />
                ) : (
                  <ToggleLeft size={28} weight="regular" className="toggle-off" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Account"
      sidebar={<ModalNavSidebar activeSection="settings" onSectionChange={handleSectionChange} />}
    >
      {renderSettingsContent()}
    </Modal>
  );
};

export default SettingsModal;