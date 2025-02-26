import './App.scss';
import './global.scss';
import './reset.css';
import './classes.scss';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './sections/shared/navbar/NavBar';
import { useState, useEffect } from 'react';
import FloatingButtons from './components/ui/floating-buttons/FloatingButtons';
import LanguageSwitcher from './components/ui/language-switcher/LanguageSwitcher';
import { HelmetProvider } from 'react-helmet-async';

// Create a wrapper component to handle scroll restoration
function ScrollToTop() {
    const location = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
    
    return null;
}

function App() {
    const [isOpenNav, setIsOpenNav] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const handleNavToggle = () => {
        setIsOpenNav(prev => !prev);
    };

    const handleNavClose = () => {
        setIsOpenNav(false);
    };

    // Add scroll listener
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <HelmetProvider>
            <ScrollToTop />
            <div className={`App ${isScrolled ? 'scrolled' : ''}`}>
                {isOpenNav && (
                    <div 
                        className="overlay" 
                        onClick={handleNavClose}
                        role="presentation"
                    />
                )}
                
                <div className="nav-wrapper">
                    <NavBar 
                        isOpen={isOpenNav} 
                        onClick={handleNavToggle} 
                        onClose={handleNavClose} 
                    />
                </div>

                <Outlet />

                <FloatingButtons />
                <LanguageSwitcher />
            </div>
        </HelmetProvider>
    );
}

export default App;
