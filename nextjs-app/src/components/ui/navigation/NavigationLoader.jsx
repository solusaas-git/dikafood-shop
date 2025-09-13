import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * NavigationLoader component that handles loading states during navigation
 * This component should be placed in the root layout
 */
const NavigationLoader = () => {
  const pathname = usePathname();
  const { showLoading, hideLoading } = useLoading();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    // Only show loading if pathname actually changed
    if (previousPathname.current !== pathname) {
      console.log('Navigation detected:', previousPathname.current, '->', pathname);
      
      // Show loading when pathname changes
      showLoading('Chargement de la page...');
      
      // Hide loading after a longer delay to ensure it's visible
      const timer = setTimeout(() => {
        hideLoading();
      }, 800); // Longer delay to make it more visible

      // Update the previous pathname
      previousPathname.current = pathname;

      return () => {
        clearTimeout(timer);
      };
    }
  }, [pathname, showLoading, hideLoading]);

  return null; // This component doesn't render anything
};

export default NavigationLoader;
