import { useState, useEffect } from 'react';

const BREAKPOINTS = {
    mobileSm: 375,
    mobile: 430,
    tablet: 768,
    laptop: 1024,
    desktop: 1440
};

export function useBreakpoint(customBreakpoint) {
    const [state, setState] = useState({
        isMobile: false,
        isTablet: false,
        isLaptop: false,
        width: 0
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setState({
                isMobile: width <= BREAKPOINTS.mobile,
                isTablet: width <= BREAKPOINTS.tablet,
                isLaptop: width <= BREAKPOINTS.laptop,
                width: width
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Support legacy usage
    if (customBreakpoint) {
        return {
            isMobile: state.width <= customBreakpoint,
            width: state.width
        };
    }

    return state;
} 