import "./contact.scss";
import { PiArrowLeft, PiArrowRightBold } from "react-icons/pi";
import Card from "../Components/Card";

export default function Contact() {
    const motive = [{ title: "Motive", options: ["Payement", "Delivery", "Account", "Other"] }]
    const handleHomeRedirect = () => {
        window.location.href = "/"; 
      };
    return (
        <div className="contact">
            <div className="contact-container">
                <div className="header">
                    <p onClick={handleHomeRedirect}>
                        Home {">"}
                        <span>contact</span>
                    </p>
                    <div className="back" onClick={handleHomeRedirect}>
                        <PiArrowLeft />
                        <p>Back to products</p>
                    </div>
                </div>
                <div className="body">
                    <div className="form">
                        <p>Contact us</p>
                        <form action="">
                            <div className="inputs-container">
                                <Card options={motive} />
                                <input type="text" placeholder="Email" />
                                <textarea name="message" id="message" placeholder="Message" />
                            </div>
                            <button>
                                <p>Send message</p>
                                <PiArrowRightBold size={"16px"} />
                            </button>
                        </form>
                    </div>
                    <div className="contact-info">
                        <p>Our Contact Information</p>
                        <div className="info-container">
                            <label htmlFor="">Phone number</label>
                            <div className="info">
                                <p>+33 12 34 56 78</p>
                                <p>+33 12 34 56 78</p>
                            </div>
                        </div>
                        <div className="info-container">
                            <label htmlFor="">Email</label>
                            <div className="info email">
                                <p>contact@dikafood.com</p>
                            </div>
                        </div>
                        <div className="info-container">
                            <label htmlFor="">Address</label>
                            <div className="info address">
                                <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
