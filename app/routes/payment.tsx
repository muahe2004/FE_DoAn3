import { Link } from "react-router-dom";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import Button from "~/components/Button";

import "../styles/payment.css";
import "../styles/Responsive/payment.css";



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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const moneyInput = form.querySelector<HTMLInputElement>('input[name="money"]');
    const formErr = moneyInput?.parentElement?.querySelector(".payment-form__text") as HTMLElement | null;

    const moenyValue = moneyInput?.value.trim()

    if (!moenyValue || parseInt(moenyValue) === 0) {
      if (formErr) formErr.style.opacity = "1";
      if (moneyInput) moneyInput.style.borderColor = "red";
      return;
    }

    const payLoad = {
      amount: moenyValue,
      orderInfo: "Nạp tiền tại MLearning với Momo"
    }

    try {
      const res = await fetch('http://localhost:1000/payment', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payLoad),
        credentials: 'include'  // Bắt buộc để gửi cookie
      });

      const data = await res.json();

      console.log(data);

      if (data) {
        window.location.href = data.payUrl;
      } else {
        console.error("Không nhận được đường dẫn thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu thanh toán:", error);
    }
  }

  return (
    <div className="payment-wrapper">
      <Header title="Nạp tiền"></Header>      
      <div className="payment-inner">
        <form onSubmit={handleSubmit} action="" className="payment-form">
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
