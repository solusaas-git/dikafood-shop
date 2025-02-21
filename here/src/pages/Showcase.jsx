import React from 'react';
import './showcase.scss';
import Field from '../components/forms/Field';
import MessageField from '../components/forms/MessageField';
import Button from '../components/buttons/Button';
import BenefitCard from '../components/cards/benefit/BenefitCard';
import Accordion from '../components/ui/accordion/Accordion';
import DropDown from '../components/ui/dropdown/DropDown';
import SectionHeader from '../components/ui/section/SectionHeader';
import { ChatCircleText, User, EnvelopeSimple, Phone, Leaf } from "@phosphor-icons/react";

export default function Showcase() {
    // Sample data for components
    const accordionItems = [
        {
            title: "Comment commander ?",
            content: "Suivez ces étapes simples pour passer votre commande..."
        },
        {
            title: "Modes de paiement",
            content: "Nous acceptons plusieurs modes de paiement..."
        }
    ];

    const dropdownOptions = [
        { id: 1, label: "Option 1" },
        { id: 2, label: "Option 2" },
        { id: 3, label: "Option 3" }
    ];

    return (
        <div className="showcase-page">
            <header>
                <h1>Component Showcase</h1>
                <p>Visual library of all components and their variations</p>
            </header>

            <section className="showcase-section">
                <h2>Section Headers</h2>
                <div className="component-grid full-width">
                    <SectionHeader 
                        title="Notre Collection"
                        description="Découvrez notre gamme de produits d'exception"
                        Icon={Leaf}
                        theme="light"
                    />
                    <div className="dark-background">
                        <SectionHeader 
                            title="Notre Histoire"
                            description="Une tradition d'excellence"
                            Icon={Leaf}
                            theme="dark"
                        />
                    </div>
                </div>
            </section>

            <section className="showcase-section">
                <h2>Form Fields</h2>
                <div className="component-grid">
                    <Field 
                        inputName="name"
                        Icon={<User weight="duotone" />}
                        placeholder="Votre nom"
                        required
                    />
                    <Field 
                        inputName="email"
                        Icon={<EnvelopeSimple weight="duotone" />}
                        placeholder="Votre email"
                        type="email"
                        required
                    />
                    <Field 
                        inputName="phone"
                        Icon={<Phone weight="duotone" />}
                        placeholder="Votre téléphone"
                        type="tel"
                        error="Veuillez entrer un numéro valide"
                    />
                    <MessageField 
                        inputName="message"
                        Icon={<ChatCircleText weight="duotone" />}
                        placeholder="Votre message"
                    />
                </div>
            </section>

            <section className="showcase-section">
                <h2>Dropdowns</h2>
                <div className="component-grid">
                    <DropDown 
                        options={dropdownOptions}
                        defaultValue="Sélectionnez une option"
                    />
                </div>
            </section>

            <section className="showcase-section">
                <h2>Buttons</h2>
                <div className="component-grid buttons-showcase">
                    <Button 
                        name="Primary Button"
                        theme="primary"
                    />
                    <Button 
                        name="Secondary Button"
                        theme="secondary"
                    />
                    <Button 
                        name="Disabled Button"
                        theme="primary"
                        disabled
                    />
                    <Button 
                        name="Nav Button"
                        theme="nav"
                    />
                    <Button 
                        name="Nav Active"
                        theme="nav"
                        active
                    />
                    <Button 
                        name="Nav Mobile"
                        theme="nav-mobile"
                    />
                </div>
            </section>

            <section className="showcase-section">
                <h2>Cards</h2>
                <div className="component-grid">
                    <BenefitCard 
                        Icon={User}
                        title="Service Client"
                        descp="Notre équipe est à votre disposition pour vous accompagner"
                        ariaLabel="Service client benefit card"
                    />
                </div>
            </section>

            <section className="showcase-section">
                <h2>Accordion</h2>
                <div className="component-grid">
                    <Accordion items={accordionItems} />
                </div>
            </section>
        </div>
    );
} 