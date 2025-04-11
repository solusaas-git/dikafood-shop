import './order-card.scss'
import { PiClipboardText, PiHouse, PiPackage, PiTruck, PiXCircle } from 'react-icons/pi'

export default function OrderCard({ options, onOpenDetails }) {
    return (
        <>
            {
                options.map((option, index) => (
                    <div className='order-card' key={index}>
                        <div className="header">
                            <div>
                                <p><PiClipboardText size={"20px"} /> #{option.serialNumber}</p>
                                <div>
                                    <div className="status">
                                        <span>
                                            {
                                                option.status === "processing" ? <PiClipboardText size={"20px"} />
                                                    :
                                                    (
                                                        option.status === "packaging" ? <PiPackage size={"20px"} /> :
                                                            (
                                                                option.status === "in transit" ? <PiTruck size={"20px"} /> :
                                                                    <PiHouse size={"20px"} />
                                                            )
                                                    )
                                            }
                                        </span>
                                        <p>{option.status}</p>
                                    </div>
                                    <span className='unpaid' onClick={() => onOpenDetails(index, option.serialNumber)}>
                                        <PiXCircle color='#990000' size={window.visualViewport.width > 430 ? "20px" : "16px"} />
                                        unpaid
                                    </span>
                                </div>
                            </div>
                            <div className="button">
                                <button>pay now</button>
                            </div>
                        </div>
                        <div className="body">
                            <div className="left">
                                <div>
                                    <p>Products</p>
                                    <p>{option.products}</p>
                                </div>
                                <div>
                                    <p>Units</p>
                                    <p>{option.units}</p>
                                </div>
                                <div>
                                    <p>Total Price</p>
                                    <p>{option.totalPrice}</p>
                                </div>
                            </div>
                            <div className="right">
                                <div>
                                    <p>order date</p>
                                    <p>{option.orderDate}</p>
                                </div>
                                <div>
                                    <p>Estimated Delivery</p>
                                    <p>{option.estimatedDelivery}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>

    )
}
