import React from 'react';
import { ChatCircleText, User, At, EnvelopeSimple } from "@phosphor-icons/react";
import Field from "../../../components/forms/Field";
import MessageField from "../../../components/forms/MessageField";
import SectionHeader from '../../../components/ui/section/SectionHeader';
import './contact.scss';

export default function Contact() {
    return (
        <section className="contact-section" id="contact-form">
            <div className="container">
                <SectionHeader 
                    icon={ChatCircleText}
                    title="Contactez-nous"
                    subtitle="Nous sommes là pour vous aider"
                    variant="light"
                />

                <form className="contact-form">
                    <Field 
                        placeholder="Prénom" 
                        inputName="prénom" 
                        Icon={<User weight="duotone" />} 
                    />
                    <Field 
                        placeholder="Nom" 
                        inputName="nom" 
                        Icon={<User weight="duotone" />} 
                    />
                    <Field 
                        placeholder="Adresse mail" 
                        inputName="email" 
                        Icon={<At weight="duotone" />} 
                    />
                    <MessageField 
                        placeholder="Message" 
                        inputName="message" 
                        icon={<EnvelopeSimple weight="duotone" />} 
                        btnName="Envoyer" 
                    />
                </form>
            </div>
        </section>
    );
} 