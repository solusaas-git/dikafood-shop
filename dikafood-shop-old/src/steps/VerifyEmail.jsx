import React, { useState } from 'react'
import { PiArrowLeft, PiCheck, PiCheckCircle, PiInfo, PiX } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import "./verify-email.scss"

export default function VerifyEmail({ onOpenLogIn }) {
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    return (
        <div className='verify-email-container'>
            <div className="verify-email">
                <div className="header">
                    <p onClick={() => { navigate("/") }}>
                        Home {">"}
                        <span>verify email</span>
                    </p>
                    <div className="back" onClick={() => { navigate("/") }}>
                        <PiArrowLeft />
                        <p>Back to home</p>
                    </div>
                </div>
                <div className="body">
                    {
                        isSuccess ?
                            <div className="success">
                                <p>Congrats!</p>
                                <div className="success-message">
                                    <span>
                                        <PiCheckCircle />
                                    </span>
                                    <p>Your account has been successfully verified!</p>
                                </div>
                                <button onClick={onOpenLogIn}>Log in</button>
                            </div>
                            :
                            <>
                                <p>Verify your email</p>
                                <div className="verify-message">
                                    <span>
                                        <PiInfo size={"20px"} />
                                    </span>
                                    <p>Someone created an account using your email address <span>john.doe@example.com</span>. Do yo verify it was you?</p>
                                </div>
                                <div className="buttons">
                                    <button className='cancel'> <span><PiX size={"18px"} /></span>No, it was not me</button>
                                    <button onClick={() => { setIsSuccess(true) }}> <span><PiCheck size={"18px"} /></span> Yes, verify my email</button>
                                </div>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}
