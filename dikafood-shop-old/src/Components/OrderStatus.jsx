import { PiClipboardText, PiHouse, PiPackage, PiTruck } from "react-icons/pi";
import "./order-status.scss"

export default function OrderStatus({ statusIndex }) {
    const steps = [
        { icon: <PiClipboardText /> },
        { icon: <PiPackage /> },
        { icon: <PiTruck /> },
        { icon: <PiHouse /> },
    ];
    return (
        <div className="order-status-container">
            <div className="order-steps">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`order-step ${index < statusIndex ? 'complete' : `${index === statusIndex ? "active" : ""}`}`}
                    >
                        <div className="icon">
                            <span>
                                {step.icon}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
