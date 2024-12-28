import ProductCard from "../Components/ProductCard"
import "./hero-section.scss"
import { ReactComponent as ArrowIcon } from "../assets/arrow.svg";
import { useState } from "react";
import products from "../data/products.json";

import { ArrowUpRight } from "@phosphor-icons/react"

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(6);
    const plus = () => {
        if (currentIndex < products.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    }
    const minus = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    return (
        <div className="hero-section">
            <div className="header">
                {
                    products.map((p, index) => (
                        <h1
                            className={index === currentIndex ? "active" : ""}
                            key={index}
                        > <span>DikaFood</span> L’excellence des huiles marocaines</h1>
                    ))
                }
            </div>
            <div className="body">
                <div className="product-container">
                    {
                        products.map((product, index) => (
                            <ProductCard
                                onclick={() => setCurrentIndex(index)}
                                key={index}
                                productImg={product.productImg}
                                productName={product.productName}
                                buttonIcon={<ArrowUpRight weight="regular" size={"16px"} />}
                                theme={index === currentIndex ? "" : "static"}
                                style={{ position: "absolute", transform: `translate(${(index - currentIndex) * 100 + (index - currentIndex) * 25}%)`, zIndex: 1 }}
                            />
                        ))
                    }
                </div>
                <div className="arrows">
                    <button className={currentIndex === 0 ? "arrow-left disabled" : "arrow-left"} onClick={minus}><ArrowIcon /></button>
                    <button className={currentIndex === products.length - 1 ? "arrow-right disabled" : "arrow-right"} onClick={plus}><ArrowIcon /></button>
                </div>
            </div>
        </div>
    )
}
