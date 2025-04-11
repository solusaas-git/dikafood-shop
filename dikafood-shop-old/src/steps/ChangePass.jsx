import { PiArrowLeft } from 'react-icons/pi'
import PasswordInput from '../Components/PasswordInput'
import Popup from '../Components/Popup'
import './change-pass.scss'

export default function ChangePass({ onClose }) {
    return (
        <div className='change-pass'>
            <Popup popupName={"Change password"}
                backbutton={
                    <span className="back" onClick={onClose}>
                        <PiArrowLeft size={"20px"} />
                    </span>}
                onClose={onClose}
            >
                <div className="body">
                    <form action="">
                        <div className="inputs-container">
                            <PasswordInput placeholder={"old password"} />
                            <PasswordInput placeholder={"new password"} />
                            <PasswordInput placeholder={"confirm new password"} />
                        </div>
                        <div className="buttons">
                            <button className='cancel' onClick={onClose}>Cancel</button>
                            <button className='confirm'>Change Password</button>
                        </div>
                    </form>
                </div>

            </Popup>
        </div>
    )
}
