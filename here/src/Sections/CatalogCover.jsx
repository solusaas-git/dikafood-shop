import { memo } from 'react';
import { Leaf } from "@phosphor-icons/react";
import "./catalog-cover.scss";
import logoUrl from "../assets/dikafood-logo-main-3.svg";
// Import product images
import productImage1 from "../../images/products/dika-5L.png";
import productImage2 from "../../images/products/dika-500ML.png";
import productImage3 from "../../images/products/chourouk-1L.png";
import productImage4 from "../../images/products/chourouk-10L.png";
import productImage5 from "../../images/products/nouarti-1L.png";
import productImage6 from "../../images/products/nouarti-2L.png";
import productImage7 from "../../images/products/nouarti-5L.png";
import productImage8 from "../../images/products/chourouk-25L.png";

const CatalogCover = memo(() => {
    return (
        <section className="catalog-cover-section hover-trigger">
            <div className="background-pattern">
                {Array.from({ length: 20 }).map((_, index) => (
                    <Leaf 
                        key={index}
                        size={96 + (index % 3) * 12} // Sizes: 96, 108, 120
                        weight="duotone"
                        className={`leaf-icon leaf-${index + 1} ${index % 2 === 0 ? 'primary' : 'secondary'}`}
                    />
                ))}
            </div>
            <div className="catalog-cover-container">
                <div className="cover-content">
                    <div className="brand-area">
                        <img src={logoUrl} alt="Logo" className="brand-logo" />
                    </div>

                    <div className="title-area">
                        <span className="year">2024</span>
                        <h2 className="catalog-title">
                            Collection<br />
                            <span className="highlight">Premium</span>
                        </h2>
                        <p className="subtitle">Huiles d'Olive d'Exception</p>
                    </div>

                    <div className="product-image">
                        <div className="product-team">
                            <div className="product-row">
                                <img src={productImage8} alt="Chourouk 25L" className="product" />
                                <img src={productImage4} alt="Chourouk 10L" className="product" />
                                <img src={productImage3} alt="Chourouk 1L" className="product" />
                                <img src={productImage2} alt="Dika 500ML" className="product" />
                                <img src={productImage1} alt="Dika 5L" className="product" />
                                <img src={productImage5} alt="nouarti 1L" className="product" />
                                <img src={productImage6} alt="nouarti 2L" className="product" />
                                <img src={productImage7} alt="Ouedfes 1L" className="product" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

CatalogCover.displayName = 'CatalogCover';

export default CatalogCover; 