import React from 'react'
import HeroSection from '../Sections/HeroSection';
import Marque from '../Sections/Marque';
import NewBenefits from '../Sections/NewBenefits';
import Form from '../Sections/Form';
import Reviews from '../Sections/Reviews';
import FAQ from '../Sections/FAQ';
import Footer from '../Sections/Footer';
import Mention from '../Components/Mention';

export default function Home() {
    return (
        <>
            <HeroSection />
            <Marque />
            <NewBenefits />
            <Reviews />
            <Form />
            <FAQ />
            <Footer />
            <Mention />
        </>
    )
}
