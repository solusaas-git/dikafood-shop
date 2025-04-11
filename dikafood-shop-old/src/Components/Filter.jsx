import { PiArrowClockwise, PiCheck, } from "react-icons/pi";
import "./filter.scss";
import RangeSlider from "./RangeSlider";
import { useRef, useState } from "react";
import OptionsSelected from "./OptionsSelected";

export default function Filter({ onClose }) {
    const maxVol = 500;
    const minVol = 0;
    const [minVolume, setMinVolume] = useState(150);
    const [maxVolume, setMaxVolume] = useState(300);
    const maxPri = 1000;
    const minPri = 0;
    const [minPrice, setMinPrice] = useState(200);
    const [maxPrice, setMaxPrice] = useState(600);
    const VolumeRef = useRef(null);
    const activeThumbVolumeRef = useRef(null);
    const PriceRef = useRef(null);
    const activeThumbPriceRef = useRef(null);
    const brands = ["Chourouk", "nouarti", "ouedfes", "dika", "biladi"]
    const categories = ["Olive oil", "Sunflower oil"]
    const [isSelectedBrands, setIsSelectedBrands] = useState(brands.map((_, i) => true))
    const [isSelectedCategories, setIsSelectedCategories] = useState(categories.map((_, i) => true))

    const handleMouseMoveVolume = (e) => {
        let clientX;

        if (e.type === 'mousemove') {
            clientX = e.clientX;
        } else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
        }
        if (VolumeRef.current) {
            const sliderRect = VolumeRef.current.getBoundingClientRect();
            const offsetX = Math.min(Math.max(0, clientX - sliderRect.left), sliderRect.width);
            const newValue = Math.round((offsetX / sliderRect.width) * (maxVol - minVol) + minVol);

            if (activeThumbVolumeRef.current === "min") {
                if (newValue < maxVolume) {
                    setMinVolume(newValue);
                }
            } else if (activeThumbVolumeRef.current === "max") {
                if (newValue > minVolume) {
                    setMaxVolume(newValue);
                }
            }
        }
    };
    const handleMouseMovePrice = (e) => {
        let clientX;
        if (e.type === 'mousemove') {
            clientX = e.clientX;
        } else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
        }

        if (PriceRef.current) {
            const sliderRect = PriceRef.current.getBoundingClientRect();
            const offsetX = Math.min(Math.max(0, clientX - sliderRect.left), sliderRect.width);
            const newValue = Math.round((offsetX / sliderRect.width) * (maxPri - minPri) + minPri);

            if (activeThumbPriceRef.current === "min") {
                if (newValue < maxPrice) {
                    setMinPrice(newValue);
                }
            } else if (activeThumbPriceRef.current === "max") {
                if (newValue > minPrice) {
                    setMaxPrice(newValue);
                }
            }
        }
    };

    const onResetVolumeValues = () => {
        setMinVolume(150);
        setMaxVolume(300);
    }
    const onResetPriceValues = () => {
        setMinPrice(200)
        setMaxPrice(600);
    }
    const onResetAll = ()=>{
        setMinVolume(150);
        setMaxVolume(300);
        setMinPrice(200);
        setMaxPrice(600)
        setIsSelectedBrands(brands.map((_, i) => true))
        setIsSelectedCategories(categories.map((_, i) => true))
    }

    return (
        <div className="filter-container">
            <div className="body">
                <RangeSlider rangeName={"Volume"}
                    minValue={minVolume}
                    setMinValue={setMinVolume}
                    maxValue={maxVolume}
                    setMaxValue={setMaxVolume}
                    maxVal={maxVol}
                    handleMouseMove={handleMouseMoveVolume}
                    sliderRef={VolumeRef}
                    activeThumbRef={activeThumbVolumeRef}
                    minVal={minVol}
                    onResetValue={onResetVolumeValues}
                />
                <RangeSlider rangeName={"Price"}
                    minValue={minPrice}
                    setMinValue={setMinPrice}
                    maxValue={maxPrice}
                    setMaxValue={setMaxPrice}
                    maxVal={maxPri}
                    minValueNotToExceed={120}
                    maxValueNotToExceed={850}
                    minVal={minPri}
                    handleMouseMove={handleMouseMovePrice}
                    sliderRef={PriceRef}
                    activeThumbRef={activeThumbPriceRef}
                    onResetValue={onResetPriceValues}
                />
                <OptionsSelected
                    optionName={"Brand"}
                    options={brands}
                    isSelectedOptions={isSelectedBrands}
                    setIsSelectedOptions={setIsSelectedBrands} />
                <OptionsSelected
                    optionName={"Categories"}
                    options={categories}
                    isSelectedOptions={isSelectedCategories}
                    setIsSelectedOptions={setIsSelectedCategories}
                />
            </div>
            <div className="footer">
                <button className="reset" onClick={onResetAll}>
                    <span>
                        <PiArrowClockwise size={"16px"} />
                    </span>
                    Reset All
                </button>
                <button className="confirm">
                    <span>
                        <PiCheck size={"16px"} />
                    </span>
                    Apply Filter
                </button>
            </div>
        </div>
    )
}
