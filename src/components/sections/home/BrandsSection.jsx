import React, { useState, useEffect, useRef } from 'react';
import { Section, SectionHeader } from '../../ui';
import { BrandCard, EmblaBrandCarousel } from '@/components/features/brands';
import { useTranslation } from '../../../utils/i18n';
import translations from './translations/BrandsSection';

// Brands data with localized content
const FALLBACK_BRANDS = [
  {
    id: 'oued-fes',
    name: 'oued-fes',
    displayName: 'Oued Fès',
    displayNameAr: 'واد فاس',
    icon: 'waves',
    type: "Huile d'olive extra vierge",
    typeAr: "زيت زيتون بكر ممتاز",
    description: "Représentant l'essence de la culture oléicole marocaine, Oued Fès offre une huile d'olive extra vierge aux notes fruitées et équilibrées.",
    descriptionAr: "تمثل واد فاس جوهر ثقافة زيت الزيتون المغربية، وتقدم زيت زيتون بكر ممتاز بنكهات فاكهية ومتوازنة.",
    characteristics: "Fruitée • Artisanale • Premium",
    characteristicsAr: "فاكهي • حرفي • ممتاز",
    usage: "Assaisonnement • Cuisson",
    usageAr: "التتبيل • الطبخ",
    logo: "/images/brands/oued-fs-logo.svg"
  },
  {
    id: 'biladi',
    name: 'biladi',
    displayName: 'Biladi',
    displayNameAr: 'بلادي',
    icon: 'plant',
    type: "Huile de grignons d'olive",
    typeAr: "زيت ثفل الزيتون",
    description: "Huile de grignons d'olive Biladi, obtenue par extraction des résidus d'olives. Parfaite pour la cuisson quotidienne.",
    descriptionAr: "زيت ثفل الزيتون بلادي، يتم الحصول عليه من استخراج بقايا الزيتون. مثالي للطبخ اليومي.",
    characteristics: "Stable • Économique • Polyvalente",
    characteristicsAr: "مستقر • اقتصادي • متعدد الاستخدامات",
    usage: "Friture • Cuisson",
    usageAr: "القلي • الطبخ",
    logo: "/images/brands/biladi-logo.svg"
  },
  {
    id: 'dika-extra',
    name: 'dika-extra',
    displayName: 'Dika Extra Vièrge',
    displayNameAr: 'ديكا إكسترا فيرج',
    icon: 'sunHorizon',
    type: "Huile d'olive extra vierge",
    typeAr: "زيت زيتون بكر ممتاز",
    description: "Huile d'olive extra vierge Dika, première pression à froid. Une qualité supérieure pour vos plats.",
    descriptionAr: "زيت زيتون بكر ممتاز ديكا، ضغطة أولى على البارد. جودة عالية لأطباقك.",
    characteristics: "Pure • Pressée à froid • Premium",
    characteristicsAr: "نقي • معصور على البارد • ممتاز",
    usage: "Salades • Assaisonnements • Cuisine fine",
    usageAr: "السلطات • التتبيل • الطبخ الراقي",
    logo: "/images/brands/dika-logo.svg"
  },
  {
    id: 'chourouk',
    name: 'chourouk',
    displayName: 'Chourouk',
    displayNameAr: 'شروق',
    icon: 'sunHorizon',
    type: "Huile de grignons d'olive",
    typeAr: "زيت ثفل الزيتون",
    description: "Huile de grignons d'olive Chourouk, une solution économique et pratique pour la cuisine de tous les jours.",
    descriptionAr: "زيت ثفل الزيتون شروق، حل اقتصادي وعملي للطبخ اليومي.",
    characteristics: "Polyvalente • Économique • Stable",
    characteristicsAr: "متعدد الاستخدامات • اقتصادي • مستقر",
    usage: "Cuisine quotidienne • Friture",
    usageAr: "الطبخ اليومي • القلي",
    logo: "/images/brands/chourouk-logo.svg"
  },
  {
    id: 'nouarati',
    name: 'nouarati',
    displayName: 'Nouarati',
    displayNameAr: 'نواراتي',
    icon: 'sunHorizon',
    type: "Huile de tournesol",
    typeAr: "زيت عباد الشمس",
    description: "Huile de tournesol Nouarati, riche en vitamine E et acides gras essentiels. Une option saine pour votre cuisine.",
    descriptionAr: "زيت عباد الشمس نواراتي، غني بفيتامين E والأحماض الدهنية الأساسية. خيار صحي لمطبخك.",
    characteristics: "100% Naturelle • Riche en vitamine E • Légère",
    characteristicsAr: "100% طبيعي • غني بفيتامين E • خفيف",
    usage: "Polyvalente • Friture • Pâtisserie",
    usageAr: "متعدد الاستخدامات • القلي • الحلويات",
    logo: "/images/brands/nouarati-logo.svg"
  }
];

/**
 * BrandsSection component for displaying partner brands
 */
export default function BrandsSection() {
  const { t, locale } = useTranslation(translations);
  const [brands, setBrands] = useState(FALLBACK_BRANDS);
  const [loading, setLoading] = useState(false);
  const brandsRef = useRef(null);
  const sectionRef = useRef(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Watch for language changes and force refresh when language changes
  useEffect(() => {
    // Force a refresh when locale changes to ensure logo rendering updates
    setRefreshTrigger(prev => prev + 1);

    // Dispatch a custom event that child components can listen for
    if (sectionRef.current) {
      const event = new CustomEvent('language-changed', {
        detail: { locale, timestamp: Date.now() }
      });
      sectionRef.current.dispatchEvent(event);
    }
  }, [locale]);

  return (
    <Section
      background="gradient"
      backgroundGradient="none"
      width="full"
      className="relative overflow-visible px-0 w-full py-8 md:py-12 lg:py-16 bg-lime-gradient"
      padding="large"
      overlayType="none"
      id="brands-section"
      ref={sectionRef}
      centered={true}
    >
      <SectionHeader
        icon="buildings"
        title={t('title')}
        subtitle={t('subtitle')}
        variant="lime"
        size="small"
        hasDecorators={true}
      />

      <div ref={brandsRef} className="relative w-full flex justify-center items-center">
        {/* Embla Carousel for both desktop and mobile */}
        <EmblaBrandCarousel
          brands={brands}
          className="mt-2 md:mt-4 w-full max-w-screen-xl"
          refreshTrigger={refreshTrigger}
          locale={locale}
        />
      </div>
    </Section>
  );
}