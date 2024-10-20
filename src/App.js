import './App.scss';
import './global.scss';
import './reset.css';
import './classes.scss';
import { BrowserRouter, Route } from 'react-router-dom';
import NavBar from './Sections/NavBar';
import HeroSection from './Sections/HeroSection';
import NewBenefits from './Sections/NewBenefits';
import Marque from './Sections/Marque';
import Reviews from './Sections/Reviews';
import FAQ from './Sections/FAQ';
import Form from './Sections/Form';
import Footer from './Sections/Footer';
import { useState } from 'react';
import Mention from './Components/Mention';
// import { Routes } from "react-router-dom";
// import Product from './Pages/Product';
// import Home from './Pages/Home';

function App() {
  const [isOpenNav, setIsOpenNav] = useState(false);

  const OnOpenNav = () => {
    setIsOpenNav(p => !p)
  }
  const onCloseNav = ()=>{
    setIsOpenNav(false)
  }
  return (
    <BrowserRouter>
      <div className="App">
        {
          isOpenNav &&
          <div className="overLay"></div>
        }
        <NavBar isOpen={isOpenNav} onClick={OnOpenNav} onClose={onCloseNav} />
        <div className='container'>
          <div className="overlay"></div>
          <HeroSection />
        </div>
        <Marque />
        <NewBenefits />
        <Reviews />
        <Form />
        <FAQ />
        <Footer />
        <Mention />
        {/*<Routes>
          <Route path="/" element={
            <Home />
          } />
          <Route path='/boutique' element={
            <>
              <Product />
            </>} />
        </Routes> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
