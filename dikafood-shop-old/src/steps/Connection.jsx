import { PiUser } from "react-icons/pi";
import "./connection.scss";
import PasswordInput from "../Components/PasswordInput";
import Popup from "../Components/Popup";

export default function Connection({ onClose, onOpenFogetPass, onOpenAccount }) {
    return (
        <div className="connection">
            <Popup popupIcon={<PiUser size={"20px"} />} popupName={"Connection"} onClose={onClose}>
                <div className="body">
                    <form action="">
                        <div className="inputs-container">
                            <input type="text" placeholder="Email *" name="email" />
                            <PasswordInput />
                        </div>
                        <div className="parag" >
                            <p onClick={onOpenFogetPass}>Forget Password</p>
                        </div>
                        <div className="buttons-container">
                            <button className="login" onClick={onOpenAccount}>Log in</button>
                            <div className="signup"><a href="/signup">Sign up</a></div>
                        </div>
                    </form>
                </div>
            </Popup>
        </div>
    )
}
