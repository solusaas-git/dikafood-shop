import './App.scss';
import './global.scss';
import './reset.css';
import './classes.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './Sections/NavBar';
import Home from './Pages/Home';
import { useState, useEffect } from 'react';
import CatalogPage from './Pages/CatalogPage';

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
        <BrowserRouter future={{ v7_startTransition: true }}>
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
                    <Route path="/catalogue" element={<CatalogPage />} />
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
        </BrowserRouter>
    );
}

export default App;
