import React, { useState } from 'react';
import Page from '@components/ui/layout/Page';
import { Section } from '@components/ui/layout';
import { 
  ChatCircleText, 
  Phone, 
  EnvelopeSimple, 
  MapPin, 
  Clock,
  WhatsappLogo,
  FacebookLogo,
  InstagramLogo
} from '@phosphor-icons/react';
import SectionHeader from '@/components/ui/layout/SectionHeader';
import SectionDecorations from '@/components/ui/decorations/SectionDecorations';
import { ContactForm } from '@/components/features/contact';
import { useTranslation } from '@/utils/i18n';

/**
 * ContactPage component - Contact page with form and business information
 */
const ContactPage = () => {
  const { t } = useTranslation();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSuccess = (formData) => {
    setFormSubmitted(true);
    console.log('Contact form submitted:', formData);
    // Reset after 3 seconds
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const handleFormError = (error) => {
    console.error('Contact form error:', error);
  };

  return (
    <Page
      title="Nous contacter"
      description="Contactez l'équipe DikaFood pour toute question, suggestion ou demande d'information. Nous sommes là pour vous aider."
      canonicalUrl="/contact"
      backgroundClass="bg-white"
      className="flex flex-col"
    >
      {/* Hero Section */}
      <section
        className="w-full pt-32 pb-20 md:pt-36 md:pb-28 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(168, 203, 56, 0.1) 0%, rgba(235, 235, 71, 0.15) 50%, rgba(168, 203, 56, 0.1) 100%)"
        }}
      >
        <SectionDecorations variant="light" positions={['top-left', 'bottom-right']} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green-7 mb-6">
              Nous{' '}
              <span className="text-logo-lime">Contacter</span>
            </h1>
            <p className="text-xl md:text-2xl text-dark-green-6 leading-relaxed mb-8">
              Une question ? Une suggestion ? Notre équipe est là pour vous accompagner 
              dans votre expérience DikaFood.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <Section className="py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-dark-green-7 mb-6">
                Restons en contact
              </h2>
              <p className="text-lg text-dark-green-6 leading-relaxed">
                Nous sommes toujours ravis d'échanger avec nos clients. 
                N'hésitez pas à nous contacter par le moyen qui vous convient le mieux.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {[
                {
                  icon: Phone,
                  title: "Téléphone Bureau",
                  info: "+212 5 359-42682",
                  subtitle: "Lun-Ven: 9h-18h",
                  action: "tel:+212535942682"
                },
                {
                  icon: WhatsappLogo,
                  title: "Mobile / WhatsApp",
                  info: "+212 6 613-23704",
                  subtitle: "Support instantané",
                  action: "https://wa.me/212661323704"
                },
                {
                  icon: EnvelopeSimple,
                  title: "Email",
                  info: "contact@dikafood.ma",
                  subtitle: "Réponse sous 24h",
                  action: "mailto:contact@dikafood.ma"
                }
              ].map((contact, index) => (
                <a
                  key={index}
                  href={contact.action}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-logo-lime/20 hover:border-logo-lime/40 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-logo-lime/20 rounded-full flex items-center justify-center group-hover:bg-logo-lime/30 transition-colors">
                    <contact.icon size={24} weight="duotone" className="text-logo-lime" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-green-7 mb-1">{contact.title}</h3>
                    <div className="text-dark-green-6 font-medium">{contact.info}</div>
                    <div className="text-sm text-dark-green-5">{contact.subtitle}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-semibold text-dark-green-7 mb-4">Suivez-nous</h3>
              <div className="flex gap-4">
                {[
                  { icon: FacebookLogo, href: "#", label: "Facebook" },
                  { icon: InstagramLogo, href: "#", label: "Instagram" },
                  { icon: WhatsappLogo, href: "#", label: "WhatsApp" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 bg-logo-lime/20 rounded-full flex items-center justify-center hover:bg-logo-lime/30 transition-colors"
                  >
                    <social.icon size={20} weight="duotone" className="text-logo-lime" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-light-lime-1/20 to-light-yellow-1/30 rounded-3xl p-8 border border-logo-lime/20">
            <h2 className="text-2xl font-bold text-dark-green-7 mb-6">
              Envoyez-nous un message
            </h2>
            
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatCircleText size={32} weight="duotone" className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Message envoyé !
                </h3>
                <p className="text-green-600">
                  Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <ContactForm
                onSuccess={handleFormSuccess}
                onError={handleFormError}
                source="contact"
                className="space-y-6"
              />
            )}
          </div>
        </div>
      </Section>

      {/* Business Hours & Location */}
      <Section 
        className="py-16 md:py-20 relative"
        style={{
          background: "linear-gradient(to bottom right, rgba(235, 235, 71, 0.05), rgba(235, 235, 71, 0.1), rgba(235, 235, 71, 0.05))"
        }}
      >
        <SectionDecorations variant="light" positions={['top-right']} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Business Hours */}
          <div className="bg-white/80 rounded-2xl p-8 border border-logo-lime/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-logo-lime/20 rounded-full flex items-center justify-center">
                <Clock size={24} weight="duotone" className="text-logo-lime" />
              </div>
              <h3 className="text-2xl font-bold text-dark-green-7">Horaires d'ouverture</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { day: "Lundi - Vendredi", hours: "9h00 - 18h00" },
                { day: "Samedi", hours: "9h00 - 16h00" },
                { day: "Dimanche", hours: "10h00 - 14h00" }
              ].map((schedule, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-dark-green-6 font-medium">{schedule.day}</span>
                  <span className="text-dark-green-7 font-semibold">{schedule.hours}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-logo-lime/10 rounded-lg">
              <p className="text-sm text-dark-green-6">
                <strong>Support client :</strong> Disponible pendant les heures d'ouverture 
                par téléphone et WhatsApp. Email traité sous 24h.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/80 rounded-2xl p-8 border border-logo-lime/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-logo-lime/20 rounded-full flex items-center justify-center">
                <MapPin size={24} weight="duotone" className="text-logo-lime" />
              </div>
              <h3 className="text-2xl font-bold text-dark-green-7">Notre adresse</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-dark-green-7 mb-2">Adresse</h4>
                <p className="text-dark-green-6 leading-relaxed">
                  18 Rue Zenata<br />
                  Fès 30000<br />
                  Maroc
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-dark-green-7 mb-2">Fondée en</h4>
                <p className="text-dark-green-6 leading-relaxed font-medium">
                  1957
                </p>
                <p className="text-sm text-dark-green-5">
                  Plus de 65 ans d'expérience
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <a
                href="https://maps.google.com/maps?q=18+Rue+Zenata,+Fès+30000,+Maroc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-logo-lime hover:text-logo-lime/80 font-medium transition-colors"
              >
                <MapPin size={16} weight="duotone" />
                Voir sur Google Maps
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section className="py-16 md:py-20">
        <SectionHeader
          icon={ChatCircleText}
          title="Questions fréquentes"
          subtitle="Trouvez rapidement les réponses à vos questions"
          variant="light"
          className="mb-12"
        />
        
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            {
              question: "Quels sont vos délais de livraison ?",
              answer: "Nous livrons généralement sous 24-48h pour Fès et ses environs, et sous 3-5 jours ouvrables pour le reste du Maroc."
            },
            {
              question: "Proposez-vous la livraison gratuite ?",
              answer: "Oui, la livraison est gratuite pour toute commande supérieure à 200 DH dans la région de Fès."
            },
            {
              question: "Comment puis-je suivre ma commande ?",
              answer: "Vous recevrez un email de confirmation avec un numéro de suivi dès l'expédition de votre commande."
            },
            {
              question: "Acceptez-vous les retours ?",
              answer: "Oui, nous acceptons les retours sous 7 jours pour les produits non périssables et non ouverts."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-xl border border-logo-lime/20 p-6">
              <h3 className="text-lg font-semibold text-dark-green-7 mb-3">{faq.question}</h3>
              <p className="text-dark-green-6 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
};

export default ContactPage;
