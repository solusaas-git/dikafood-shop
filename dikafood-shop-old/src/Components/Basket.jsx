import { PiCheck, PiCheckBold, PiShoppingCart, PiTag, PiX } from "react-icons/pi";
import "./basket.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import BasketCard from "./BasketCard";
import productsInfo from "../data/productsInfo.json"

export default function Basket({ onClose, onOpen }) {
    const [isSelectAll, setIsSelectAll] = useState(true);
    const itemsRef = useRef();
    const [scrollY, setScrollY] = useState(0);
    const [scrollMax, setScrollMax] = useState(1)

    const handleScroll = () => {
        if (itemsRef.current) {
            setScrollY(itemsRef.current.scrollTop);
        }
        if (itemsRef.current) {
            setScrollMax(itemsRef.current.scrollTopMax)
        }

    };

    useEffect(() => {
        const currentRef = itemsRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const [unite, setUnite] = useState([]);
    const [isSelectedProd, setIsSelectedProd] = useState([]);

    useEffect(() => {
        setUnite(productsInfo.map(() => 1))
        setIsSelectedProd(productsInfo.map(() => false))
    }, [])

    const plus = (e, index) => {
        e.stopPropagation()
        setUnite(prev => {
            const newUnite = [...prev]
            newUnite[index] += 1
            return newUnite
        });
    }
    const minus = (e, index) => {
        e.stopPropagation()
        if (unite[index] > 1) {
            setUnite(prev => {
                const newUnite = [...prev]
                newUnite[index] -= 1
                return newUnite
            });
        }
    }

    const onSelectProducts = (index) => {
        setIsSelectedProd((prev) => {
            const newValue = [...prev]
            newValue[index] = !newValue[index]
            return newValue
        })
    }

    useEffect(() => {
        if (isSelectedProd.every(item => item === true)) {
            setIsSelectAll(true)
        }
        else if (isSelectedProd.some(item => item === true)) {
            setIsSelectAll(false)
        }
        else {
            setIsSelectAll(false)
        }
    }, [isSelectedProd])

    const handleSelectAll = useCallback(() => {
        setIsSelectedProd(prevState => {
            const allChecked = prevState.every(item => item === true);
            return prevState.map(() => !allChecked);
        });
    }, [setIsSelectedProd]);

    useEffect(() => {
        handleSelectAll();
    }, [handleSelectAll])



    return (
        <div className="basket">
            <div className="basket-header">
                <div>
                    <span>
                        <PiShoppingCart size={"16px"} color="var(--dark-green-6)" />
                    </span>
                    Cart
                </div>
                <span onClick={onClose}>
                    <PiX size={"16px"} color="var(--dark-green-6)" />
                </span>
            </div>
            <div className="check-items">
                <div className="container">
                    <div>
                        <div className={isSelectAll ? "checkbox active" : "checkbox"}
                            onClick={handleSelectAll}>
                            <PiCheckBold size={"14px"} color={isSelectAll ? "#fff" :"#e6e6e6"} />
                        </div>
                        Select All
                    </div>
                    <p>{productsInfo.length} items</p>
                </div>
            </div>
            <div className="items-container">
                {
                    scrollY !== 0 &&
                    <div className="top-overlay"></div>
                }
                <div className="items" ref={itemsRef}>
                    <BasketCard
                        options={productsInfo}
                        unite={unite}
                        onSelectProducts={onSelectProducts}
                        minus={minus}
                        plus={plus}
                        isSelectedProd={isSelectedProd}
                    />
                </div>
                {
                    scrollY !== scrollMax
                    &&
                    <div className="bottom-overlay"></div>
                }
            </div>
            <div className="basket-info">
                <div>
                    <div>
                        <p className="first-p">
                            <span>
                                <PiCheck size={"10px"} color="var(--dark-green-6)" />
                            </span>
                            Selected
                        </p>
                        <p className="last-p">
                            {isSelectedProd.filter(p => p === true).length} items
                        </p>
                    </div>
                    <div>
                        <p className="first-p">
                            <span>
                                <PiTag size={"16px"} color="var(--dark-green-6)" />
                            </span>
                            Subtotal price
                        </p>
                        <p className="last-p">
                            $136
                        </p>
                    </div>
                </div>
                <button onClick={onOpen}>checkout</button>
            </div>
        </div>
    )
}
