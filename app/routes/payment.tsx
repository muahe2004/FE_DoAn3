import { Link } from "react-router-dom";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import Button from "~/components/Button";

import "../styles/payment.css";


export default function Payment() {

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const input = event.target;
    const formErr = input.parentElement?.querySelector(".payment-form__text") as HTMLElement | null;

    const isValid = input.value.trim() !== "";

    if (formErr) {
      formErr.style.opacity = isValid ?  "0" : "1";
    }

    input.style.borderColor = isValid ? "#fff" : "red"; 
  }

  return (
    <div className="payment-wrapper">
      <Header title="Nạp tiền"></Header>      
      <div className="payment-inner">
        <form action="" className="payment-form">
          <div className="payment-form__inner">
            <div className="payment-form__group">
              <label htmlFor="money" className="payment-form__label">Nhập số tiền cần nạp</label>
              <input name="money" type="number" className="payment-form__input" onBlur={handleBlur}/>
              <span className="payment-form__text">Vui lòng nhập số tiền cần nạp</span>
            </div>

            <div className="payment-form__action"> 
              <Button type="submit" className="btn-add">Thanh toán</Button>
            </div>
          </div>
        </form>
      </div>

      <Footer className = 'payment-footer'></Footer>
    </div>
    
  );
}
