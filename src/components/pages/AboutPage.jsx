import React from 'react';
import Page from '@components/ui/layout/Page';
import { Section } from '@components/ui/layout';
import { Heart, Users, Target, Star, MapPin, Calendar } from '@phosphor-icons/react';
import SectionHeader from '@/components/ui/layout/SectionHeader';
import SectionDecorations from '@/components/ui/decorations/SectionDecorations';
import { useTranslation } from '@/utils/i18n';

/**
 * AboutPage component - About us page with company information
 */
const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <Page
      title="À propos de nous"
      description="Découvrez l'histoire de DikaFood, notre mission et notre équipe passionnée par la cuisine africaine authentique."
      canonicalUrl="/about"
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
              À propos de{' '}
              <span className="text-logo-lime">DikaFood</span>
            </h1>
            <p className="text-xl md:text-2xl text-dark-green-6 leading-relaxed mb-8">
              Votre épicerie marocaine en ligne, créée avec passion pour vous offrir 
              les saveurs authentiques du Maroc, directement chez vous.
            </p>
            <div className="flex items-center justify-center gap-6 text-dark-green-6">
              <div className="flex items-center gap-2">
                <Calendar size={20} weight="duotone" />
                <span>Depuis 1957</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} weight="duotone" />
                <span>Fès, Maroc</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} weight="duotone" />
                <span>+1000 clients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <Section className="py-16 md:py-20">
        <SectionHeader
          icon={Heart}
          title="Notre Histoire"
          subtitle="Une passion pour les saveurs authentiques du Maroc"
          variant="light"
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-dark-green-6 leading-relaxed">
              DikaFood est né d'une passion profonde pour la cuisine marocaine authentique 
              et du désir de partager ces saveurs uniques avec le monde entier. Fondée en 1957, 
              notre entreprise familiale s'est donnée pour mission de rendre les produits marocains 
              de qualité accessibles à tous.
            </p>
            <p className="text-lg text-dark-green-6 leading-relaxed">
              Depuis plus de 65 ans, nous avons bâti notre réputation sur l'authenticité 
              et la qualité de nos produits. Ce qui a commencé comme une petite épicerie 
              à Fès est devenu aujourd'hui une référence dans la distribution de produits 
              marocains authentiques et de spécialités du terroir.
            </p>
            <p className="text-lg text-dark-green-6 leading-relaxed">
              Aujourd'hui, DikaFood continue d'honorer ses traditions familiales tout en 
              embrassant l'innovation, servant plus de 1000 familles à travers le Maroc 
              et au-delà avec la même passion qui nous anime depuis 1957.
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-logo-lime/20 to-light-yellow-1/30 rounded-3xl p-8 border border-logo-lime/20">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-logo-lime/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart size={40} weight="duotone" className="text-logo-lime" />
                </div>
                <h3 className="text-2xl font-bold text-dark-green-7">Notre Vision</h3>
                <p className="text-dark-green-6 leading-relaxed">
                  Connecter les familles marocaines à leurs racines culinaires, 
                  où qu'elles se trouvent dans le monde.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Our Values Section */}
      <Section 
        className="py-16 md:py-20 relative"
        style={{
          background: "linear-gradient(to bottom right, rgba(235, 235, 71, 0.05), rgba(235, 235, 71, 0.1), rgba(235, 235, 71, 0.05))"
        }}
      >
        <SectionDecorations variant="light" positions={['top-right']} />
        
        <SectionHeader
          icon={Target}
          title="Nos Valeurs"
          subtitle="Les principes qui guident chacune de nos actions"
          variant="light"
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Heart,
              title: "Authenticité",
              description: "Nous sélectionnons soigneusement chaque produit pour garantir son authenticité et sa qualité."
            },
            {
              icon: Users,
              title: "Communauté",
              description: "Nous créons des liens durables avec nos clients et partenaires pour bâtir une communauté unie."
            },
            {
              icon: Star,
              title: "Excellence",
              description: "Nous nous efforçons d'offrir le meilleur service possible, de la sélection à la livraison."
            }
          ].map((value, index) => (
            <div key={index} className="bg-white/80 rounded-2xl p-6 border border-logo-lime/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-logo-lime/20 rounded-full flex items-center justify-center mb-4">
                <value.icon size={24} weight="duotone" className="text-logo-lime" />
              </div>
              <h3 className="text-xl font-semibold text-dark-green-7 mb-3">{value.title}</h3>
              <p className="text-dark-green-6 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Our Mission Section */}
      <Section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-logo-lime/10 to-light-yellow-1/20 rounded-3xl p-12 border border-logo-lime/20">
            <div className="w-20 h-20 bg-logo-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target size={40} weight="duotone" className="text-logo-lime" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-green-7 mb-6">Notre Mission</h2>
            <p className="text-xl text-dark-green-6 leading-relaxed mb-8">
              Rendre les saveurs authentiques du Maroc accessibles à tous, 
              en offrant une sélection rigoureuse de produits de qualité, 
              livrés avec soin et passion.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-logo-lime mb-2">500+</div>
                <div className="text-dark-green-6">Produits disponibles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-logo-lime mb-2">1000+</div>
                <div className="text-dark-green-6">Clients satisfaits</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-logo-lime mb-2">50+</div>
                <div className="text-dark-green-6">Marques partenaires</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section 
        className="py-16 md:py-20 relative"
        style={{
          background: "linear-gradient(to bottom right, rgba(168, 203, 56, 0.05), rgba(168, 203, 56, 0.1), rgba(168, 203, 56, 0.05))"
        }}
      >
        <SectionDecorations variant="light" positions={['bottom-left']} />
        
        <SectionHeader
          icon={Users}
          title="Notre Équipe"
          subtitle="Des passionnés dédiés à votre satisfaction"
          variant="light"
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Mehdi Bouayad",
              role: "Fondateur & CEO",
              description: "Visionnaire et passionné par la cuisine marocaine authentique, Mehdi dirige DikaFood avec la même passion familiale depuis des décennies."
            },
            {
              name: "Khalid Zyani",
              role: "Directeur Commercial",
              description: "Expert en distribution et relations clients, Khalid supervise nos opérations commerciales et assure la satisfaction de notre clientèle."
            },
            {
              name: "Aicha Benali",
              role: "Responsable Service Client & SAV",
              description: "Spécialisée dans l'accompagnement client et le service après-vente, Aicha veille à ce que chaque client bénéficie d'une expérience exceptionnelle."
            }
          ].map((member, index) => (
            <div key={index} className="bg-white/80 rounded-2xl p-6 border border-logo-lime/20 shadow-sm text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-logo-lime/20 to-light-yellow-1/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} weight="duotone" className="text-logo-lime" />
              </div>
              <h3 className="text-xl font-semibold text-dark-green-7 mb-2">{member.name}</h3>
              <div className="text-logo-lime font-medium mb-3">{member.role}</div>
              <p className="text-dark-green-6 text-sm leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Call to Action Section */}
      <Section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-green-7 mb-6">
            Rejoignez la famille DikaFood
          </h2>
          <p className="text-xl text-dark-green-6 leading-relaxed mb-8">
            Découvrez dès maintenant notre sélection de produits authentiques 
            et laissez-vous transporter par les saveurs du Maroc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-logo-lime text-dark-green-7 font-semibold rounded-full hover:bg-logo-lime/90 transition-colors shadow-lg hover:shadow-xl"
            >
              Découvrir nos produits
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-dark-green-7 font-semibold rounded-full border-2 border-logo-lime hover:bg-logo-lime/10 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </Section>
    </Page>
  );
};

export default AboutPage;
