import './product.scss'
import { PiScroll, PiShoppingCart, PiStarFill, PiTagFill } from 'react-icons/pi'

export default function ProductComp({ options }) {
    return (
        <>
            {
                options.map((option, index) => (
                    <a href={`/boutique/product?id=${option.id}`} key={index} className='product-href'>
                        <div className='product'>
                            <div className="img-product">
                                <div className="buttons">
                                    <span>
                                        <PiShoppingCart size={"20px"} color="var(--dark-green-6)" />
                                    </span>
                                    <span>
                                        <PiScroll size={"20px"} color="var(--dark-green-6)" />
                                    </span>
                                </div>
                                <img src={option.productImg} alt="" />
                                <div className="tags">
                                    <div>
                                        <span>
                                            <PiTagFill size={"16px"} color="#AACC00" />
                                        </span>
                                        {option.price}
                                    </div>
                                    <div>
                                        <span>
                                            <PiStarFill size={"16px"} color="#FF8000" />
                                        </span>
                                        {option.rating}
                                    </div>
                                </div>
                            </div>
                            <div className="product-descp">
                                <div className="parag">
                                    <p>
                                        {option.parag}
                                    </p>
                                </div>
                                <button>buy now</button>
                            </div>
                        </div>
                    </a>
                ))
            }
        </>

    )
}
