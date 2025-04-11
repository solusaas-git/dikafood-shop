import { PiPackage, PiTag} from 'react-icons/pi';
import './third-step.scss';
import { useEffect, useRef, useState } from 'react';
import Steps from './Steps';

export default function ThirdStep({ onClose, onOpen }) {

    const informationsRef = useRef();
    const [ordersScrollY, setOrdersScrollY] = useState(0);
    const [ordersScrollMax, setOrdersScrollMax] = useState(1);

    const handleScroll = (ref) => {
        if (ref.current) {
            setOrdersScrollY(ref.current.scrollTop);
            setOrdersScrollMax(ref.current.scrollHeight - ref.current.clientHeight);
        }
    };

    useEffect(() => {
        const currentRef = informationsRef;

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
    }, [informationsRef]);

    const informations = [
        {
            title: "contact",
            infos: [
                { att: "First Name", value: "Kamal" },
                { att: "Last Name", value: "El Benani" },
                { att: "Email", value: "kamal.elbenani@gmail.com" },
                { att: "Phone", value: "+212 735 44 11 08" }
            ]
        },
        {
            title: "Location",
            infos: [
                { att: "Country", value: "Morocco" },
                { att: "City", value: "Casablanca" },
                { att: "Address", value: "Rue de la liberté" },
            ]
        },
        {
            title: "Shipping & Payment",
            infos: [
                { att: "Shipping type", value: "Premium" },
                { att: "Shipping Company", value: "Aramex" },
                { att: "Payment method", value: "Cash on Delivery" },
            ]
        }
    ]

    return (
        <div className='third-step'>

            <Steps
                currentStep={3}
                stepName={"Recap"}
                nextButtonName={"Confirm Order"}
                onClose={onClose}
                onOpen={onOpen}
                footerChildren={
                    <>
                        <div className="shipping-info">
                            <div>
                                <div>
                                    <span>
                                        <PiTag size={"16px"} />
                                    </span>
                                    Subtotal
                                </div>
                                <p>
                                    $732
                                </p>
                            </div>
                            <div>
                                <div>
                                    <span>
                                        <PiPackage size={"16px"} />
                                    </span>
                                    Shipping
                                </div>
                                <p>
                                    $48
                                </p>
                            </div>
                        </div>
                        <div className="total">
                            <div>
                                <span>
                                    <PiTag size={"16px"} />
                                </span>
                                Total
                            </div>
                            <p>
                                $780
                            </p>
                        </div>
                    </>
                }
            >
                <>
                    {
                        ordersScrollY !== 0 && window.visualViewport.width  < 430 &&
                        <div className="top-overlay"></div>
                    }
                    <div className="informations" ref={informationsRef}>
                        {
                            informations.map((info, index) => (
                                <div className="card" key={index}>
                                    <p>{info.title}</p>
                                    <div className="infos">
                                        {
                                            info.infos.map((information, i) => (
                                                <div className="info" key={i}>
                                                    <p>{information.att}</p>
                                                    <p>{information.value}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {
                        ordersScrollY !== ordersScrollMax 
                        &&
                        window.visualViewport.width  < 430 &&
                        <div className="bottom-overlay"></div>
                    }
                </>
            </Steps>

        </div>
    )
}
