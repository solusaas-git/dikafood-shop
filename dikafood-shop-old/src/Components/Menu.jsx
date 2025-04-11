import "./menu.scss";
import { PiList, PiPackage, PiUser, PiX } from 'react-icons/pi'

export default function Menu({ onClose, onOpenOrders }) {
    return (
        <div className='menu'>
            <div className="header">
                <div>
                    <span>
                        <PiList size={"14px"} />
                    </span>
                    <p>Menu</p>
                </div>
                <span onClick={onClose}>
                    <PiX size={"12px"} color="var(--dark-green-6)" />
                </span>
            </div>
            <div className="body">
                <div>
                    <span>
                        <PiUser />
                    </span>
                    <p>
                        Profile
                    </p>
                </div>
                <div onClick={onOpenOrders}>
                    <span>
                        <PiPackage />
                    </span>
                    <p>Orders</p>
                </div>
            </div>
        </div>
    )
}
