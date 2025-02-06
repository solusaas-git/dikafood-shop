import Button from "../Components/Button"
import Field from "../Components/Field"
import { ReactComponent as Logo } from "../assets/dikafood-logo-dark.svg";
import MessageField from "../Components/MessageField"
import "./footer.scss"
import { ReactComponent as HomeIcon } from "../assets/house.svg"
import { ReactComponent as ShopIcon } from "../assets/shop.svg"
import { ReactComponent as BlogIcon } from "../assets/blog.svg"
import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"


import { EnvelopeSimple, At, Phone, MapPin, User } from "@phosphor-icons/react"

export default function Footer() {
    const homeRef1 = useRef(null);
    const shopRef1 = useRef(null);
    const blogRef1 = useRef(null);
    const location = useLocation();
    const pathname = location.pathname;
    useEffect(() => {

        if (homeRef1.current) homeRef1.current.classList.remove('active');
        if (shopRef1.current) shopRef1.current.classList.remove('active');
        if (blogRef1.current) blogRef1.current.classList.remove('active');

        switch (pathname) {
            case '/':
                if (homeRef1.current) homeRef1.current.classList.add('active');
                break;
            case '/boutique':
                if (shopRef1.current) shopRef1.current.classList.add('active');
                break;
            case '/blog':
                if (blogRef1.current) blogRef1.current.classList.add('active');
                break;
            default:
                break;
        }
    }, [pathname]);
    return (
        <div className="footer-container">
            <div className="footer" id="footer">
                <div className="footer-body">
                    <div className="footer-left">
                        <div>
                            <div className='logo'>
                                <Logo />
                            </div>
                            <p>
                            Nous vous proposons une sélection d’huiles d’exception issues des meilleures plantations du Maroc. Que vous soyez amateur d’huile d’olive ou à la recherche d’une huile de tournesol pure, DikaFood est votre partenaire de confiance pour des produits de qualité supérieure.
                                
                            </p>
                        </div>
                        <div className='menu'>
                            <Button
                                link={"/"}
                                buttonIcon={<HomeIcon />}
                                buttonName={"Accueil"}
                                theme={"button-comp-link"}
                                size={"small"}
                                btnRef={homeRef1} />
                            <Button
                                buttonIcon={<ShopIcon />}
                                link={"/boutique"}
                                buttonName={"Boutique"}
                                theme={"button-comp-link"}
                                size={"small"}
                                btnRef={shopRef1} />
                            <Button
                                buttonIcon={<BlogIcon />}
                                link={"/blog"}
                                buttonName={"Blog"}
                                theme={"button-comp-link"}
                                size={"small"}
                                btnRef={blogRef1} />
                        </div>
                    </div>
                    <ul className="other-info">
                        <li>
                            <span><EnvelopeSimple color="var(--dark-green-7)" /></span>
                            <a href="mailto:contact@dikafood.com">
                                Contact@dikafood.com
                            </a>
                        </li>
                        <li>
                            <span><Phone color="var(--dark-green-7)" /></span>
                            <a href="tel:+212661373204">
                                +212 (661) 37 32 04
                            </a>
                        </li>
                        <li>
                            <span><Phone color="var(--dark-green-7)" /></span>
                            <a href="tel:+212535942682">
                                +212 (535) 94 26 82
                            </a>
                        </li>
                        <li>
                            <span><MapPin color="var(--dark-green-7)" /></span>
                            <a href="https://maps.app.goo.gl/mJRgbWpwp2ZVFtnx8">
                                18 Rue Zenata Quartier Industriel Dokkarat<br/>
                                Fes, Maroc
                            </a>
                        </li>
                        
                    </ul>
                    <form action="">
                        <Field placeholder={"prénom"} inputName={"prénom"} Icon={<User color="var(--dark-green-7)" />} />
                        <Field placeholder={"Nom"} inputName={"nom"} Icon={<User color="var(--dark-green-7)" />} />
                        <Field placeholder={"Adresse mail"} inputName={"email"} Icon={<At color="var(--dark-green-7)" />} />
                        <MessageField placeholder={"Message"} inputName={"message"} icon={<EnvelopeSimple color="var(--dark-green-7)" />} btnName={"Envoyer"} />
                    </form>
                </div>
            </div>
        </div>
    )
}
