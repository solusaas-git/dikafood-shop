import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../../sections/home/hero/HeroSection';
import Benefits from '../../sections/home/benefits/Benefits';
import Brands from '../../sections/home/brands/Brands';
import Reviews from '../../sections/home/reviews/Reviews';
import Catalog from '../../sections/home/catalog/Catalog';
import FAQ from '../../sections/home/faq/FAQ';
import Contact from '../../sections/home/contact/Contact';
import Footer from '../../sections/shared/footer/Footer';
// import Copyright from '../../sections/shared/copyright/Copyright';
import { scrollToContactForm } from '../../sections/shared/footer/Footer';

export default function Home() {
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollToContact) {
            scrollToContactForm();
        }
    }, [location.state]);

    return (
        <>
            <Helmet>
                <title>DikaFood - Huiles d'excellence du Maroc</title>
                <meta name="description" content="Découvrez notre gamme d'huiles d'olives et huiles alimentaires de qualité supérieure, produites au Maroc avec des méthodes traditionnelles." />
            </Helmet>

            <main>
                <HeroSection />
                <Brands />
                <Benefits />
                <Reviews />
                <Catalog />
                <FAQ />
                <Contact />
                <Footer />
                {/* <Copyright /> */}
            </main>
        </>
    )
}
