import React, { useState, useEffect } from 'react';
import { ChatCircleText, User, At, Phone, Buildings, EnvelopeSimple, PaperPlaneTilt, Warning } from "@phosphor-icons/react";
import Field from "../../../components/forms/Field";
import MessageField from "../../../components/forms/MessageField";
import SectionHeader from '../../../components/ui/section/SectionHeader';
import Button from "../../../components/buttons/Button";
import { validateName, validateEmail, validatePhone, formatPhoneNumber } from '../../../utils/validation';
import './contact.scss';

export default function Contact() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            case 'firstName':
            case 'lastName':
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

        setIsSubmitting(true);

        try {
            // Add your form submission logic here
            console.log('Form data:', formData);
            
            // Reset form after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });
            setTouched({});
            setErrors({});
            
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Une erreur est survenue. Veuillez réessayer.'
            }));
        } finally {
            setIsSubmitting(false);
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
                                    <a href="tel:+212661373204">+212 (661) 37 32 04</a>
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
                                    inputName="firstName" 
                                    Icon={<User size={isMobile ? 18 : 20} weight="duotone" />}
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.firstName ? errors.firstName : ''}
                                    required
                                />
                                <Field 
                                    placeholder="Nom" 
                                    inputName="lastName" 
                                    Icon={<User size={isMobile ? 18 : 20} weight="duotone" />}
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={touched.lastName ? errors.lastName : ''}
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

                            <button 
                                type="submit" 
                                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                <PaperPlaneTilt size={isMobile ? 18 : 20} weight="duotone" />
                                <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
} 