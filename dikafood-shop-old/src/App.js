import { useEffect, useState } from 'react';
import './App.scss';
import './global.scss';
import './reset.css';
import './classes.scss';
import ShopNavBar from './sections/ShopNavBar';
import Basket from './Components/Basket';
import FirstStep from './steps/FirstStep';
import SecondStep from './steps/SecondStep';
import ThirdStep from './steps/ThirdStep';
import { BrowserRouter, Route } from 'react-router-dom';
import { Routes } from "react-router-dom";
import Shop from './Pages/Shop';
import OneProduct from './Pages/OneProduct';
import Filter from './Components/Filter';
import Menu from './Components/Menu';
import Orders from './Pages/Orders';
import orders from "./data/Orders.json";
import OrderDetails from './steps/OrderDetails';
import Connection from './steps/Connection';
import CreateAccount from './steps/CreateAccount';
import ForgetPass from './steps/ForgetPass';
import Account from './steps/Account';
import ChangeInfo from './steps/ChangeInfo';
import ChangePass from './steps/ChangePass';
import ChangePassword from './steps/ChangePassword';
import VerifyEmail from './steps/VerifyEmail';
import Contact from './Pages/Contact';

function App() {
  const [isOpenBasket, setIsOpenBasket] = useState(false);
  const onOpenBasket = () => {
    setIsOpenBasket(p => !p)
    setIsOpenConnection(false)
  }
  const [isOpenFirstStep, setIsOpenFirstStep] = useState(false);
  const onOpenFirstStep = () => {
    setIsOpenFirstStep(true)
    setIsOpenBasket(false)
    setIsOpenForgetPass(false)
  }
  const [isOpenSecondStep, setIsOpenSecondStep] = useState(false);
  const onOpenSecondStep = () => {
    setIsOpenSecondStep(true)
    setIsOpenFirstStep(false)
  }

  const [isOpenThirdStep, setIsOpenThirdStep] = useState(false);
  const onOpenThirdStep = () => {
    setIsOpenThirdStep(true)
    setIsOpenSecondStep(false)
  }
  const [isOpenFilter, setIsOpenFilter] = useState(null)
  useEffect(() => {
    if (window.visualViewport.width > 430) {
      setIsOpenFilter(true)
    }
    else {
      setIsOpenFilter(false)
    }
  }, [])
  const onOpenFilter = () => {
    setIsOpenFilter(p => !p)
  }

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const onOpenMenu = () => {
    setIsOpenMenu(true)
  }
  const [isOpenOrders, setIsOpenOrders] = useState(false);
  const onOpenOrders = () => {
    setIsOpenMenu(false)
    setIsOpenOrders(true)
  }
  const [orderDetails, setOrderDetails] = useState();
  const [isOpenOrderDetails, setIsOpenOrderDetails] = useState(orders.map((_) => false));
  const [orderIndex, setOrderIndex] = useState(null);
  const onOpenOrderDetails = (index, id) => {
    setIsOpenOrders(false)
    setIsOpenOrderDetails(prev => {
      const newValue = prev.map((_, i) => i === index);
      return newValue;
    });
    setOrderDetails(orders.filter(order => order.serialNumber === id))
    setOrderIndex(index)
  }
  const onCloseOrderDetails = () => {
    setIsOpenOrders(true)
    setIsOpenOrderDetails(orders.map((_) => false));
    setOrderDetails();
    setOrderIndex(null);
  }
  const [isOpenConnection, setIsOpenConnection] = useState(false);
  const onOpenConnection = () => {
    setIsOpenConnection(p=>!p)
    setIsOpenBasket(false)
  }
  const [isOpenForgetPass, setIsOpenForgetPass] = useState(false);
  const onOpenForgetPass = () => {
    setIsOpenForgetPass(true)
    setIsOpenConnection(false)
  }
  const [isOpenAccount, setIsOpenAccount] = useState(false);
  const onOpenAccount = () => {
    setIsOpenAccount(true)
    setIsOpenConnection(false);
  }
  const [isOpenChangeInfo, setIsOpenChangeInfo] = useState(false);
  const onOpenChangeInfo = () => {
      setIsOpenChangeInfo(true)
      setIsOpenAccount(false)
  }
  const [isOpenChangePass, setIsOpenChangePass] = useState(false);
  const onOpenChangePass = () => {
    setIsOpenChangePass(true)
    setIsOpenAccount(false)
  }
  return (
    <BrowserRouter>
      <div className="App">
        <div className='nav'>
          <ShopNavBar
            onOpenBasket={onOpenBasket} isOpenBasket={isOpenBasket}
            onOpenMenu={onOpenMenu} isOpenForgetPass={isOpenForgetPass}
            onOpenConn={onOpenConnection} isOpenConn={isOpenConnection}
            isOpenAccount={isOpenAccount} isOpenChangeInfo={isOpenChangeInfo}
            isOpenChangePass={isOpenChangePass}
          />
        </div>
        {
          (
            isOpenBasket ||
            isOpenConnection ||
            isOpenForgetPass ||
            isOpenAccount ||
            isOpenChangeInfo ||
            isOpenChangePass ||
            (isOpenFirstStep && (window.visualViewport.width < 430)) ||
            (isOpenSecondStep && (window.visualViewport.width < 430)) ||
            (isOpenThirdStep && (window.visualViewport.width < 430)) ||
            (isOpenFilter && (window.visualViewport.width < 430)) ||
            (isOpenMenu && (window.visualViewport.width < 430)) ||
            (isOpenOrders && (window.visualViewport.width < 430)) ||
            (isOpenOrderDetails[orderIndex] && (window.visualViewport.width < 430))
          ) &&
          <div className="basket-container">
            {
              isOpenBasket &&
              <Basket
                onClose={() => setIsOpenBasket(false)}
                onOpen={onOpenFirstStep}
              />
            }
            {
              isOpenFirstStep && (window.visualViewport.width < 430) &&
              <FirstStep onClose={() => { setIsOpenFirstStep(false); setIsOpenBasket(true) }} onOpen={onOpenSecondStep} />
            }
            {
              isOpenSecondStep && (window.visualViewport.width < 430) &&
              <SecondStep onClose={() => { setIsOpenSecondStep(false); setIsOpenFirstStep(true) }} onOpen={onOpenThirdStep} />
            }
            {
              isOpenThirdStep && (window.visualViewport.width < 430) &&
              <ThirdStep onClose={() => { setIsOpenThirdStep(false); setIsOpenSecondStep(true) }} />
            }

            {
              isOpenFilter && (window.visualViewport.width < 430) &&
              <Filter onClose={() => { setIsOpenFilter(false) }} />
            }
            {
              isOpenMenu && (window.visualViewport.width < 430) &&
              <Menu onClose={() => { setIsOpenMenu(false) }} onOpenOrders={onOpenOrders} />
            }
            {
              isOpenOrders && (window.visualViewport.width < 430) &&
              <Orders orders={orders}
                onClose={() => { setIsOpenOrders(false); setIsOpenMenu(true) }}
                onOpenDetails={onOpenOrderDetails}
              />
            }
            {
              isOpenOrderDetails[orderIndex] && (window.visualViewport.width < 430) &&
              <OrderDetails orderDetails={orderDetails} onClose={onCloseOrderDetails} />
            }
            {
              isOpenConnection &&
              <Connection
                onClose={() => setIsOpenConnection(false)}
                onOpenFogetPass={onOpenForgetPass}
                onOpenAccount={onOpenAccount}
              />
            }
            {
              isOpenForgetPass &&
              <ForgetPass onClose={() => { setIsOpenForgetPass(false); setIsOpenConnection(true) }} />
            }
            {
              isOpenAccount &&
              <Account onClose={() => { setIsOpenAccount(false) }} onOpenChnageInfo={onOpenChangeInfo} onOpenChangePass={onOpenChangePass} />
            }
            {
              isOpenChangeInfo &&
              <ChangeInfo onClose={() => { setIsOpenChangeInfo(false); setIsOpenAccount(true) }} />
            }
            {
              isOpenChangePass &&
              <ChangePass onClose={()=>{ setIsOpenChangePass(false); setIsOpenAccount(true)}} />
            }
          </div>
        }
        {
          (isOpenFirstStep || isOpenSecondStep || isOpenThirdStep) && window.visualViewport.width > 430
            ?
            (
              (isOpenThirdStep ?
                <ThirdStep onClose={() => { setIsOpenThirdStep(false); setIsOpenSecondStep(true) }} /> :
                (
                  isOpenSecondStep ?
                    <SecondStep onClose={() => { setIsOpenSecondStep(false); setIsOpenFirstStep(true) }} onOpen={onOpenThirdStep} />
                    :
                    <FirstStep onClose={() => { setIsOpenFirstStep(false); setIsOpenBasket(true) }} onOpen={onOpenSecondStep} />
                ))
            )
            :
            <Routes>
              <Route path='/' element={
                <Shop
                  onOpen={onOpenFilter}
                  onClose={() => { setIsOpenFilter(false) }}
                  isOpenFilter={isOpenFilter}
                />
              } />
              <Route path='/boutique/product' element={
                <div className='one-product-container' >
                  <OneProduct />
                </div>
              } />
              {
                window.visualViewport.width > 430
                &&
                <Route path='/orders' element={
                  <div className='orders-container'>
                    <Orders orders={orders}
                      onOpenDetails={onOpenOrderDetails}
                    />
                  </div>} />
              }
              {
                window.visualViewport.width > 430
                &&
                <Route path='/order' element={
                  <div className='order-container'>
                    <OrderDetails orderDetails={orderDetails}
                    />
                  </div>} />
              }
              {
                window.visualViewport.width > 430
                &&
                <Route path='/signup' element={
                  <CreateAccount
                    onOpenLogIn={() => { setIsOpenConnection(true) }} />
                } />
              }
              {
                window.visualViewport.width > 430
                &&
                <Route path='/verify-email' element={
                  <VerifyEmail
                    onOpenLogIn={() => { setIsOpenConnection(true) }} />
                } />
              }
              {
                window.visualViewport.width > 430
                &&
                <Route path='/change-password' element={
                  <ChangePassword
                    onOpenLogIn={() => { setIsOpenConnection(true) }} />
                } />
              }
              {
                window.visualViewport.width > 430
                &&
                <Route path='/contact' element={
                  <Contact />
                } />
              }
            </Routes>
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
