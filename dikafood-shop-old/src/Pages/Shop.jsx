import "./shop.scss"
import InputSearch from "../Components/InputSearch"
import ProductComp from "../Components/Product"
import productsInfo from "../data/productsInfo.json"
import { useEffect, useRef, useState } from "react"
import Filter from "../Components/Filter"
import { PiArrowLeft, PiArrowRight, PiSticker } from "react-icons/pi"


export default function Shop(
    { onOpen, onClose, isOpenFilter }
) {
    const productsRef = useRef();
    const [scrollY, setScrollY] = useState(0);
    const [scrollMax, setScrollMax] = useState(1)

    const handleScroll = () => {
        if (productsRef.current) {
            setScrollY(productsRef.current.scrollTop);
        }
        if (productsRef.current) {
            setScrollMax(productsRef.current.scrollTopMax)
        }
    };

    useEffect(() => {
        const currentRef = productsRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const categories = ["All", "olive oil", 'category 1', "category 2"]
    const [currentCateg, setCurrentCateg] = useState(0);
    return (
        <div className='shop'>
            <div className="categories-container">
                <div className="categories">
                    {
                        categories.map((categ, index) => (
                            <div className={currentCateg === index ? 'category active' :"category"} key={index} onClick={()=>{setCurrentCateg(index)}}>
                                {categ}
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="container">
                <div className="sub-nav">
                    <InputSearch onOpen={onOpen} isOpenFilter={isOpenFilter} />
                    <div className="pagination">
                        <p>1 / 1 <span><PiSticker size={"16px"} /></span></p>
                        <div>
                            <span className="left">
                                <PiArrowLeft />
                            </span>
                            <span className="right">
                                <PiArrowRight />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="page-container">
                    {
                        isOpenFilter
                        &&
                        (window.visualViewport.width > 430)
                        &&
                        <Filter onClose={onClose} />
                    }
                    <div className="products-container" ref={productsRef}>
                        {
                            scrollY !== 0 &&
                            <div className="top-overlay"></div>
                        }
                        <ProductComp options={productsInfo} />
                        {
                            scrollY !== scrollMax
                            &&
                            <div className="bottom-overlay"></div>
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}
