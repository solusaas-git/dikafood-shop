import './App.scss';
import './global.scss';
import './reset.css';
import './classes.scss';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './sections/shared/navbar/NavBar';
import Home from './pages/home';
import { useState, useEffect } from 'react';
import CatalogPage from './pages/catalog';

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
            <div className="App">
                {isOpenNav && <div className="overlay" onClick={handleNavClose} />}
                
                <div className={`nav-wrapper ${isScrolled ? 'scrolled' : ''}`}>
                    <NavBar 
                        isOpen={isOpenNav} 
                        onClick={handleNavToggle} 
                        onClose={handleNavClose} 
                    />
                </div>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route 
                        path="/blog" 
                        element={<div className="title-large not-yet">En construction</div>} 
                    />
                    <Route 
                        path="/boutique" 
                        element={<div className="title-large not-yet">En construction</div>} 
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
