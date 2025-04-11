import { useEffect, useRef, useState } from "react";
import OrderStatus from "../Components/OrderStatus";
import "./order-details.scss";
import { PiArrowLeft, PiArrowRight, PiGridFour, PiX } from 'react-icons/pi'
import orders from "../data/Orders.json";
import { useNavigate } from "react-router-dom";

export default function OrderDetails({ onClose, orderDetails }) {
    const [orderDet, setOrderDet] = useState([]);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (window.visualViewport.width < 430) {
            setOrderDet(orderDetails)
        }
        else {
            setOrderDet(orders.filter(o => o.serialNumber === parseInt(id)))
        }
    }, [orderDetails])
    const navigate = useNavigate();
    const itemsRef = useRef(null)

    const scrollLeft = () => {
        itemsRef.current.scrollBy({
            top: 0,
            left: -300,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        itemsRef.current.scrollBy({
            top: 0,
            left: 300,
            behavior: 'smooth'
        });
    };
    return (
        <>
            {
                orderDet.map((order, index) => {
                    let statusIndex = null;
                    if (order.status === "in transit") {
                        statusIndex = 2
                    }
                    else if (order.status === "delivred") {
                        statusIndex = 3
                    }
                    else if (order.status === "processing") {
                        statusIndex = 0
                    }
                    else if (order.status === "packaging") {
                        statusIndex = 1
                    }
                    return (
                        <>
                            {
                                window.visualViewport.width < 430 ?
                                    <div className='order-details' key={index}>
                                        <div className="header">
                                            <div>
                                                <span onClick={onClose}>
                                                    <PiArrowLeft />
                                                </span>
                                                <div>
                                                    <PiGridFour size={"16px"} />
                                                    <p>Orders</p>
                                                    {">"}
                                                    <span>Details</span>
                                                </div>
                                            </div>
                                            <span onClick={onClose}>
                                                <PiX />
                                            </span>
                                        </div>
                                        <div className="body">
                                            <div className="order-info">
                                                <div>
                                                    <p>Order ID</p>
                                                    <p>#{order.serialNumber}</p>
                                                </div>
                                                <div>
                                                    <p>Order Date</p>
                                                    <p>{order.orderDate}</p>
                                                </div>
                                            </div>
                                            <div className="order-stat">
                                                <div>
                                                    <p>status</p>
                                                    <p>{order.status}</p>
                                                </div>
                                                <OrderStatus statusIndex={statusIndex} />
                                            </div>
                                            <div className="order-items">
                                                {
                                                    order.items.map((item, i) => (
                                                        <div className="item" key={i}>
                                                            <div className="item-img">
                                                                <img src={item.productImage} alt="" />
                                                            </div>
                                                            <div className="item-info">
                                                                <p>{item.productDescription}</p>
                                                                <div>
                                                                    <div>
                                                                        <p>Quatite</p>
                                                                        <p>{item.productQuantity}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p>Price</p>
                                                                        <p>{item.productPrice}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div className="shiping-info">
                                                <div>
                                                    <p>Payment Method</p>
                                                    <p>Cash on Delivery</p>
                                                </div>
                                                <div>
                                                    <p>Subtotal</p>
                                                    <p>$280</p>
                                                </div>
                                                <div>
                                                    <p>Delivery</p>
                                                    <p>$0</p>
                                                </div>
                                                <div>
                                                    <p>Total</p>
                                                    <p>$280</p>
                                                </div>
                                            </div>
                                            <div className="client-info">
                                                <div>
                                                    <p>Delivery Address</p>
                                                    <p>av. Mly Ismail ang. bd Benzidane, cplxe des Habou, Meknes, Morocco</p>
                                                </div>
                                                <div>
                                                    <p>Delivery Method</p>
                                                    <p>Free</p>
                                                </div>
                                                <div>
                                                    <p>Estimated Delivery </p>
                                                    <p>in 3 days</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className='order-details' key={index}>
                                        <div className="header">
                                            <div className="route" >
                                                <p onClick={() => navigate("/")}>
                                                    Home {">"} 
                                                </p>
                                                <p onClick={() => navigate("/orders")}>Orders {">"} </p>
                                                <span>Order details #{order.serialNumber}</span>
                                            </div>
                                            <div className="back" onClick={() => navigate("/")}>
                                                <PiArrowLeft />
                                                <p>Back to home</p>
                                            </div>
                                        </div>
                                        <div className="body">
                                            <div className="order-items-container">
                                                <div className="head">
                                                    <p>Ordered Items</p>
                                                    <div className="icons">
                                                        <span onClick={scrollLeft}>
                                                            <PiArrowLeft size={"16px"} />
                                                        </span>
                                                        <span onClick={scrollRight}>
                                                            <PiArrowRight size={"16px"} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="order-items" ref={itemsRef}>
                                                    {
                                                        order.items.map((item, i) => (
                                                            <div className="item" key={i}>
                                                                <div className="item-img">
                                                                    <img src={item.productImage} alt="" />
                                                                </div>
                                                                <div className="item-info">
                                                                    <p>{item.productDescription}</p>
                                                                    <div>
                                                                        <div>
                                                                            <p>Quatite</p>
                                                                            <p>{item.productQuantity}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p>Price</p>
                                                                            <p>{item.productPrice}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <div className="more-info-container">
                                                <div className="head">
                                                    <p>More Details</p>
                                                    <div className="icons">
                                                        <span>
                                                            <PiArrowLeft size={"16px"} />
                                                        </span>
                                                        <span>
                                                            <PiArrowRight size={"16px"} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="more-info">
                                                    <div className="card order-info">
                                                        <p>About order</p>
                                                        <div className="order-info-container">
                                                            <div>
                                                                <p>Order ID</p>
                                                                <p>#{order.serialNumber}</p>
                                                            </div>
                                                            <div>
                                                                <p>Order Date</p>
                                                                <p>{order.orderDate}</p>
                                                            </div>
                                                            <div>
                                                                <p>Ordered Items</p>
                                                                <p>{order.items.length}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card order-stat">
                                                        <p>Track order</p>
                                                        <div className="order-stat-container">
                                                            <div className="stat">
                                                                <p>status</p>
                                                                <p>{order.status}</p>
                                                            </div>
                                                            <OrderStatus statusIndex={statusIndex} />
                                                        </div>
                                                    </div>
                                                    <div className="card client-info">
                                                        <p>Delivery</p>
                                                        <div className="client-info-container">
                                                            <div>
                                                                <p>Delivery Address</p>
                                                                <p>av. Mly Ismail ang. bd Benzidane, cplxe des Habou, Meknes, Morocco</p>
                                                            </div>
                                                            <div>
                                                                <p>Delivery Method</p>
                                                                <p>Free</p>
                                                            </div>
                                                            <div>
                                                                <p>Estimated Delivery </p>
                                                                <p>in 3 days</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card shiping-info">
                                                        <p>Payment</p>
                                                        <div className="shipping-info-container">
                                                            <div>
                                                                <p>Payment Method</p>
                                                                <p>Cash on Delivery</p>
                                                            </div>
                                                            <div>
                                                                <p>Subtotal</p>
                                                                <p>$280</p>
                                                            </div>
                                                            <div>
                                                                <p>Delivery</p>
                                                                <p>$0</p>
                                                            </div>
                                                            <div>
                                                                <p>Total</p>
                                                                <p>$280</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </>
                    )
                })
            }
        </>

    )
}
