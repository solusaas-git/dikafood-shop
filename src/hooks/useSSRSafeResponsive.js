import { useState, useEffect } from 'react';

/**
 * SSR-safe responsive hook that prevents hydration mismatches
 * 
 * @param {number} breakpoint - The breakpoint in pixels (default: 768)
 * @returns {boolean} - True if screen is below breakpoint (mobile)
 */
export function useSSRSafeResponsive(breakpoint = 768) {
  // Start with false to match SSR
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to prevent hydration issues
    setHasMounted(true);
    
    // Set initial mobile state
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < breakpoint);
      }
    };
    
    checkMobile();
    
    // Add resize listener
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [breakpoint]);

  // Return false during SSR and initial render to prevent hydration mismatch
  return hasMounted ? isMobile : false;
}

/**
 * Hook for components that need to render differently on mobile
 * but want to avoid hydration issues by delaying mobile-specific rendering
 * 
 * @param {number} breakpoint - The breakpoint in pixels (default: 768)
 * @returns {{ isMobile: boolean, isReady: boolean }}
 */
export function useDelayedResponsive(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Delay the responsive check to avoid hydration issues
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < breakpoint);
        setIsReady(true);
      }
    }, 0);

    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < breakpoint);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkMobile);
      };
    }

    return () => clearTimeout(timer);
  }, [breakpoint]);

  return { isMobile, isReady };
}

export default useSSRSafeResponsive;
