import './App.scss';
import './global.scss';
import './reset.css';
import './classes.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './Sections/NavBar';
import Home from './Pages/Home';
import { useState } from 'react';

function App() {
  const [isOpenNav, setIsOpenNav] = useState(false);

  const handleNavToggle = () => {
    setIsOpenNav(prev => !prev);
  };

  const handleNavClose = () => {
    setIsOpenNav(false);
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <div className="App">
        {isOpenNav && <div className="overLay" onClick={handleNavClose} />}
        
        <NavBar 
          isOpen={isOpenNav} 
          onClick={handleNavToggle} 
          onClose={handleNavClose} 
        />

        <Routes>
          <Route path="/" element={<Home />} />
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
