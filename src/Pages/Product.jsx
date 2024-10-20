import "./product.scss"
import InputSearch from '../Components/InputSearch';
import DropDown from '../Components/DropDown';
import Button from "../Components/Button";
import InputValue from "../Components/InputValue";
import Btn from "../Components/Btn";
import { useEffect, useRef, useState } from "react";
import BasketCard from "../Components/BasketCard";
export default function Product() {
    const filter = [
        { id: 1, label: 'quantité' },
        { id: 2, label: 'prix' },
        { id: 3, label: 'catégorie' }
    ];
    const triage = [
        { id: 1, label: 'quantité' },
        { id: 2, label: 'prix' },
        { id: 3, label: 'catégorie' }
    ];
    const numberRef = useRef(null);
    const priceRef = useRef(null);
    // const [totalPrice, setTotalPrice] = useState(0);
    // console.log(numberRef.current.value)
    let number = 0
    let price = 0
    // number = parseInt(numberRef.current.value);
    // price = parseInt(priceRef.current.value);
    useEffect(() => {
        console.log(number * price)
    }, [number, price])
    // const updateOutput = useCallback(() => {
    //     setTotalPrice(number * price);
    // }, [number, price]);

    // useEffect(() => {
    //     updateOutput();

    //     // const numberInput = numberRef.current;
    //     // const priceInput = priceRef.current;

    //     // numberInput.addEventListener('input', updateOutput);
    //     // priceInput.addEventListener('input', updateOutput);
    //     // console.log(totalPrice)

    //     // return () => {
    //     //     numberInput.removeEventListener('input', updateOutput);
    //     //     priceInput.removeEventListener('input', updateOutput);
    //     // };
    // }, [updateOutput, totalPrice]);
    const [isOpenBasket , setIsOpenBasket] = useState(false);
    const onOpenBasket = ()=>{
        setIsOpenBasket(!isOpenBasket)
    }
    const basketRef = useRef()
    const handleClickOutside = (event) => {
        if (basketRef.current && !basketRef.current.contains(event.target)) {
            setIsOpenBasket(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div className='product-page'>
            <div className="header-page">
                <div>
                    <InputSearch />
                    <DropDown options={filter} defaultValue={"Filtrer par"} />
                    <DropDown options={triage} defaultValue={"Trier par"} />
                </div>
                <div>
                    <Btn btnName={"Compte"} theme={"compte"} />
                    <Btn btnName={"Panier"} theme={"panier"} onclick={onOpenBasket} isActive={isOpenBasket} />
                </div>
            </div>
            <div className="body-page">
                <div className="product-img">
                    <div className="bg"></div>
                    <img src="/images/chourouk-1L.png" alt="" />
                </div>
                <div className="product-info">
                    <div className="product-name">
                        <h2 className="title-small">Oued Fes Huile D’olive Extra Vièrge</h2>
                        <div>
                            <img src="/images/orange-rating.jpg" alt="" />
                            <p>42 Révisions</p>
                        </div>
                    </div>
                    <div className="product-descp">
                        <div className="header">
                            <p>Description du produit</p>
                            <div></div>
                        </div>
                        <p className="body-small">
                            Découvrez l'authenticité et la richesse de notre huile d'olive extra vierge,
                            pressée à froid pour préserver tous ses arômes naturels et ses bienfaits nutritionnels.
                            Issue des meilleurs oliviers de la région méditerranéenne, cette huile de qualité
                            supérieure est caractérisée par sa saveur fruitée et sa légère amertume,
                            idéale pour rehausser vos plats les plus délicats.
                        </p>
                    </div>
                    <div className="product-proprties">
                        <div className="header">
                            <p>Propriétés du produit</p>
                            <div></div>
                        </div>
                        <div className="content">
                            <div>
                                <p className="prop">Marque</p>
                                <p>Chourouk</p>
                            </div>
                            <div>
                                <p className="prop">Origin</p>
                                <p>Région Méditerranéenne</p>
                            </div>
                            <div>
                                <p className="prop">Production</p>
                                <p>Pressée à froid</p>
                            </div>
                            <div>
                                <p className="prop">Goût</p>
                                <p>Fruité avec une pointe d'amertume</p>
                            </div>
                        </div>
                    </div>
                </div>
                <form action="">
                    <InputValue labelName={"Volume de l'unité"} inputName={"volume"} defaultValue={1} />
                    <InputValue labelName={"Nombre d’unités"} inputName={"nombre"} defaultValue={3} inputRef={numberRef} />
                    <InputValue labelName={"Prix de l’unité"} inputName={"prix-unitaire"} defaultValue={900} option={"price"} inputRef={priceRef} />
                    <InputValue labelName={"Prix total"} inputName={"prix-total"} defaultValue={2700} option={"price"} />
                    <p><span>*</span> Frais de livraison sont calculés entièrement</p>
                    <Button buttonIcon={"Acheter maintenent"} theme={"button-comp-primary"} size={"button-comp-small"} />
                    <Button buttonIcon={"Ajouter au panier"} theme={"button-comp-secondary"} size={"button-comp-small"} />
                </form>
                <div className={isOpenBasket === true ? "basket active" :"basket"} ref={basketRef}>
                    <div className="card-container">
                        <BasketCard />
                        <BasketCard />
                        <BasketCard />
                        <BasketCard />
                    </div>
                    <div className="basket-foot">
                        <div>
                            <p>Subtotal</p>
                            <div></div>
                            <p><span>2700</span> MAD</p>
                        </div>
                        <Button buttonIcon={"procéder au paiement"} theme={"button-comp-primary"} size={"button-comp-small"} />
                    </div>
                </div>
            </div>
        </div>
    )
}
