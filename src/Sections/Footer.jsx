import Button from "../Components/Button"
import Field from "../Components/Field"
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
            <div className="footer">
                <div className="footer-body">
                    <div className="footer-left">
                        <div>
                            <div className='logo'>
                                <span>Dika</span>
                                food
                            </div>
                            <p>
                                Je suis impressionné par la qualité de l'huile gridnon
                                d'olive Chourouk. Elle ajoute une profondeur unique à mes plats.
                                Je suis impressionné par la qualité de l'huile gridnon d'olive Chourouk.
                                
                            </p>
                        </div>
                        <div className='menu'>
                            <Button
                                link={"/"}
                                buttonIcon={<HomeIcon />}
                                buttonName={"Acceuil"}
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
                            <a href="/">
                                contact@dikafood.com
                            </a>
                        </li>
                        <li>
                            <span><Phone color="var(--dark-green-7)" /></span>
                            <a href="/">
                                +1 (923) 602-8348
                            </a>
                        </li>
                        <li>
                            <span><Phone color="var(--dark-green-7)" /></span>
                            <a href="/">
                                +1 (923) 602-8348
                            </a>
                        </li>
                        <li>
                            <span><MapPin color="var(--dark-green-7)" /></span>
                            <a href="/">
                                Ouad Fez, Avenue Example, Rue Exemple, Fes, Maroc
                            </a>
                        </li>
                        <li>
                            <span><MapPin color="var(--dark-green-7)" /></span>
                            <a href="/">
                                Ouad Fez, Avenue Example, Rue Exemple, Fes, Maroc
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
