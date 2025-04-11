import { useState } from "react";
import "./password-input.scss";
import { PiEye, PiEyeClosed } from 'react-icons/pi'

export default function PasswordInput({placeholder}) {
    const [visiblePass, setVisiblePass] = useState(false);
    return (
        <div className='password-input'>
            <input type={visiblePass ? "text" : "password"} placeholder={placeholder || "password *"} />
            <span onClick={()=>setVisiblePass(p=>!p)}>
                {
                    visiblePass ?
                        <PiEye size={"20px"} color="#666" />
                        :
                        <PiEyeClosed size={"20px"} color="#666" />
                }
            </span>
        </div>
    )
}
