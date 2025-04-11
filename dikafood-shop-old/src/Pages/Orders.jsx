import "./orders.scss"
import { PiArrowLeft, PiGridFour, PiX } from 'react-icons/pi'
import OrderCard from '../Components/OrderCard';
import { useEffect, useRef, useState } from "react";

export default function Orders({ onClose, onOpenDetails, orders }) {
    const handleHomeRedirect = () => {
        window.location.href = "/"; 
      };
    const ordersRef = useRef();
    const [ordersScrollY, setOrdersScrollY] = useState(0);
    const [ordersScrollMax, setOrdersScrollMax] = useState(1);
    const handleScroll = (ref) => {
        if (ref.current) {
            setOrdersScrollY(ref.current.scrollTop);
            setOrdersScrollMax(ref.current.scrollHeight - ref.current.clientHeight);
        }
    };

    useEffect(() => {
        const currentRef = ordersRef;

        const handleScrollWrapper = () => {
            if (currentRef.current) {
                handleScroll(currentRef);
            }
        };

        if (currentRef.current) {
            currentRef.current.addEventListener('scroll', handleScrollWrapper);
        } else {
            console.log('Current ref is null when adding scroll listener.');
        }

        return () => {
            if (currentRef.current) {
                currentRef.current.removeEventListener('scroll', handleScrollWrapper);
            }
        };
    }, [ordersRef]);
    
    return (
        <div className='orders'>
            <div className="header">
                {
                    window.visualViewport.width  < 430 ?
                        <>
                            <div>
                                <span>
                                    <PiGridFour size={"16px"} />
                                </span>
                                <p>Orders</p>
                            </div>
                            <span onClick={onClose}>
                                <PiX size={"14px"} color="var(--dark-green-6)" />
                            </span>
                        </>
                        :
                        <>
                            <p onClick={handleHomeRedirect}>
                                Home {">"}
                                <span>Orders</span>
                            </p>
                            <div className="back" onClick={handleHomeRedirect}>
                                <PiArrowLeft />
                                <p>Back to home</p>
                            </div>
                        </>
                }
            </div>

            {
                window.visualViewport.width  < 430 ?
                    <div className="orders-list" ref={ordersRef}>
                        {
                            ordersScrollY !== 0 &&
                            <div className="top-overlay"></div>
                        }
                        <OrderCard options={orders} onOpenDetails={(index, id) => onOpenDetails(index, id)} />
                        {
                            ordersScrollY !== ordersScrollMax
                            &&
                            <div className="bottom-overlay"></div>
                        }
                    </div>
                    :
                    <div className="orders-list">
                        <p>Orders</p>
                        <div className="orders-list-container" ref={ordersRef}>
                            {
                                ordersScrollY !== 0 &&
                                <div className="top-overlay"></div>
                            }
                            <OrderCard options={orders} onOpenDetails={(index, id) => onOpenDetails(index, id)} />
                            {
                                ordersScrollY !== ordersScrollMax
                                &&
                                <div className="bottom-overlay"></div>
                            }
                        </div>
                    </div>
            }
        </div>
    )
}
