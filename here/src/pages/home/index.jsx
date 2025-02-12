import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import HeroSection from '../../sections/home/hero/HeroSection';
import Benefits from '../../sections/home/benefits/Benefits';
import Brands from '../../sections/home/brands/Brands';
import Reviews from '../../sections/home/reviews/Reviews';
import Catalog from '../../sections/home/catalog/Catalog';
import FAQ from '../../sections/home/faq/FAQ';
import Contact from '../../sections/home/contact/Contact';
import Footer from '../../sections/shared/footer/Footer';
import Mention from '../../components/ui/Mention';
import { scrollToContactForm } from '../../sections/shared/footer/Footer';

export default function Home() {
    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollToContact) {
            scrollToContactForm();
        }
    }, [location.state]);

    return (
        <main>
            <HeroSection />
            <Brands />
            <Benefits />
            <Reviews />
            <Catalog />
            <FAQ />
            <Contact />
            <Footer />
            <Mention />
        </main>
    )
}
