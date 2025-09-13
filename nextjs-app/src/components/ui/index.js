// Import all UI component categories
import * as Icons from './icons';
import * as DataDisplay from './data-display';
import * as Feedback from './feedback';
import * as Inputs from './inputs';
import * as Layout from './layout';
import * as Loading from './loading';
import * as Navigation from './navigation';
import * as Media from './media';
import * as Typography from './typography';
import * as Shadcn from './shadcn';

// Import product components
import ProductCard, {
  FeaturedProductCard,
  ShopProductCard,
  CompactProductCard
} from './product/ProductCard';

import HeroProductCard from './product/HeroProductCard';

import ProductCardSkeleton, {
  FeaturedProductCardSkeleton,
  ShopProductCardSkeleton,
  HeroProductCardSkeleton,
  CompactProductCardSkeleton
} from './product/ProductCardSkeleton';

// Export individual components for easy access
export const {
  Icon,
  FeatureIcon,
  FormIcon,
  NavigationIcon,
  ProductIcon,
  ActionIcon,
  FeedbackIcon,
  SocialIcon
} = Icons;

export const {
  Card,
  Badge,
  Carousel
} = DataDisplay;

export const {
  Alert,
  Modal,
  Toast
} = Feedback;

export const {
  Button,
  TextField
} = Inputs;

export const {
  Section,
  Grid,
  SectionHeader
} = Layout;

export const {
  LoadingSpinner,
  Skeleton,
  TextSkeleton,
  CardSkeleton
} = Loading;

export const {
  Breadcrumb,
  LanguageSwitcher,
  Tabs
} = Navigation;

export const {
  OptimizedImage
} = Media;

export const {
  ArabicText,
  ArabicHeading
} = Typography;

// Export product card components
export {
  ProductCard,
  FeaturedProductCard,
  ShopProductCard,
  HeroProductCard,
  CompactProductCard,
  ProductCardSkeleton,
  FeaturedProductCardSkeleton,
  ShopProductCardSkeleton,
  HeroProductCardSkeleton,
  CompactProductCardSkeleton
};

// Export all categorized components
export {
  Icons,
  DataDisplay,
  Feedback,
  Inputs,
  Layout,
  Loading,
  Navigation,
  Media,
  Typography,
  Shadcn
};