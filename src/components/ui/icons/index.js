// Base Icon component
export { default as Icon } from './Icon';

// Specialized icon components
export { default as FeedbackIcon } from './FeedbackIcon';
export { default as NavigationIcon } from './NavigationIcon';
export { default as FeatureIcon } from './FeatureIcon';
export { default as ProductIcon } from './ProductIcon';
export { default as FormIcon } from './FormIcon';
export { default as ActionIcon } from './ActionIcon';
export { default as SocialIcon } from './SocialIcon';

// Export the icon registry for direct access if needed
export { iconRegistry, getIcon } from './iconRegistry';

// REMOVED: No longer re-export all Phosphor icons
// export * from '@phosphor-icons/react';