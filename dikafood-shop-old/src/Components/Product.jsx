import './product.scss'
import { PiShoppingCart, PiStarFill, PiTagFill } from 'react-icons/pi'

export default function ProductComp({ options }) {
    return (
        <>
            {
                options.map((option, index) => (
                    <a href={`/boutique/product?id=${option.id}`} key={index} className='product-href'>
                        <div className='product'>
                            <div className="img-product">
                                <img src={option.images[0]} alt="" />
                                <div className="tags">
                                    <div>
                                        <span>
                                            <PiTagFill size={"18px"} color="#AACC00" />
                                        </span>
                                        {option.price}
                                    </div>
                                    <div>
                                        <span>
                                            <PiStarFill size={"18px"} color="#FF8000" />
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
                                <div className="buttons">
                                    <span>
                                        <PiShoppingCart size={"24px"} color="var(--dark-green-8)" />
                                    </span>
                                    <button>buy now</button>
                                </div>
                            </div>
                        </div>
                    </a>
                ))
            }
        </>

    )
}
