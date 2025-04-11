import { PiArrowLeft } from 'react-icons/pi'
import Popup from '../Components/Popup'
import './change-info.scss'

export default function ChangeInfo({ onClose }) {
    return (
        <div className='change-info'>
            <Popup popupName={"Change Information"}
                backbutton={
                    <span className="back" onClick={onClose}>
                        <PiArrowLeft size={"20px"} />
                    </span>}
                    onClose={onClose}
            >
                <div className="body">
                    <form action="">
                        <div className="inputs-container">
                            <input type="text" placeholder='First name *' name='firstName' />
                            <input type="text" placeholder='Last name *' name='lastName' />
                            <input type="text" placeholder='Email *' name='email' />
                            <input type="text" placeholder='Phone *' name='phone' />
                        </div>
                        <div className="buttons">
                            <button className='cancel' onClick={onClose}>Cancel</button>
                            <button className='confirm'>Confirm Information</button>
                        </div>
                    </form>
                </div>

            </Popup>
        </div>
    )
}
