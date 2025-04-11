import { PiArrowLeft, PiArrowRight, PiMinus, PiPlus, PiShoppingCart, PiStarFill } from "react-icons/pi"
import "./product.scss"
import { useEffect, useState } from "react";
import productsInfo from "../data/productsInfo.json"
import DropDownProp from "../Components/DropDownProp";

export default function Product({ options }) {
  const [images , setImages ] = useState(options);
  useEffect(()=>{
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      setImages(productsInfo.filter(p => p.id === parseInt(id))[0].images)
  }, [])
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };
  const handleClickImg = (index)=>{
    setCurrentIndex(index)
  }
  return (
    <>
      {
        window.visualViewport.width < 430 ?
          options.map((option, index) => (
            <div className="prod" key={index}>
              <div className="prod-card">
                <div className="prod-image">
                  <div className="tag">
                    <span>
                      <PiStarFill color="#FF8000" />
                    </span>
                    {option.rating}
                  </div>
                  <img src={option.images[0]} alt="" />
                </div>
                <div className="prod-title">
                  <p>{option.parag}</p>
                </div>
              </div>
              <div className="card prod-desc">
                <p>Description</p>
                <div>
                  <p>
                    {option.descp}
                  </p>
                </div>
              </div>
              <div className="card prod-details">
                <p>Details</p>
                <div className="infos">
                  <div className="info">
                    <p>Brand</p>
                    <p>{option.brand}</p>
                  </div>
                  <div className="info">
                    <p>Origin</p>
                    <p>{option.origin}</p>
                  </div>
                  <div className="info">
                    <p>Production</p>
                    <p>{option.production}</p>
                  </div>
                  <div className="info">
                    <p>Goût</p>
                    <p>{option.gout}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
          :
          options.map((option, index) => (
            <div className="prod" key={index}>
              <div className="prod-imgs">
                <div className="prod-image">
                  <div className="tag">
                    <span>
                      <PiStarFill color="#FF8000" />
                    </span>
                    {option.rating}
                  </div>
                  <img src={images[currentIndex]} alt="" />
                </div>
                <div className="other-imgs">
                  <div className="imgs">
                  {
                    option.images.map((img, index)=>(
                    <div onClick={()=>handleClickImg(index)} className={currentIndex === index ? 'img-card active' :"img-card"} key={index}>
                      <img src={img} alt="" />
                    </div>
                    ))
                  }
                  </div>
                  <div className="arrows">
                    <span onClick={prevImage}>
                      <PiArrowLeft size={'16px'} />
                    </span>
                    <span onClick={nextImage}>
                      <PiArrowRight size={'16px'} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="info-container">
                <p>{option.parag}</p>
                <div className="card prod-desc">
                  <p>Description</p>
                  <div>
                    <p>
                      {option.descp}
                    </p>
                  </div>
                </div>
                <div className="card prod-details">
                  <p>Details</p>
                  <div className="infos">
                    <div className="info">
                      <p>Brand</p>
                      <p>{option.brand}</p>
                    </div>
                    <div className="info">
                      <p>Origin</p>
                      <p>{option.origin}</p>
                    </div>
                    <div className="info">
                      <p>Production</p>
                      <p>{option.production}</p>
                    </div>
                    <div className="info">
                      <p>Goût</p>
                      <p>{option.gout}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="prod-info">
                <div className="prod-name">
                  <div>
                  <DropDownProp propertyName={"Color"} options={["red","blue","green"]} defaultValue={"choose one property"} />
                  <DropDownProp propertyName={"Size"} options={["small","medium","large"]} defaultValue={"choose one property"} />
                    <div className="card quantite">
                      <p>Quantite</p>
                      <div>
                        <p>15</p>
                        <div className="spans">
                          <span>
                            <PiMinus />
                          </span>
                          <span>
                            <PiPlus />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="card price">
                      <p>Price</p>
                      <div>
                        <p>{option.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="buttons">
                  <button className="buy-now">Buy now</button>
                  <button className="add">
                    <span>
                      <PiShoppingCart size={"24px"} color="var(--dark-green-6)" />
                    </span>
                    Add to card
                  </button>
                </div>
              </div>
            </div>
          ))
      }
    </>

  )
}
