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
    if (!currentPassword) errors.currentPassword = 'Le mot de passe actuel est requis';
    if (!newPassword) errors.newPassword = 'Le nouveau mot de passe est requis';
    else if (newPassword.length < 6) errors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    if (!confirmPassword) errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Les mots de passe ne correspondent pas';

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
            Changer le mot de passe
          </h4>

          {changePasswordSuccess && (
            <div className="success-message">
              Mot de passe modifié avec succès !
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
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
              <label htmlFor="newPassword">Nouveau mot de passe</label>
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
              <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
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
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>

        <div className="settings-section">
          <h4>
            <Bell size={18} weight="duotone" />
            Préférences de notification
          </h4>

          <div className="settings-options">
            <div className="setting-option">
              <div className="setting-text">
                <span>Mises à jour des commandes</span>
                <small>Recevoir des notifications sur l'état de vos commandes</small>
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
                <span>Promotions et offres</span>
                <small>Recevoir des promotions, réductions et offres spéciales</small>
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
                <span>Annonces de nouveaux produits</span>
                <small>Soyez les premiers à connaître les nouveaux produits</small>
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
                <span>Newsletter hebdomadaire</span>
                <small>Recevez notre newsletter hebdomadaire avec des recettes et des conseils</small>
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
            Paramètres de confidentialité
          </h4>

          <div className="settings-options">
            <div className="setting-option">
              <div className="setting-text">
                <span>Partager les données d'utilisation</span>
                <small>Aidez-nous à améliorer nos services en partageant des données anonymes</small>
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
                <span>Enregistrer les informations de paiement</span>
                <small>Enregistrer vos informations de paiement pour des achats plus rapides</small>
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
                <span>Conserver l'historique des commandes</span>
                <small>Enregistrer votre historique de commandes pour une référence future</small>
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
      title="Mon Compte"
      sidebar={<ModalNavSidebar activeSection="settings" onSectionChange={handleSectionChange} />}
    >
      {renderSettingsContent()}
    </Modal>
  );
};

export default SettingsModal;