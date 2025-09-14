'use client'

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@components/ui/layout/Header';
import Footer from '@components/ui/layout/Footer';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * MainLayout component
 * Provides the main application layout with header and footer
 * Conditionally hides footer on checkout pages for better UX
 */
const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const { hideLoading } = useLoading();
  
  // Hide loading when page changes (cleanup)
  useEffect(() => {
    let timer;
    
    const hideLoadingWhenReady = () => {
      // Wait for DOM to be ready and a minimum display time
      const minDisplayTime = 600; // Minimum 600ms display time
      const startTime = Date.now();
      
      const checkAndHide = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        timer = setTimeout(() => {
          hideLoading();
        }, remainingTime);
      };
      
      // If document is already loaded, hide after minimum time
      if (document.readyState === 'complete') {
        checkAndHide();
      } else {
        // Wait for page to load, then check
        const handleLoad = () => {
          checkAndHide();
          window.removeEventListener('load', handleLoad);
        };
        window.addEventListener('load', handleLoad);
      }
    };
    
    // Small delay to let the navigation start
    const initialTimer = setTimeout(hideLoadingWhenReady, 100);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(initialTimer);
    };
  }, [pathname, hideLoading]);
  
  // Hide footer on checkout pages to minimize distractions
  const shouldHideFooter = pathname?.startsWith('/checkout');

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="relative z-0 -mt-20 md:-mt-24">
        {children}
      </main>

      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;