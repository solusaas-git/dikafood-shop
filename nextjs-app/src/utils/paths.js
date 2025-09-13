/**
 * Centralized import paths for components and utilities
 */
export const paths = {
  // UI Components
  ui: {
    layout: {
      Section: '@/components/ui/layout/Section',
      Container: '@/components/ui/layout/Container',
      Grid: '@/components/ui/layout/Grid',
      Flex: '@/components/ui/layout/Flex',
    },
    inputs: {
      Button: '@/components/ui/inputs/Button',
      Input: '@/components/ui/inputs/Input',
      Checkbox: '@/components/ui/inputs/Checkbox',
      Select: '@/components/ui/inputs/Select',
    },
    icons: {
      Icon: '@/components/ui/icons/Icon',
    },
    modals: {
      Modal: '@/components/ui/modals/Modal',
    },
    decorations: {
      SectionDecorations: '@/components/ui/decorations/SectionDecorations',
    },
  },

  // Feature components
  features: {
    auth: {
      // Auth components will be added here
    },
    catalog: {
      CatalogDownloadModal: '@/components/features/catalog/CatalogDownloadModal',
      CatalogForm: '@/components/features/catalog/CatalogForm',
      CatalogCover: '@/components/features/catalog/CatalogCover',
    },
    product: {
      // Product components will be added here
    },
  },

  // Section components
  sections: {
    home: {
      HeroSection: '@/components/sections/home/HeroSection',
      FeaturesSection: '@/components/sections/home/FeaturesSection',
      ProductsSection: '@/components/sections/home/ProductsSection',
      CatalogSection: '@/components/sections/home/CatalogSection',
      TestimonialsSection: '@/components/sections/home/TestimonialsSection',
      ContactSection: '@/components/sections/home/ContactSection',
    },
    product: {
      // Product section components will be added here
    },
  },

  // Page components
  pages: {
    Home: '@/pages/Home',
    About: '@/pages/About',
    Products: '@/pages/Products',
    Contact: '@/pages/Contact',
  },

  // Utility paths
  utils: {
    validation: '@/utils/validation',
    i18n: '@/utils/i18n',
    analytics: '@/utils/analytics',
    helpers: '@/utils/helpers',
  },

  // Hooks paths
  hooks: {
    //useApi: '@/hooks/useApi',
    useTranslation: '@/hooks/useTranslation',
    useMediaQuery: '@/hooks/useMediaQuery',
    useForm: '@/hooks/useForm',
  },

  // Services paths
  services: {
    api: '@/services/api',
    auth: '@/services/api', // Updated to use new clean API service
    // catalog service removed - functionality simplified
    products: '@/services/productsService',
  },

  // Design system paths
  design: {
    colors: '@/design/colors',
    typography: '@/design/typography',
    spacing: '@/design/spacing',
    breakpoints: '@/design/breakpoints',
  },
};