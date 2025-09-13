import { useState, useEffect } from 'react';

/**
 * Hook that returns true if the media query matches
 * @param {string} query - Media query string
 * @returns {boolean} - True if media query matches
 */
export function useMediaQuery(query) {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    // Set initial value once we're on the client
    setMatches(window.matchMedia(query).matches);

    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Define listener
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}