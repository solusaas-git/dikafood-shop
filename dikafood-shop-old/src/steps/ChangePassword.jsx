import React, { useState } from 'react'
import { PiArrowLeft, PiCheckCircle } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom'
import PasswordInput from '../Components/PasswordInput';
import "./change-password.scss"

export default function ChangePassword({ onOpenLogIn }) {
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    return (
        <div className='change-password-conatiner'>
            <div className='change-password'>
                <div className="header">
                    <p onClick={() => { navigate("/") }}>
                        Home {">"}
                        <span>Change password</span>
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
                                    <p>Your pasword has successfully changed!</p>
                                </div>
                                <button onClick={onOpenLogIn}>Log in</button>
                            </div>
                            :
                            <>
                                <p>Change Password</p>
                                <form action="">
                                    <div className="inputs-container">
                                        <PasswordInput placeholder={"new password"} />
                                        <PasswordInput placeholder={"confirm new password"} />
                                    </div>
                                    <button onClick={() => setIsSuccess(true)}>Confirm New Password</button>
                                </form>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}
