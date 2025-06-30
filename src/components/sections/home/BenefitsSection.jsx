import React, { useState, useEffect } from 'react';
import { Section, SectionHeader } from '../../ui/layout';
import { FeatureIcon } from '../../ui/icons';
import { OptimizedImage } from '../../ui/media';
import { tv } from 'tailwind-variants';
import { useTranslation } from '../../../utils/i18n';
import SectionDecorations from '../../ui/decorations/SectionDecorations';

// Translation content
const translations = {
  en: {
    sectionTitle: "Our Quality Commitment",
    sectionSubtitle: "Discover what makes our olive oil exceptional",
    benefits: [
      {
        id: 'traditional-harvest',
        title: "Traditional Harvest",
        description: "Hand-picked to preserve quality.",
        ariaLabel: "Learn more about our traditional harvest",
      },
      {
        id: 'cold-press',
        title: "Cold Pressed",
        description: "First cold press for nutrient-rich oil.",
        ariaLabel: "Learn more about our cold press process",
      },
      {
        id: 'premium-quality',
        title: "Premium Quality",
        description: "Rigorous control at every stage.",
        ariaLabel: "Learn more about our quality control",
      },
      {
        id: 'natural',
        title: "100% Natural",
        description: "No additives or preservatives.",
        ariaLabel: "Learn more about our natural commitment",
      }
    ]
  },
  fr: {
    sectionTitle: "Notre Engagement Qualité",
    sectionSubtitle: "Découvrez ce qui rend notre huile d'olive exceptionnelle",
    benefits: [
      {
        id: 'traditional-harvest',
        title: "Récolte Traditionnelle",
        description: "Cueillette à la main pour préserver la qualité.",
        ariaLabel: "En savoir plus sur notre récolte traditionnelle",
      },
      {
        id: 'cold-press',
        title: "Pressage à Froid",
        description: "Première pression à froid pour une huile riche en nutriments.",
        ariaLabel: "En savoir plus sur notre processus de pressage à froid",
      },
      {
        id: 'premium-quality',
        title: "Qualité Premium",
        description: "Un contrôle rigoureux à chaque étape.",
        ariaLabel: "En savoir plus sur notre contrôle qualité",
      },
      {
        id: 'natural',
        title: "100% Naturel",
        description: "Sans additifs ni conservateurs.",
        ariaLabel: "En savoir plus sur notre engagement naturel",
      }
    ]
  },
  ar: {
    sectionTitle: "التزامنا بالجودة",
    sectionSubtitle: "اكتشف ما يجعل زيت الزيتون لدينا استثنائيًا",
    benefits: [
      {
        id: 'traditional-harvest',
        title: "حصاد تقليدي",
        description: "قطف يدوي للحفاظ على الجودة.",
        ariaLabel: "تعرف على المزيد حول حصادنا التقليدي",
      },
      {
        id: 'cold-press',
        title: "عصر على البارد",
        description: "الضغطة الأولى على البارد لزيت غني بالعناصر الغذائية.",
        ariaLabel: "تعرف على المزيد حول عملية العصر على البارد",
      },
      {
        id: 'premium-quality',
        title: "جودة متميزة",
        description: "رقابة صارمة في كل مرحلة.",
        ariaLabel: "تعرف على المزيد حول مراقبة الجودة لدينا",
      },
      {
        id: 'natural',
        title: "100% طبيعي",
        description: "بدون إضافات أو مواد حافظة.",
        ariaLabel: "تعرف على المزيد حول التزامنا بالمنتجات الطبيعية",
      }
    ]
  }
};

// Define unified styles for the benefit icons to match SectionHeader icon style
const benefitIconStyles = tv({
  base: 'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ease-out mb-5 bg-logo-lime/15 border border-logo-lime/30',
  defaultVariants: {}
});

// Icon content styles
const iconContentStyles = tv({
  base: 'text-light-yellow-1',
  defaultVariants: {}
});

// Header icon styles (white variant)
const headerIconStyles = tv({
  base: 'text-white/80',
  defaultVariants: {}
});

// Main component content
const BenefitsSectionContent = () => {
  // State to track if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t } = useTranslation(translations);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Benefit data with icons and images
  const benefits = t('benefits').map(benefit => ({
    ...benefit,
    icon: getIconForBenefit(benefit.id),
    image: getBenefitImagePath(benefit.id)
  }));

  // Helper function to get the appropriate icon for each benefit
  function getIconForBenefit(id) {
    const iconMap = {
      'traditional-harvest': 'tree',
      'cold-press': 'drop',
      'premium-quality': 'medal',
      'natural': 'leaf'
    };
    return iconMap[id] || 'checkCircle';
  }

  // Helper function to map benefit IDs to correct image paths
  function getBenefitImagePath(id) {
    const imageMap = {
      'traditional-harvest': '/images/benefits/recolte',
      'cold-press': '/images/benefits/pressage',
      'premium-quality': '/images/benefits/qualite',
      'natural': '/images/benefits/naturel'
    };
    return imageMap[id] || '';
  }

  // Unified benefit card creator
  const BenefitCard = ({ benefit }) => (
    <div
      key={benefit.id}
      className="group bg-white/10 backdrop-blur-sm rounded-lg p-8 transition-all duration-300 hover:bg-white/15 relative overflow-hidden border border-white/10 hover:border-dark-yellow-1/30"
      role="article"
      aria-label={benefit.ariaLabel}
    >
      {/* Background image that reveals on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 z-0 overflow-hidden">
        <OptimizedImage
          src={benefit.image}
          alt=""
          fit="cover"
          width={400}
          height={300}
          hasWebp={true}
          hasResponsive={true}
          lazy={true}
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, 300px"
          aria-hidden="true"
        />
      </div>

      {/* Radial texture rays */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500 pointer-events-none z-0">
        <div
          className="w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-radial-gradient transition-transform duration-700 ease-out group-hover:rotate-[-25deg] group-hover:scale-110"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
      </div>

      {/* Diagonal lines texture */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 10px)',
          backgroundSize: '20px 20px'
        }}
      ></div>

      {/* Subtle color accent in corner */}
      <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-dark-yellow-1/10 rounded-full transition-transform duration-700 ease-in-out group-hover:scale-125 group-hover:rotate-45"></div>

      <div className="relative z-10">
        {/* Icon with static style, no hover changes */}
        <div className={benefitIconStyles()}>
          <FeatureIcon
            name={benefit.icon}
            size="lg"
            weight="duotone"
            className={iconContentStyles()}
          />
        </div>

        <h3 className="text-xl font-semibold text-light-yellow-1 mb-3 transition-all duration-300 group-hover:translate-y-[-2px]">
          {benefit.title}
        </h3>

        <p className="text-light-yellow-1 opacity-90 transition-all duration-300 group-hover:opacity-100">
          {benefit.description}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <SectionHeader
        icon="medal"
        title={t('sectionTitle')}
        subtitle={t('sectionSubtitle')}
        variant="dark"
        isMobile={isMobile}
        customIconStyles={{
          containerClassName: benefitIconStyles(),
          iconClassName: headerIconStyles()
        }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 mx-auto container">
        {benefits.map(benefit => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </div>
    </>
  );
};

// Main component
export default function BenefitsSection() {
  return (
    <Section
      background="gradient"
      backgroundGradient="brandGreen"
      width="container"
      padding="large"
      overlayType="vignette"
      id="benefits"
      className="relative overflow-hidden max-w-full mx-0"
    >
      {/* Section Decorations with white variant for dark background */}
      <SectionDecorations
        variant="white"
        positions={['bottom-right']}
        customStyles={{
          bottomRight: {
            opacity: 0.15,
            transform: 'scale(1.2) translate(20px, 20px)'
          }
        }}
      />

      <BenefitsSectionContent />
    </Section>
  );
}