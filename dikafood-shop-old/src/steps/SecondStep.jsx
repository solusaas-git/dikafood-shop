import Card from "../Components/Card"
import "./second-step.scss"
import {PiClock, PiPackage} from 'react-icons/pi'
import Steps from "./Steps"

export default function SecondStep({ onClose, onOpen }) {

    const shippingType = [{
        title: "Shipping type",
        options: ["Free", "Express", "Premium"]
    }]
    // const shippingCompany = [{
    //     title: "Shipping Company",
    //     options: ["FedEx", "Amana", "DHL", "Cashplus", "Aramex"]
    // }]
    const paymentMethod = [{
        title: "Payment Method",
        options: ["Cash On Delivery", "Bank transaction"]
    }]
    return (
        <div className='second-step'>

            <Steps
                stepName={"Payment & Shipping"}
                onClose={onClose}
                currentStep={2}
                onOpen={onOpen}
                nextButtonName={"next"}
                footerChildren={
                    <div className="shipping-info">
                        <div>
                            <div>
                                <span className="time">
                                    <PiClock size={"16px"} />
                                </span>
                                Average Shipping Time
                            </div>
                            <p>
                                3 to 5 days
                            </p>
                        </div>
                        <div>
                            <div>
                                <span>
                                    <PiPackage size={"16px"} />
                                </span>
                                Shipping Cost
                            </div>
                            <p>
                                $48
                            </p>
                        </div>
                    </div>
                }
            >
                <div className="container">
                    <Card options={shippingType} />
                    {/* <Card options={shippingCompany} /> */}
                    <Card options={paymentMethod} />
                </div>
            </Steps>
        </div>
    )
}
