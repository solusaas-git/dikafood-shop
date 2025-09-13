import { useState, useEffect } from 'react';

/**
 * Breakpoints in pixels
 * Matching Tailwind's default breakpoints
 */
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Hook for detecting current breakpoint and related device sizes
 *
 * @returns {Object} Breakpoint state object with properties for each breakpoint and device type
 */
export function useBreakpoint() {
  // Initialize state with an object containing all breakpoints
  const [breakpoint, setBreakpoint] = useState({
    isXs: false,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2xl: false,
    // Semantic aliases
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isWideDesktop: false,
    // Current active breakpoint
    current: 'xs',
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  });

  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;

    // Update breakpoint state based on window width
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      const newBreakpoint = {
        isXs: width >= breakpoints.xs && width < breakpoints.sm,
        isSm: width >= breakpoints.sm && width < breakpoints.md,
        isMd: width >= breakpoints.md && width < breakpoints.lg,
        isLg: width >= breakpoints.lg && width < breakpoints.xl,
        isXl: width >= breakpoints.xl && width < breakpoints['2xl'],
        is2xl: width >= breakpoints['2xl'],
        width: width,
      };

      // Determine current breakpoint
      let current = 'xs';
      if (width >= breakpoints['2xl']) current = '2xl';
      else if (width >= breakpoints.xl) current = 'xl';
      else if (width >= breakpoints.lg) current = 'lg';
      else if (width >= breakpoints.md) current = 'md';
      else if (width >= breakpoints.sm) current = 'sm';

      // Add semantic aliases
      newBreakpoint.current = current;
      newBreakpoint.isMobile = width < breakpoints.md;
      newBreakpoint.isTablet = width >= breakpoints.md && width < breakpoints.lg;
      newBreakpoint.isDesktop = width >= breakpoints.lg;
      newBreakpoint.isWideDesktop = width >= breakpoints.xl;

      setBreakpoint(newBreakpoint);
    };

    // Initial call
    updateBreakpoint();

    // Add event listener for resize
    window.addEventListener('resize', updateBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

export default useBreakpoint;