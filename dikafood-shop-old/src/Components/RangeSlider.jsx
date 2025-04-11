import { useState } from "react";
import "./range-slider.scss";
import { PiArrowClockwise, PiCaretDown, PiSortAscending } from "react-icons/pi";

export default function RangeSlider({ minVal, onResetValue, rangeName, maxVal, minValue, setMinValue, handleMouseMove, activeThumbRef, sliderRef, maxValue, setMaxValue }) {

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("touchend", handleMouseUp);
  };

  const handleMouseDown = (thumb) => {
    activeThumbRef.current = thumb;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);
  };

  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <div className="range-slider">
      <div className={isCollapse ? "header active" : "header"}>
        <div>
          <span className={isCollapse ? "active" : ""} onClick={()=>{setIsCollapse(p=>!p)}}>
          <PiCaretDown size={"16px"} />
          </span>
          <p>{rangeName}</p>
        </div>
        <div className="icons">
          <span className="sort">
            <PiSortAscending size={"16px"} />
          </span>
          <span className="reset" onClick={onResetValue}>
            <PiArrowClockwise size={"16px"} />
          </span>
        </div>
      </div>
      <div className={isCollapse ? "slider-container collapse" :"slider-container"}>
        <div className="slider">
          <div className="value min-val">{minVal}</div>
          <div className="slider-track" ref={sliderRef}>
            <div
              className="slider-range"
              style={{
                left: `${((minValue - minVal) / (maxVal - minVal)) * 100}%`,
                width: `${((maxValue - minValue) / (maxVal - minVal)) * 100}%`,
              }}
            />
            <div
              className="slider-thumb min-thumb"
              style={{ left: `${((minValue - minVal) / (maxVal - minVal)) * 100}%` }}
              onMouseDown={() => handleMouseDown("min")}
            />
            <div
              className="slider-thumb max-thumb"
              style={{ left: `${((maxValue - minVal) / (maxVal - minVal)) * 100}%` }}
              onMouseDown={() => handleMouseDown("max")}
            />
          </div>
          <div className="value max-val">{maxVal}</div>
        </div>
        <div className="inputs">
          <div className="card input">
            <p>from</p>
            <div>
              <input type="number" value={minValue} onChange={(e) => { setMinValue(e.target.value) }} />
            </div>
          </div>
          <div className="card input">
            <p>to</p>
            <div>
              <input type="number" value={maxValue} onChange={(e) => { setMaxValue(e.target.value) }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




