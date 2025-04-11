import { Children } from 'react';
import './pop-up.scss';
import { PiX } from 'react-icons/pi';

export default function Popup({ popupName, onClose, popupIcon, children, backbutton }) {
    return (
        <div className='pop-up'>
            <div className="header">
                <div>
                    {backbutton}
                    <span>
                        {popupIcon}
                    </span>
                    <p>
                        {popupName}
                    </p>
                </div>
                <span onClick={onClose}>
                    <PiX size={"20px"} />
                </span>
            </div>
            <>
                {
                    Children.map(children, child => (
                        <>
                            {child}
                        </>
                    ))
                }
            </>
        </div>
    )
}
