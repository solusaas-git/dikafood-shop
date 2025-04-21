import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/modal/Modal';
import ModalNavSidebar from './ModalNavSidebar';
import { User, EnvelopeSimple, Phone, MapPin } from '@phosphor-icons/react';
import './profile-modals.scss';

const ProfileModal = ({ isOpen, onClose, initialSection = 'profile' }) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [errors, setErrors] = useState({});

  // Reset activeSection when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveSection('profile');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear errors when typing
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await updateProfile(formData);

      if (result.success) {
        setIsEditing(false);
      } else {
        setErrors({
          general: result.error || 'Failed to update profile'
        });
      }
    } catch (error) {
      setErrors({
        general: 'An error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    // Save any pending changes
    if (isEditing) {
      setIsEditing(false);
    }

    // Change the section
    setActiveSection(section);

    // If we need to navigate to other modals entirely
    if (section !== 'profile' && onClose) {
      onClose(section); // Pass the section to onClose for the parent to handle
    }
  };

  const renderProfileContent = () => {
    return (
      <div className="profile-modal">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}

            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-with-icon">
                <User size={18} weight="duotone" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                />
              </div>
              {errors.firstName && <div className="error-text">{errors.firstName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-with-icon">
                <User size={18} weight="duotone" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                />
              </div>
              {errors.lastName && <div className="error-text">{errors.lastName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <EnvelopeSimple size={18} weight="duotone" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-with-icon">
                <Phone size={18} weight="duotone" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <div className="input-with-icon">
                <MapPin size={18} weight="duotone" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user?.firstName?.charAt(0) || ''}
                {user?.lastName?.charAt(0) || ''}
              </div>
              <h4>{user?.firstName} {user?.lastName}</h4>
            </div>

            <div className="profile-info">
              <div className="info-item">
                <div className="info-label">
                  <EnvelopeSimple size={18} weight="duotone" />
                  <span>Email</span>
                </div>
                <div className="info-value">{user?.email}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <Phone size={18} weight="duotone" />
                  <span>Phone Number</span>
                </div>
                <div className="info-value">{user?.phone || 'Not specified'}</div>
              </div>

              <div className="info-item">
                <div className="info-label">
                  <MapPin size={18} weight="duotone" />
                  <span>Address</span>
                </div>
                <div className="info-value">{user?.address || 'Not specified'}</div>
              </div>
            </div>

            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Account"
      sidebar={<ModalNavSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />}
    >
      {renderProfileContent()}
    </Modal>
  );
};

export default ProfileModal;