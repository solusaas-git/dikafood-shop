import "./toggle-button.scss";

export default function ToggleButton({isToggled, setIsToggled}) {
    

    return (
        <div className={isToggled ? 'toggle-button active' :'toggle-button'} onClick={()=>setIsToggled(p=>!p)}>
            <div></div>
        </div>
    )
}
