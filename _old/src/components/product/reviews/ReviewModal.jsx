import React, { useState, useEffect, useRef } from 'react';
import { X, Star, CheckCircle, User, Envelope, Notepad, ChatText } from '@phosphor-icons/react';
import './ReviewModal.scss';

const ReviewModal = ({ isOpen, onClose, productId, productName, onSubmitReview }) => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    title: '',
    review: ''
  });
  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset form state when modal closes
      setFormData({
        name: '',
        email: '',
        rating: 0,
        title: '',
        review: ''
      });
      setErrors({});
      setIsSubmitting(false);
      setIsSuccess(false);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (formData.rating === 0) newErrors.rating = 'Merci de donner une note';
    if (!formData.review.trim()) newErrors.review = 'Votre avis est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // In a real app, this would be an API call
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (onSubmitReview) {
          onSubmitReview({
            ...formData,
            date: new Date().toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          });
        }

        setIsSuccess(true);

        // Close the modal after showing success message
        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Error submitting review:', error);
        setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStickButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleStarHover = (rating) => {
    setHoveredRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        {isSuccess ? (
          <div className="success-message">
            <CheckCircle size={64} weight="duotone" />
            <h3>Merci pour votre avis!</h3>
            <p>Votre avis a été envoyé avec succès et sera publié prochainement.</p>
          </div>
        ) : (
          <>
            <button className="close-button" onClick={onClose}>
              <X size={24} weight="bold" />
            </button>

            <div className="modal-header">
              <h2>Écrire un avis</h2>
              <p className="product-name">{productName}</p>
            </div>

            <div className="scrollable-content">
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="rating-selector">
                  <label>Votre note</label>
                  <div className="stars-container">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={32}
                        weight="duotone"
                        className={`star ${
                          star <= (hoveredRating || formData.rating) ? 'star-filled' : 'star-empty'
                        } duotone`}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                        onMouseLeave={handleStarLeave}
                      />
                    ))}
                  </div>
                  {errors.rating && <div className="error-message">{errors.rating}</div>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <div className="input-with-icon">
                      <User weight="duotone" size={18} className="input-icon" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                      />
                    </div>
                    {errors.name && <div className="error-message">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-with-icon">
                      <Envelope weight="duotone" size={18} className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Votre email"
                      />
                    </div>
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="title">Titre (optionnel)</label>
                  <div className="input-with-icon">
                    <Notepad weight="duotone" size={18} className="input-icon" />
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Titre de votre avis"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review">Votre avis</label>
                  <div className="input-with-icon textarea-container">
                    <ChatText weight="duotone" size={18} className="input-icon textarea-icon" />
                    <textarea
                      id="review"
                      name="review"
                      value={formData.review}
                      onChange={handleChange}
                      placeholder="Partagez votre expérience avec ce produit..."
                      rows={4}
                    />
                  </div>
                  {errors.review && <div className="error-message">{errors.review}</div>}
                </div>

                {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
              </form>
            </div>

            <div className="sticky-footer">
              <button
                type="button"
                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
                onClick={handleStickButtonClick}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;