import "./nav-bar.scss";
import Button from '../Components/Button'
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../assets/menu.svg";
import { House, ShoppingBag, PaperPlaneTilt, DownloadSimple, EnvelopeSimple } from "@phosphor-icons/react";
import logoUrl from "../assets/logo.svg"

export default function NavBar({ onClick, isOpen, onClose }) {
    const [scrolled, setScrolled] = useState(false);
    const homeRef = useRef(null);
    const shopRef = useRef(null);
    const blogRef = useRef(null);
    const homePhoneRef = useRef(null);
    const shopPhoneRef = useRef(null);
    const blogPhoneRef = useRef(null);
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const refs = [
            { desktop: homeRef, mobile: homePhoneRef, path: '/' },
            { desktop: shopRef, mobile: shopPhoneRef, path: '/boutique' },
            { desktop: blogRef, mobile: blogPhoneRef, path: '/blog' }
        ];

        // Remove active class from all refs
        refs.forEach(({ desktop, mobile }) => {
            desktop.current?.classList.remove('active');
            mobile.current?.classList.remove('active');
        });

        // Add active class to current path ref
        const currentRef = refs.find(ref => ref.path === pathname);
        if (currentRef) {
            currentRef.desktop.current?.classList.add('active');
            currentRef.mobile.current?.classList.add('active');
        }
    }, [pathname]);

    // ... other imports

    const navLinks = [
        {
            icon: <House size={20} weight="regular" />, // Reduced from default size
            name: "Accueil",
            path: "/",
            ref: homeRef,
            mobileRef: homePhoneRef
        },
        {
            icon: <ShoppingBag size={20} weight="light" />, // Reduced from default size
            name: "Boutique",
            path: "/boutique",
            ref: shopRef,
            mobileRef: shopPhoneRef
        },
        {
            icon: <PaperPlaneTilt size={20} weight="light" />, // Reduced from default size
            name: "Blog",
            path: "/blog",
            ref: blogRef,
            mobileRef: blogPhoneRef
        }
    ];

    return (
        <div className={`nav-bar-container ${scrolled ? 'scrolled' : ''}`}>
            <div className='nav-bar'>
                <div className='logo'>
                    <a href="/">
                        <img src={logoUrl} alt="Logo" />
                    </a>
                </div>

                <div className='menu'>
                    {navLinks.map((link) => (
                        <Button
                            key={link.path}
                            buttonIcon={link.icon}
                            link={link.path}
                            buttonName={link.name}
                            theme="button-comp-link"
                            size="small"
                            btnRef={link.ref}
                        />
                    ))}
                </div>

                <div className="cta">
                    <Button
                        buttonIcon={<EnvelopeSimple size="24px" weight="light" />}
                        link="#footer"
                        buttonName="contactez nous"
                        theme="button-comp-secondary-white-bg"
                        size="button-comp-small"
                    />
                    <Button
                        buttonIcon={<DownloadSimple size="24px" weight="light" />}
                        link="#form"
                        buttonName="Télécharger le catalogue"
                        theme="button-comp-primary"
                        size="button-comp-small"
                    />
                </div>

                <div className="menu-phone">
                    <span onClick={onClick}>
                        <MenuIcon />
                    </span>
                    <div className={isOpen ? "active" : ""}>
                        <div className='menu'>
                            {navLinks.map((link) => (
                                <Button
                                    key={link.path}
                                    buttonIcon={link.icon}
                                    link={link.path}
                                    buttonName={link.name}
                                    theme="button-comp-link"
                                    size="small"
                                    btnRef={link.mobileRef}
                                />
                            ))}
                        </div>
                        <div className="cta">
                            <Button
                                buttonIcon={<EnvelopeSimple size="24px" weight="light" />}
                                onClick={onClose}
                                link="#footer"
                                buttonName="Contactez nous"
                                theme="button-comp-secondary-white-bg"
                                size="button-comp-small"
                            />
                            <Button
                                buttonIcon={<DownloadSimple size="24px" weight="light" />}
                                onClick={onClose}
                                link="#form"
                                buttonName="Télécharger le catalogue"
                                theme="button-comp-primary"
                                size="button-comp-small"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
