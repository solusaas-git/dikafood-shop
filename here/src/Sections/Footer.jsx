import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import "./footer.scss"

// Components
import Button from "../Components/Button"
import Field from "../Components/Field"
import MessageField from "../Components/MessageField"

// Icons
import { 
    House, 
    ShoppingBag, 
    Article, 
    EnvelopeSimple, 
    At, 
    Phone, 
    MapPin, 
    User,
    ChatCircleText
} from "@phosphor-icons/react"

// Logo
import { ReactComponent as Logo } from "../assets/dikafood-logo-dark.svg"

const LogoComponent = () => (
    <div className='logo'>
        <Logo aria-label="DikaFood Logo" />
        <span className="logo-fallback">
            <span className="logo-text">DikaFood</span>
            <span className="logo-underline"></span>
        </span>
    </div>
)

export default function Footer() {
    // Navigation state management
    const location = useLocation()
    const homeRef = useRef(null)
    const shopRef = useRef(null)
    const blogRef = useRef(null)

    // Handle active navigation state
    useEffect(() => {
        const refs = [homeRef, shopRef, blogRef]
        refs.forEach(ref => ref.current?.classList.remove('active'))

        switch (location.pathname) {
            case '/':
                homeRef.current?.classList.add('active')
                break
            case '/boutique':
                shopRef.current?.classList.add('active')
                break
            case '/blog':
                blogRef.current?.classList.add('active')
                break
            default:
                break
        }
    }, [location.pathname])

    // Navigation links configuration
    const navLinks = [
        { ref: homeRef, path: "/", icon: <House weight="duotone" />, label: "Accueil" },
        { ref: shopRef, path: "/boutique", icon: <ShoppingBag weight="duotone" />, label: "Boutique" },
        { ref: blogRef, path: "/blog", icon: <Article weight="duotone" />, label: "Blog" }
    ]

    // Contact information configuration
    const contactInfo = [
        { icon: <EnvelopeSimple weight="duotone" />, href: "mailto:contact@dikafood.com", text: "Contact@dikafood.com" },
        { icon: <Phone weight="duotone" />, href: "tel:+212661373204", text: "+212 (661) 37 32 04" },
        { icon: <Phone weight="duotone" />, href: "tel:+212535942682", text: "+212 (535) 94 26 82" },
        { 
            icon: <MapPin weight="duotone" />, 
            href: "https://maps.app.goo.gl/mJRgbWpwp2ZVFtnx8", 
            text: "18 Rue Zenata Quartier Industriel Dokkarat, Fes, Maroc" 
        }
    ]

    return (
        <footer className="footer-container">
            <div className="footer">
                <div className="section-header">
                    <div className="title-container">
                        <div className="title-content">
                            <div className="title-wrapper">
                                <ChatCircleText 
                                    size={48} 
                                    weight="duotone" 
                                    className="title-icon"
                                />
                                <h2>Contactez-nous</h2>
                            </div>
                            <p>Nous sommes là pour vous aider</p>
                        </div>
                    </div>
                </div>

                <div className="footer-body">
                    {/* Left Section: Logo, Description, Navigation */}
                    <div className="footer-left">
                        <div>
                            <LogoComponent />
                            <p>
                                Nous vous proposons une sélection d'huiles d'exception issues des meilleures 
                                plantations du Maroc. Que vous soyez amateur d'huile d'olive ou à la recherche 
                                d'une huile de tournesol pure, DikaFood est votre partenaire de confiance pour 
                                des produits de qualité supérieure.
                            </p>
                        </div>
                        
                        {/* Navigation Menu */}
                        <nav className="menu">
                            {navLinks.map(({ ref, path, icon, label }) => (
                                <Button
                                    key={path}
                                    link={path}
                                    buttonIcon={icon}
                                    buttonName={label}
                                    theme="button-comp-link"
                                    size="small"
                                    btnRef={ref}
                                />
                            ))}
                        </nav>
                    </div>

                    {/* Contact Information */}
                    <ul className="other-info">
                        {contactInfo.map(({ icon, href, text }) => (
                            <li key={href}>
                                <span>{icon}</span>
                                <a href={href}>{text}</a>
                            </li>
                        ))}
                    </ul>

                    {/* Contact Form */}
                    <form>
                        <Field 
                            placeholder="Prénom" 
                            inputName="prénom" 
                            Icon={<User weight="duotone" />} 
                        />
                        <Field 
                            placeholder="Nom" 
                            inputName="nom" 
                            Icon={<User weight="duotone" />} 
                        />
                        <Field 
                            placeholder="Adresse mail" 
                            inputName="email" 
                            Icon={<At weight="duotone" />} 
                        />
                        <MessageField 
                            placeholder="Message" 
                            inputName="message" 
                            icon={<EnvelopeSimple weight="duotone" />} 
                            btnName="Envoyer" 
                        />
                    </form>
                </div>
            </div>
        </footer>
    )
}
