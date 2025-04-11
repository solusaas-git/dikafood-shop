import { PiArrowLeft, PiArrowRight, PiArrowRightBold, PiMinus, PiPlus, PiShoppingCart, PiTag } from "react-icons/pi"
import "./one-product.scss"
import Product from "./Product"
import productsInfo from "../data/productsInfo.json"
import ProductComp from "../Components/Product"
import { useEffect, useRef, useState } from "react"
import CardReview from "../Components/CardReview"
import { useNavigate } from "react-router-dom"

export default function OneProduct() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 4;
    const [unite, setUnite] = useState(1);
    const productContainerRef = useRef();
    const [scrollY, setScrollY] = useState(0);
    const [scrollMax, setScrollMax] = useState(1)

    const handleNext = () => {
        if (currentIndex + itemsPerPage < productsInfo.length) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    const handlePrev = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    const displayedProducts = productsInfo.slice(currentIndex, currentIndex + itemsPerPage);
    const bodyRef = useRef();

    const handleScroll = () => {
        if (productContainerRef.current) {
            setScrollY(productContainerRef.current.scrollTop);
        }
        if (productContainerRef.current) {
            setScrollMax(productContainerRef.current.scrollTopMax)
        }
    };

    useEffect(() => {
        const currentRef = productContainerRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        if (bodyRef.current) {
            bodyRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);


    const [productInfo, setProductInfo] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        setProductInfo(productsInfo.filter(p => p.id === parseInt(id)))
    }, [])

    const navigate = useNavigate(null)
    const BackToHome = () => {
        navigate(-1)
    }
    const scrollRef = useRef(null);
    const [isDisabledArrowLeft, setIsDisabledArrowLeft] = useState(false);
    const [isDisabledArrowRight, setIsDisabledArrowRight] = useState(false);

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const isAtStart = scrollLeft === 0;
            const isAtEnd = scrollLeft + clientWidth === scrollWidth;
            setIsDisabledArrowLeft(isAtStart);
            setIsDisabledArrowRight(isAtEnd);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            checkScrollPosition();
        };

        const currentRef = scrollRef.current;
        currentRef?.addEventListener("scroll", handleScroll);

        checkScrollPosition();

        return () => {
            currentRef?.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({
            top: 0,
            left: -300,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({
            top: 0,
            left: 300,
            behavior: 'smooth'
        });
    };

    return (
        <div className="one-product">
            {
                window.visualViewport.width < 430 &&
                <>
                    <div className="buttons-container">
                        <div className="buttons">
                            <button className="button">
                                <span>
                                    <PiShoppingCart size={"24px"} color="var(--dark-green-6)" />
                                </span>
                                Add to cart
                            </button>
                            {/* <button className="button">
                                <span>
                                    <PiScroll size={"24px"} color="var(--dark-green-6)" />
                                </span>
                                request a quote
                            </button> */}
                        </div>
                    </div>
                    <div className="product" ref={productContainerRef}>
                        {
                            scrollY !== 0 &&
                            <div className="top-overlay"></div>
                        }
                        <Product options={productInfo} />
                        <div className="reviews-prod">
                            <div className="header">
                                <p>Reviews</p>
                                <div>
                                    <span style={{ cursor: 'pointer' }}><PiArrowLeft /></span>
                                    <span style={{ cursor: 'pointer' }}><PiArrowRight /></span>
                                </div>
                            </div>
                            <div className="body" >
                                <div className="reviews-container" ref={bodyRef}>
                                    <CardReview />
                                    <CardReview />
                                    <CardReview />
                                    <CardReview />
                                </div>
                            </div>
                        </div>
                        <div className="recommendations">
                            <div className="header">
                                <p>Recommendations</p>
                                <div>
                                    <span style={{ cursor: 'pointer' }} onClick={handlePrev}><PiArrowLeft color={currentIndex - itemsPerPage >= 0 ? "#000" : '#E6E6E6'} /></span>
                                    <span style={{ cursor: 'pointer' }} onClick={handleNext}><PiArrowRight color={currentIndex + itemsPerPage < productsInfo.length ? "#000" : "#E6E6E6"} /></span>
                                </div>
                            </div>
                            <div className="body">
                                <ProductComp options={displayedProducts} />
                            </div>
                        </div>
                        {
                            scrollY !== scrollMax
                            &&
                            <div className="bottom-overlay"></div>
                        }
                    </div>
                    <div className="container-footer">
                        <div className="footer">
                            <div className="total">
                                <div>
                                    <span>
                                        <PiTag size={"16px"} />
                                    </span>
                                    Subtotal price
                                </div>
                                <p>
                                    {productInfo[0]?.price}
                                </p>
                            </div>
                            <div className="action">
                                <div>
                                    <span onClick={() => setUnite(p => (p > 1 ? p - 1 : p))} style={{ cursor: 'pointer' }}><PiMinus size={"16px"} color={unite === 1 ? "#E6E6E6" : "var(--dark-green-6)"} /></span>
                                    <span>{unite}</span>
                                    <span onClick={() => { setUnite(p => p + 1) }} style={{ cursor: 'pointer' }}><PiPlus size={"16px"} /></span>
                                </div>
                                <button>
                                    buy now
                                    <span><PiArrowRightBold size={"16px"} /></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            }

            {
                window.visualViewport.width > 430
                &&
                <>
                    <div className="navigate">
                        <div className="route">
                            <p onClick={() => { navigate("/") }}>Home</p> {">"} <span>product</span>
                        </div>
                        <div className="link" onClick={BackToHome}>
                            <span>
                                <PiArrowLeft />
                            </span>
                            <p>
                                back to home
                            </p>
                        </div>
                    </div>
                    <div className="product" ref={productContainerRef}>
                        <Product options={productInfo} />
                        <div className="reviews-prod">
                            <div className="header">
                                <p>Reviews</p>
                                <div>
                                    <span onClick={scrollLeft} style={{ cursor: 'pointer' }} 
                                    className={isDisabledArrowLeft ? "disabled" : "" }><PiArrowLeft /></span>
                                    <span onClick={scrollRight} style={{ cursor: 'pointer' }}
                                    className={isDisabledArrowRight ? "disabled" : "" }><PiArrowRight /></span>
                                </div>
                            </div>
                            <div className="body" >
                                <div className="reviews-container" ref={scrollRef}>
                                    <CardReview />
                                    <CardReview />
                                    <CardReview />
                                    <CardReview />
                                </div>
                            </div>
                        </div>
                        <div className="recommendations">
                            <div className="header">
                                <p>Recommended Products</p>
                                <div>
                                    <span style={{ cursor: 'pointer' }} onClick={handlePrev}><PiArrowLeft color={currentIndex - itemsPerPage >= 0 ? "#000" : '#E6E6E6'} /></span>
                                    <span style={{ cursor: 'pointer' }} onClick={handleNext}><PiArrowRight color={currentIndex + itemsPerPage < productsInfo.length ? "#000" : "#E6E6E6"} /></span>
                                </div>
                            </div>
                            <div className="body">
                                <ProductComp options={displayedProducts} />
                            </div>
                        </div>
                        {
                            scrollY !== scrollMax
                            &&
                            <div className="bottom-overlay"></div>
                        }
                    </div>
                </>
            }
        </div>
    )
}
