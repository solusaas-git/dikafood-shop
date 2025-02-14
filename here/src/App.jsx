import './App.scss';
import './global.scss';
import './reset.css';
import './classes.scss';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './sections/shared/navbar/NavBar';
import Home from './pages/home';
import { useState, useEffect } from 'react';
import CatalogPage from './pages/catalog';
import About from './pages/about/About';
import History from './pages/history/History';
import Values from './pages/values/Values';
import Blog from './pages/blog/Blog';
import FloatingButtons from './components/ui/floating-buttons/FloatingButtons';
import Shop from './pages/shop/Shop';
import LanguageSwitcher from './components/ui/language-switcher/LanguageSwitcher';

// Import i18n configuration
import './i18n/config';

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
        <Router>
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

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/values" element={<Values />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/boutique" element={<Shop />} />
                </Routes>

                <FloatingButtons />
                <LanguageSwitcher />
            </div>
        </Router>
    );
}

export default App;
