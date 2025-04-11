import { Children } from "react";
import StepsProgress from "../Components/stepsProgress";
import "./steps.scss";
import { PiArrowLeft, PiArrowLeftBold, PiArrowRightBold, PiX } from 'react-icons/pi'

export default function Steps({ stepName, onClose, onOpen, children, nextButtonName, footerChildren, currentStep }) {
    return (
        <div className='steps'>
            {
                window.visualViewport.width  < 430 ?
                    <>
                        <div className="header">
                            <p>
                                Checkout {'>'}
                                <span>
                                    {stepName}
                                </span>
                            </p>
                            <span onClick={onClose}>
                                <PiX size={"14px"} color="var(--dark-green-6)" />
                            </span>
                        </div>
                        <div className="body">
                            <StepsProgress steps={['1', '2', '3']} currentStep={currentStep} />
                            {Children.map(children, child => (
                                child
                            ))}
                        </div>
                        <div className="footer">
                            {footerChildren}
                            <div className="buttons">
                                <button className="back" onClick={onClose}>
                                    <span>
                                        <PiArrowLeftBold size={"12px"} />
                                    </span>
                                    back
                                </button>
                                <button className="next" onClick={onOpen}>
                                    {nextButtonName}
                                    <span>
                                        <PiArrowRightBold size={"12px"} />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="header">
                            <p>
                                Home {'>'} product {'>'}
                                <span>
                                    Checkout
                                </span>
                            </p>
                            <StepsProgress steps={["1", "2", "3"]} currentStep={currentStep} />
                            <div className="back" onClick={onClose}>
                                <PiArrowLeft size={"16px"} color="#333" />
                                <p>
                                    Back to product
                                </p>
                            </div>
                        </div>
                        <div className="body">
                            <p>
                                {stepName}
                            </p>
                            {Children.map(children, child => (
                                child
                            ))}
                            <div className="footer">
                                {footerChildren}
                                <div className="buttons">
                                    <button className="back" onClick={onClose}>
                                        <span>
                                            <PiArrowLeftBold size={"12px"} />
                                        </span>
                                        back
                                    </button>
                                    <button className="next" onClick={onOpen}>
                                        {nextButtonName}
                                        <span>
                                            <PiArrowRightBold size={"12px"} />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
            }

        </div>
    )
}
