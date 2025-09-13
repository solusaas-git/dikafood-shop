import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { CardSkeleton } from '../loading';

/**
 * LazySection - A component that lazy loads its children when they come into view
 *
 * Uses the Intersection Observer API to detect when the component enters the viewport,
 * and only then loads and renders the actual component. Before that, it shows a fallback.
 */
const LazySection = ({
  component: Component,
  fallback = <CardSkeleton rows={3} />,
  threshold = 0.1,
  rootMargin = '100px',
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Create an observer instance with custom options
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // When section comes into view
          setIsVisible(true);

          // Disconnect the observer since we no longer need it
          observer.disconnect();
        }
      },
      {
        threshold, // Percentage of the element that needs to be visible
        rootMargin  // Load when element is 100px from viewport
      }
    );

    // Start observing the section element
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  // When isVisible changes to true, set a small timeout before showing the component
  // This prevents jank when the component is large
  useEffect(() => {
    if (isVisible && !isLoaded) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded]);

  return (
    <div ref={sectionRef} className={className}>
      {isLoaded ? <Component {...props} /> : fallback}
    </div>
  );
};

LazySection.propTypes = {
  /** The component to render when the section is visible */
  component: PropTypes.elementType.isRequired,

  /** Fallback UI to show while the section is loading */
  fallback: PropTypes.node,

  /** Intersection threshold (0-1) - percentage of the element visible to trigger loading */
  threshold: PropTypes.number,

  /** Root margin for intersection detection (CSS-like margin string) */
  rootMargin: PropTypes.string,

  /** Additional CSS classes to apply to the container */
  className: PropTypes.string
};

export default LazySection;