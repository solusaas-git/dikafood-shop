import { useEffect, useState } from "react";
import "./shop-nav-bar.scss"
import { PiChatCircleDots, PiChatCircleDotsFill, PiClipboardText, PiClipboardTextFill, PiGridFour, PiGridFourFill, PiList, PiShoppingCart, PiUser } from 'react-icons/pi'

export default function ShopNavBar({ onOpenBasket, onOpenMenu, onOpenConn, isOpenAccount, isOpenChangeInfo, isOpenChangePass, isOpenConn, isOpenForgetPass, isOpenBasket }) {
    const pathname = window.location.pathname;
    const [isActive, setIsActive] = useState(1);
    useEffect(()=>{
        if(pathname === '/'){
            setIsActive(1)
        }
        else if (pathname === '/orders'){
            setIsActive(2)
        }
        else if (pathname === '/contact'){
            setIsActive(3)
        }
    }, [pathname])
    return (
        <div className='shop-nav-bar'>
            {
                window.visualViewport.width < 430 ?
                    <>
                        <div className="menu-icon-container" onClick={onOpenMenu}>
                            <div className="menu-icon">
                                <PiList size={"24px"} color="var(--dark-green-6)" />
                            </div>
                        </div>
                        <div className="logo">
                            <a href="/">
                                <img src="/images/logo.png" alt="" />
                            </a>
                        </div>
                        <div className="panier" onClick={() => {
                            onOpenBasket();
                        }}>
                            <span>
                                <PiShoppingCart size={"20px"} color="var(--dark-green-6)" />
                            </span>
                        </div>
                    </>
                    :
                    <>
                        <div className="logo">
                            <a href="/">
                                <img src="/images/logo.png" alt="" />
                            </a>
                        </div>
                        <div className="menu-icon-container">
                            <div className="menu-item">
                                <a href="/" className={isActive === 1 ? "active" : ""}>
                                    {
                                        isActive === 1 ?
                                            <PiGridFourFill size={"20px"} />
                                            :
                                            <PiGridFour size={"20px"} />
                                    }
                                    <p>Products</p>
                                </a>
                            </div>
                            <div className="menu-item">
                                <a href="/orders" className={isActive === 2 ? "active" : ""}>
                                    {
                                        isActive === 2 ?
                                            <PiClipboardTextFill size={"20px"} /> :
                                            <PiClipboardText size={"20px"} />
                                    }
                                    <p>Orders</p>
                                </a>
                            </div>
                            <div className="menu-item">
                                <a href="/contact" className={isActive === 3 ? "active" : ""}>
                                    {
                                        isActive === 3 ?
                                            <PiChatCircleDotsFill size={"20px"} /> :
                                            <PiChatCircleDots size={"20px"} />
                                    }
                                    <p>Contact</p>
                                </a>
                            </div>
                        </div>
                        <div className="icons">
                            <div
                                className=
                                {(isOpenConn || isOpenForgetPass ||
                                    isOpenAccount || isOpenChangeInfo ||
                                    isOpenChangePass) ? "user active" : "user"}
                                onClick={onOpenConn}>
                                <span>
                                    <PiUser size={"20px"} />
                                </span>
                                <p>Account</p>
                            </div>
                            <div className={isOpenBasket ? "panier active" : "panier"}
                                onClick={() => onOpenBasket()}>
                                <span>
                                    <PiShoppingCart size={"20px"} />
                                </span>
                                <p>cart</p>
                            </div>
                        </div>
                    </>

            }

        </div>
    )
}
