import { PiArrowLeft, PiCheck, PiCheckCircle } from "react-icons/pi";
import "./create-account.scss";
import { useNavigate } from 'react-router-dom'
import { useState } from "react";

export default function CreateAccount({ onOpenLogIn }) {
    const navigate = useNavigate();
    const [isAccept, setIsAccept] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    return (
        <div className="create-account-container">
            <div className='create-account'>
                <div className="header">
                    <p onClick={() => { navigate("/")}}>
                        Home {">"}
                        <span>Create Account</span>
                    </p>
                    <div className="back" onClick={() => { navigate("/")}}>
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
                                    <p>Your account was created! Check your email for verification</p>
                                </div>
                                <button onClick={onOpenLogIn}>Log in</button>
                            </div>
                            :
                            <>
                                <p>Create Account</p>
                                <form action="">
                                    <div className="inputs-container">
                                        <input type="text" placeholder="First name" />
                                        <input type="text" placeholder="Last name" />
                                        <input type="email" placeholder="Email" />
                                        <input type="text" placeholder="Phone" />
                                        <div>
                                            <div className={isAccept ? "check active" : "check"} onClick={() => { setIsAccept(p => !p) }}>
                                                <PiCheck />
                                            </div>
                                            <p>Accept Terms & Conditions</p>
                                        </div>
                                    </div>
                                    <div className="buttons">
                                        <div className="login" onClick={onOpenLogIn}>log In</div>
                                        <button onClick={()=>setIsSuccess(true)}>Sign up</button>
                                    </div>
                                </form>
                            </>
                    }

                </div>
            </div>
        </div>
    )
}
