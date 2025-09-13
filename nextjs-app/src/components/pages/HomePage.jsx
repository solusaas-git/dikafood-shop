import React from 'react';
import Page from '@components/ui/layout/Page';
import HeroSection from '@components/sections/home/HeroSection';
import BrandsSection from '@components/sections/home/BrandsSection';
import BenefitsSection from '@components/sections/home/BenefitsSection';
import ReviewsSection from '@components/sections/home/ReviewsSection';
import CatalogSection from '@components/sections/home/CatalogSection';
import FAQSection from '@components/sections/home/FAQSection';
import ContactSection from '@components/sections/home/ContactSection';

/**
 * HomePage component - Landing page of the application
 */
const HomePage = () => {
  return (
    <Page
      title="Accueil"
      description="DikaFood, votre épicerie africaine en ligne. Découvrez nos produits authentiques livrés directement chez vous."
      canonicalUrl="/"
      backgroundClass="bg-white"
      className="flex flex-col"
    >
      {/* All sections are loaded eagerly now */}
      <HeroSection />
      <BrandsSection />
      <BenefitsSection />
      <ReviewsSection />
      <CatalogSection />
      <FAQSection />
      <ContactSection />
    </Page>
  );
};

export default HomePage;