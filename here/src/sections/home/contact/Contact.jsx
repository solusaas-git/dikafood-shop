import React from 'react';
import { ChatCircleText, User, At, Phone, Buildings, EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import Field from "../../../components/forms/Field";
import MessageField from "../../../components/forms/MessageField";
import SectionHeader from '../../../components/ui/section/SectionHeader';
import Button from "../../../components/buttons/Button";
import './contact.scss';

export default function Contact() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form submission logic here
    };

    return (
        <section className="contact-section" id="contact-form">
            <div className="container">
                <SectionHeader 
                    icon={ChatCircleText}
                    title="Contactez-nous"
                    subtitle="Nous sommes là pour répondre à toutes vos questions"
                    variant="light"
                />

                <div className="contact-content">
                    {/* Contact Info */}
                    <div className="contact-info">
                        <div className="info-header">
                            <div className="icon-wrapper">
                                <EnvelopeSimple weight="duotone" />
                            </div>
                            <h3>Nos Coordonnées</h3>
                            <p>Plusieurs façons de nous contacter</p>
                        </div>

                        <div className="info-list">
                            <div className="info-item">
                                <Phone weight="duotone" />
                                <div className="item-content">
                                    <span className="label">Téléphone</span>
                                    <a href="tel:+212661373204">+212 (661) 37 32 04</a>
                                    <a href="tel:+212535942682">+212 (535) 94 26 82</a>
                                </div>
                            </div>
                            <div className="info-item">
                                <EnvelopeSimple weight="duotone" />
                                <div className="item-content">
                                    <span className="label">Email</span>
                                    <a href="mailto:contact@dikafood.com">contact@dikafood.com</a>
                                </div>
                            </div>
                            <div className="info-item">
                                <Buildings weight="duotone" />
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
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-header">
                            <div className="icon-wrapper">
                                <ChatCircleText weight="duotone" />
                            </div>
                            <h3>Envoyez-nous un message</h3>
                            <p>Nous vous répondrons dans les plus brefs délais</p>
                        </div>

                        <div className="form-fields">
                            <div className="fields-row">
                                <Field 
                                    placeholder="Prénom" 
                                    inputName="firstName" 
                                    Icon={<User weight="duotone" />}
                                    required
                                />
                                <Field 
                                    placeholder="Nom" 
                                    inputName="lastName" 
                                    Icon={<User weight="duotone" />}
                                    required
                                />
                            </div>
                            <div className="fields-row">
                                <Field 
                                    placeholder="Adresse mail" 
                                    inputName="email" 
                                    Icon={<At weight="duotone" />} 
                                    type="email"
                                    required
                                />
                                <Field 
                                    placeholder="Téléphone" 
                                    inputName="phone" 
                                    Icon={<Phone weight="duotone" />} 
                                    type="tel"
                                    required
                                />
                            </div>
                            <MessageField 
                                placeholder="Votre message" 
                                inputName="message" 
                                icon={<EnvelopeSimple weight="duotone" />}
                                required
                            />
                            <button type="submit" className="submit-button">
                                <PaperPlaneTilt weight="duotone" />
                                <span>Envoyer le message</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
} 