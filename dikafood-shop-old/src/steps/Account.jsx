import { PiUser } from "react-icons/pi";
import Popup from "../Components/Popup";
import "./account.scss";

export default function Account({ onClose, onOpenChnageInfo, onOpenChangePass }) {
    return (
        <div className="account">
            <Popup popupIcon={<PiUser size={"20px"} />} popupName={"Acoount"} onClose={onClose}>
                <div className="body">
                    <div className="card info">
                        <p>Informations</p>
                        <div>
                            <div>
                                <p>First name</p>
                                <p>Kamal</p>
                            </div>
                            <div>
                                <p>Last name</p>
                                <p>El Bennani</p>
                            </div>
                            <div>
                                <p>Email</p>
                                <p>kamal.elbennani24@gmail.com</p>
                            </div>
                            <div>
                                <p>Phone</p>
                                <p>+212 735 44 11 08</p>
                            </div>
                        </div>
                    </div>
                    <div className="parag" >
                        <p onClick={onOpenChangePass}>Change password</p>
                    </div>
                    <div className="buttons-container">
                        <button className="chnage-info" onClick={onOpenChnageInfo}>Change Information</button>
                        <button className="logout">Log out</button>
                    </div>
                </div>
            </Popup>
        </div>
    )
}
