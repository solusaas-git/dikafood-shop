import { ArrowUpRight, Drop, Tag } from "@phosphor-icons/react"
import "./product-card.scss"

export default function ProductCard({ 
    productName, 
    productImg, 
    productVolume,
    productPrice,
    theme, 
    style, 
    onclick 
}) {
    const classList = ["product-card", theme];
    return (
        <div className={classList.join(" ")} style={style} onClick={onclick}>
            <div className="img-product">
                <img src={productImg} alt={productName} />
                <span className="volume-badge">
                    <Drop size={18} weight="duotone" />
                    {productVolume}
                </span>
            </div>
            <div className="product-card-content">
                <h3 className="product-name">{productName}</h3>
                <p className="product-type">Huile d'Olive Extra Vièrge</p>
            </div>
            <div className="product-link">
                <div className="product-price">
                    <Tag size={22} weight="duotone" />
                    {productPrice}
                </div>
                <ArrowUpRight size={24} weight="bold" />
            </div>
        </div>
    )
}
