import { PiArrowLeft } from 'react-icons/pi'
import Popup from '../Components/Popup'
import './forget-pass.scss'

export default function ForgetPass({ onClose }) {
    return (
        <div className='forget-pass'>
            <Popup popupName={"Forget password"} onClose={onClose}
                backbutton={
                    <span className="back" onClick={onClose}>
                        <PiArrowLeft size={"20px"} />
                    </span>}
            >
                <div className="body">
                    <input type="text" placeholder='Email *' name='email' />
                    <div className="buttons">
                        <button className='cancel' onClick={onClose}>Cancel</button>
                        <button className='send'>Send Verification</button>
                    </div>
                </div>
            </Popup>
        </div>
    )
}
