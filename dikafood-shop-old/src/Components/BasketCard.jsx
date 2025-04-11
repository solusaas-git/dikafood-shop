import { PiCheckBold, PiMinus, PiPlus, PiTag, PiTrash } from "react-icons/pi";
import "./basket-card.scss";


export default function BasketCard({ options, unite, isSelectedProd, minus, plus, onSelectProducts }) {

    return (
        <>
            {
                options.map((option, index) => (
                    <div className={isSelectedProd[index] ? "basket-card active" : "basket-card"}
                        onClick={() => onSelectProducts(index)}
                        key={index}
                    >
                        <div className="product-img">
                            <span>
                                <PiTrash size={"20px"} color="var(--dark-green-6)" />
                            </span>
                            <img src={option.images[0]} alt="" />
                        </div>
                        <div className="product-info">
                            <div className="parag">
                                <p>{option.parag}</p>
                            </div>
                            <span>
                                <PiCheckBold size={"14px"} color={isSelectedProd[index] ? "white" : "#E6E6E6"} />
                            </span>
                            <div className="pricing">
                                <div className="price">
                                    <span>
                                        <PiTag size={"14px"} color="var(--dark-green-6)" />
                                    </span>
                                    <p>{option.price}</p>
                                </div>
                                <div className="unite">
                                    <span onClick={(e) => minus(e, index)}>
                                        <PiMinus size={"14px"} color="var(--dark-green-6)" />
                                    </span>
                                    <p>
                                        {unite[index]}
                                    </p>
                                    <span onClick={(e) => plus(e, index)}>
                                        <PiPlus size={"14px"} color="var(--dark-green-6)" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>

    )
}
