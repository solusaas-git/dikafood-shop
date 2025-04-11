import "./first-step.scss"
import DropDown from "../Components/DropDown";
import Steps from "./Steps";
import ToggleButton from "../Components/ToggleButton";
import { useState } from "react";

export default function FirstStep({ onClose, onOpen }) {
    const country = [
        { id: 1, label: 'Maroc' },
        { id: 2, label: 'France' },
        { id: 3, label: 'Canada' }
    ];
    const city = [
        { id: 1, label: 'Fès' },
        { id: 2, label: 'Rabat' },
        { id: 3, label: 'Tanger' }
    ];
    const [isToggled, setIsToggled] = useState(false);
    return (
        <div className='first-step'>
            <Steps
                stepName={"Contact & Location"}
                onClose={onClose}
                onOpen={onOpen}
                nextButtonName={"next"}
                currentStep={1}>
                <form action="">
                    <div>
                        <input type="text" id="first-name" name="first-name" placeholder="First name *" required />
                        <input type="text" id="last-name" name="last-name" placeholder="Last name *" required />
                    </div>
                    <input type="text" id="email" name="email" placeholder="Email" required />
                    <input type="text" id="phone" name="phone" placeholder="Phone *" required />
                    <div>
                        <DropDown options={country} defaultValue={"Country"} />
                        <DropDown options={city} defaultValue={"City"} />
                    </div>
                    <input type="text" id="address" name="address" placeholder="Billing Address *" required />
                    <div className="toggle-button-container">
                        <ToggleButton isToggled={isToggled} setIsToggled={setIsToggled} />
                        <p>Different Shipping Address</p>
                    </div>
                    {
                        isToggled &&
                        <>
                            <div>
                                <DropDown options={country} defaultValue={"Country"} />
                                <DropDown options={city} defaultValue={"City"} />
                            </div>
                            <input type="text" id="shipping-address" name="shipping-address" placeholder="Shipping Address" />
                        </>
                    }
                </form>
            </Steps>
        </div>
    )
}
