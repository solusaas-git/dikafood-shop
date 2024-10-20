import Button from "./Button"
import "./product-card.scss"

export default function ProductCard({ productName, productImg, theme, style, buttonIcon }) {
    const classList = ["product-card", theme];
    return (
        <div className={classList.join(" ")} style={style}>
            <div className="img-product">
                <img src={productImg} alt="chourouk 1L" />
            </div>
            <div className="product-card-footer">
                <div className="product-card-text"><span>{productName}</span> Huile d’Olive Extra Vièrge</div>
            </div>
            <div className="product-link">
                <Button buttonIcon={buttonIcon} buttonName={"voir ce produit"} theme={"button-comp-link"} size={"small"} />
            </div>
        </div>
    )
}
