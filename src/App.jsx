import './App.scss';
import './global.scss';
import './reset.css';
import './classes.scss';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './sections/shared/navbar/NavBar';
import { useState, useEffect } from 'react';
import FloatingButtons from './components/ui/floating-buttons/FloatingButtons';

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
    const location = useLocation();
    const navigate = useNavigate();

    // Check if current route is blog or legal pages
    const hideNavigation = location.pathname.startsWith('/blog') ||
                          location.pathname === '/terms' ||
                          location.pathname === '/privacy';

    // Check if current route is shop or product detail page
    const isShopOrProductPage = location.pathname === '/shop' ||
                                location.pathname.includes('/product/');

    const handleNavToggle = () => {
        setIsOpenNav(prev => !prev);
    };

    const handleNavClose = () => {
        setIsOpenNav(false);
    };

    // Close mobile menu when navigating between routes
    useEffect(() => {
        handleNavClose();
    }, [location.pathname]);

    // Add scroll listener
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle any scrollToContact state passed during navigation
    useEffect(() => {
        if (location.state && location.state.scrollToContact) {
            // Clear the state to avoid scrolling on refresh
            window.history.replaceState({}, document.title);

            // Wait for page content to load
            setTimeout(() => {
                const contactForm = document.querySelector('#contact-form');
                if (contactForm) {
                    contactForm.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        }
    }, [location.state]);

    return (
        <>
            <ScrollToTop />
            <div className={`App ${isScrolled ? 'scrolled' : ''}`}>
                {!hideNavigation && (
                    <>
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

                        {/* Only show floating buttons if not on shop or product detail page */}
                        {!isShopOrProductPage && <FloatingButtons />}
                    </>
                )}

                <Outlet />
            </div>
        </>
    );
}

export default App;
