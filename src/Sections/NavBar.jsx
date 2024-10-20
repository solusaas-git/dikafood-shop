import "./nav-bar.scss";
import Button from '../Components/Button'
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../assets/menu.svg";
import { House, ShoppingBag, PaperPlaneTilt, DownloadSimple, EnvelopeSimple } from "@phosphor-icons/react";

export default function NavBar({ onClick, isOpen, onClose }) {
    const homeRef = useRef(null);
    const shopRef = useRef(null);
    const blogRef = useRef(null);
    const homePhoneRef = useRef(null);
    const shopPhoneRef = useRef(null);
    const blogPhoneRef = useRef(null);
    const location = useLocation();
    const pathname = location.pathname;
    useEffect(() => {

        if (homeRef.current) homeRef.current.classList.remove('active');
        if (shopRef.current) shopRef.current.classList.remove('active');
        if (blogRef.current) blogRef.current.classList.remove('active');
        if (homeRef.current) homePhoneRef.current.classList.remove('active');
        if (shopRef.current) shopPhoneRef.current.classList.remove('active');
        if (blogRef.current) blogPhoneRef.current.classList.remove('active');

        switch (pathname) {
            case '/':
                if (homeRef.current) homeRef.current.classList.add('active');
                if (homeRef.current) homePhoneRef.current.classList.add('active');
                break;
            case '/boutique':
                if (shopRef.current) shopRef.current.classList.add('active');
                if (shopRef.current) shopPhoneRef.current.classList.add('active');
                break;
            case '/blog':
                if (blogRef.current) blogRef.current.classList.add('active');
                if (blogRef.current) blogPhoneRef.current.classList.add('active');
                break;
            default:
                break;
        }
    }, [pathname]);
    return (
        <div className="nav-bar-container">
            <div className='nav-bar'>
                <div className='logo'>
                    <a href="/">
                        <span>Dika</span>
                        food
                    </a>
                </div>
                <div className='menu'>
                    <Button
                        buttonIcon={<House weight="light" />}
                        link={"/"}
                        buttonName={"Acceuil"}
                        theme={"button-comp-link"}
                        size={"small"}
                        btnRef={homeRef} />
                    <Button
                        buttonIcon={<ShoppingBag weight="light" />}
                        link={"/boutique"}
                        buttonName={"boutique"}
                        theme={"button-comp-link"}
                        size={"small"}
                        btnRef={shopRef} />
                    <Button
                        buttonIcon={<PaperPlaneTilt weight="light" />}
                        link={"/blog"}
                        buttonName={"Blog"}
                        theme={"button-comp-link"}
                        size={"small"}
                        btnRef={blogRef} />
                </div>
                <div className="cta">
                    <Button buttonIcon={<EnvelopeSimple size={"20px"} weight="light" />} link={"#form"} buttonName={"contactez nous"} theme={"button-comp-secondary-white-bg"} size={"button-comp-small"} />
                    <Button buttonIcon={<DownloadSimple size={"20px"} weight="light" />} buttonName={"télécharger le catalogue"} theme={"button-comp-primary"} size={"button-comp-small"} />
                </div>

                <div className="menu-phone">
                    <span onClick={onClick}>
                        <MenuIcon />
                    </span>
                    <div className={isOpen ? "active" : ""}>
                        <div className='menu'>
                            <Button
                                buttonIcon={<House weight="light" />}
                                link={"/"}
                                buttonName={"Acceuil"}
                                theme={"button-comp-link"}
                                size={"small"}
                                btnRef={homePhoneRef} />
                            <Button
                                buttonIcon={<ShoppingBag weight="light" />}
                                link={"/boutique"}
                                buttonName={"boutique"}
                                theme={"button-comp-link"}
                                size={"small"}
                                btnRef={shopPhoneRef} />
                            <Button
                                buttonIcon={<PaperPlaneTilt weight="light" />}
                                link={"/blog"}
                                buttonName={"Blog"}
                                theme={"button-comp-link"}
                                size={"small"}
                                btnRef={blogPhoneRef} />
                        </div>
                        <div className="cta">
                            <Button
                                buttonIcon={<EnvelopeSimple size={"20px"} weight="light" />}
                                onClick={onClose}
                                link={"#form"}
                                buttonName={"contactez nous"}
                                theme={"button-comp-secondary-white-bg"}
                                size={"button-comp-small"} />
                            <Button
                                buttonIcon={<DownloadSimple size={"20px"} weight="light" />}
                                buttonName={"télécharger le catalogue"}
                                theme={"button-comp-primary"}
                                size={"button-comp-small"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
