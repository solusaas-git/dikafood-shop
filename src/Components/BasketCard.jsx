import "./basket-card.scss";
import { ReactComponent as CheckIcon } from "../assets/check.svg"
import { useState } from "react";

export default function BasketCard() {
    const [isActive, setIsActive] = useState(false);
    const onClick = () => {
        setIsActive(!isActive);
    }
    const [unite, setUnite] = useState(1);
    const plus = () => {
        setUnite(unite + 1);
    }
    const minus = () => {
        if (unite > 1) {
            setUnite(unite - 1);
        }
    }
    return (
        <div className={isActive ? "basket-card active" : "basket-card"}>
            <CheckIcon className="check-icon" onClick={onClick} />
            <div className="img-product" onClick={onClick}>
                <img src="/images/chourouk-1L.png" alt="" />
            </div>
            <div className="info-product">
                <div onClick={onClick}>
                    <h5>Ouad Fes Huile D’olive</h5>
                    <p>Extra Vièrge</p>
                </div>
                <div>
                    <button>
                        <span>
                            {unite}
                        </span>
                        unités
                        <button onClick={plus} className="plus">+</button>
                        <button disabled={unite === 1} onClick={minus} className="minus">-</button>
                    </button>
                    <p onClick={onClick}><span>140</span> MAD</p>
                </div>
            </div>
        </div>
    )
}
