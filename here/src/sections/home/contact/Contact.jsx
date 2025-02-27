import React, { useState, useEffect } from 'react';
import { ChatCircleText, User, At, Phone, Buildings, EnvelopeSimple, PaperPlaneTilt, Warning, CheckCircle } from "@phosphor-icons/react";
import Field from "../../../components/forms/Field";
import MessageField from "../../../components/forms/MessageField";
import SectionHeader from '../../../components/ui/section/SectionHeader';
import Button from "../../../components/buttons/Button";
import { validateName, validateEmail, validatePhone, formatPhoneNumber } from '../../../utils/validation';
import { contactService } from '../../../services/contactService';
import { useApi } from '../../../hooks/useApi';
import './contact.scss';

export default function Contact() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Use the API hook
    const { 
        loading: isSubmitting, 
        error: submitError, 
        execute: submitContact 
    } = useApi(contactService.submitContact);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Format phone number as user types
        if (name === 'phone') {
            setFormData(prev => ({
                ...prev,
                [name]: formatPhoneNumber(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
            case 'surname':
                return validateName(value);
            case 'email':
                return validateEmail(value);
            case 'phone':
                return validatePhone(value);
            case 'message':
                return !value || value.trim() === '' ? 'Veuillez remplir ce champ' : '';
            default:
                return '';
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Only validate if field has been touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Validate all fields and mark them as touched
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
            setTouched(prev => ({
                ...prev,
                [field]: true
            }));
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            const response = await submitContact({
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                phone: formData.phone,
                message: formData.message
            });

            if (!response?.success) {
                throw new Error(response?.error || 'Failed to submit form');
            }

            // Show success message
            setSubmitSuccess(true);
            
            // Reset form after success
            setTimeout(() => {
                setFormData({
                    name: '',
                    surname: '',
                    email: '',
                    phone: '',
                    message: ''
                });
                setTouched({});
                setErrors({});
                setSubmitSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Contact form error:', error);
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'Une erreur est survenue. Veuillez réessayer.'
            }));
        }
    };

    return (
        <section className={`contact-section ${isMobile ? 'mobile' : ''}`} id="contact-form">
            <div className="container">
                <SectionHeader 
                    icon={ChatCircleText}
                    title="Contactez-nous"
                    subtitle="Nous sommes là pour répondre à toutes vos questions"
                    variant="light"
                    isMobile={isMobile}
                />

                <div className={`contact-content ${isMobile ? 'mobile' : ''}`}>
                    {/* Contact Info */}
                    <div className={`contact-info ${isMobile ? 'mobile' : ''}`}>
                        <div className="info-header">
                            <div className="icon-wrapper">
                                <EnvelopeSimple size={isMobile ? 20 : 24} weight="duotone" />
                            </div>
                            <h3>Nos Coordonnées</h3>
                            <p>Plusieurs façons de nous contacter</p>
                        </div>

                        <div className="info-list">
                            <div className="info-item">
                                <Phone size={isMobile ? 20 : 24} weight="duotone" />
                                <div className="item-content">
                                    <span className="label">Téléphone</span>
                                    <a href="tel:+212661323704">+212 (661) 32 37 04</a>
                                    <a href="tel:+212535942682">+212 (535) 94 26 82</a>
                                </div>
                            </div>
                            <div className="info-item">
                                <EnvelopeSimple size={isMobile ? 20 : 24} weight="duotone" />
                                <div className="item-content">
                                    <span className="label">Email</span>
                                    <a href="mailto:contact@dikafood.com">contact@dikafood.com</a>
                                </div>
                            </div>
                            <div className="info-item">
                                <Buildings size={isMobile ? 20 : 24} weight="duotone" />
                                <div className="item-content">
                                    <span className="label">Adresse</span>
                                    <a href="https://maps.app.goo.gl/mJRgbWpwp2ZVFtnx8" target="_blank" rel="noopener noreferrer">
                                        18 Rue Zenata Quartier Industriel Dokkarat, Fes, Maroc
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form className={`contact-form ${isMobile ? 'mobile' : ''}`} onSubmit={handleSubmit} noValidate>
                        <div className="form-header">
                            <div className="icon-wrapper">
                                <ChatCircleText size={isMobile ? 20 : 24} weight="duotone" />
                            </div>
                            <h3>Envoyez-nous un message</h3>
                            <p>Nous vous répondrons dans les plus brefs délais</p>
                        </div>

                        <div className="form-fields">
                            <div className="fields-row">
                                <Field 
                                    placeholder="Prénom" 
                                    inputName="name"
                                    Icon={<User size={isMobile ? 18 : 20} weight="duotone" />}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.name ? errors.name : ''}
                                    required
                                />
                                <Field 
                                    placeholder="Nom" 
                                    inputName="surname"
                                    Icon={<User size={isMobile ? 18 : 20} weight="duotone" />}
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.surname ? errors.surname : ''}
                                    required
                                />
                            </div>
                            <div className="fields-row">
                                <Field 
                                    placeholder="Adresse mail" 
                                    inputName="email" 
                                    Icon={<At size={isMobile ? 18 : 20} weight="duotone" />} 
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.email ? errors.email : ''}
                                    required
                                />
                                <Field 
                                    placeholder="Téléphone" 
                                    inputName="phone" 
                                    Icon={<Phone size={isMobile ? 18 : 20} weight="duotone" />} 
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.phone ? errors.phone : ''}
                                    required
                                />
                            </div>
                            <MessageField 
                                placeholder="Votre message" 
                                inputName="message" 
                                icon={<EnvelopeSimple size={isMobile ? 18 : 20} weight="duotone" />}
                                value={formData.message}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={touched.message ? errors.message : ''}
                                required
                            />

                            {errors.submit && (
                                <div className="submit-error">
                                    <Warning size={16} weight="fill" />
                                    <span>{errors.submit}</span>
                                </div>
                            )}

                            {submitSuccess && (
                                <div className="submit-success">
                                    <CheckCircle size={16} weight="fill" />
                                    <span>Message envoyé avec succès !</span>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={`submit-button ${isSubmitting ? 'submitting' : ''} ${submitSuccess ? 'success' : ''}`}
                                disabled={isSubmitting}
                            >
                                {submitSuccess ? (
                                    <CheckCircle size={20} weight="fill" />
                                ) : (
                                    <ChatCircleText size={20} weight="duotone" />
                                )}
                                <span>
                                    {isSubmitting 
                                        ? 'Envoi en cours...' 
                                        : submitSuccess 
                                            ? 'Message envoyé !' 
                                            : 'Envoyer le message'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
} 