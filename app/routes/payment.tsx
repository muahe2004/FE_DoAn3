import { useState } from "react";

import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Button from "~/components/Button";

import "../styles/payment.css";
import "../styles/Responsive/payment.css";

export default function Payment() {

  const [amount, setAmount] = useState(0);
  const amounts = [10000, 20000, 50000, 100000, 200000, 500000];

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const input = event.target;
    const formErr = input.parentElement?.querySelector(".payment-form__text") as HTMLElement | null;
    const value = amount;

    console.log(value);

    let isValid = true;

    if (value.toString() === "") {
      if (formErr) formErr.textContent = "Vui lòng chọn hoặc nhập số tiền";
      isValid = false;
    } else if (amount < 10000) {
      if (formErr) formErr.textContent = "Số tiền tối thiểu là 10.000 VNĐ";
      isValid = false;
    }

    if (formErr) {
      formErr.style.opacity = isValid ? "0" : "1";
    }

    input.style.borderColor = isValid ? "#ccc" : "red";

    if (isValid) {
      setAmount(parseInt(value.toString(), 10));
    }
  };

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
        credentials: 'include'  
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
        {/* Phương thức thanh toán */}
        <div className="payment-method">
          <div className="method-item method-item__focus">
            <img className="method-img" src="./images/momo.png" alt="" />
          </div>

          <div className="method-item">
            <img className="method-img" src="./images/shopeepay.png" alt="" />
          </div>

          <div className="method-item">
            <img className="method-img" src="./images/paypal.png" alt="" />
          </div>

          <div className="method-item">
            <img className="method-img" src="./images/qrpay.png" alt="" />
          </div>

          <div className="method-item">
            <img className="method-img" src="./images/banking.png" alt="" />
          </div>

          <div className="method-item">
            <img className="method-img" src="./images/visa-marter.png" alt="" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} action="" className="payment-form">
          {/* Chọn số tiền */}
          <div className="payment-form__select">
            <label htmlFor="money" className="payment-form__label">Chọn số tiền cần nạp</label>

            <ul className="form-select__list">
              {amounts.map((item, index) => (
                <li
                  key={index}
                  className={`form-select__amount ${amount === item ? "active" : ""}`}
                  onClick={() => {
                    setAmount(item);

                    const input = document.querySelector("input[name='money']") as HTMLInputElement;
                    const formErr = input?.parentElement?.querySelector(".payment-form__text") as HTMLElement | null;

                    if (formErr) {
                      formErr.style.opacity = "0";
                    }

                    if (input) {
                      input.style.borderColor = "#ccc";
                    }
                  }}
                >
                  {item.toLocaleString()} VND
                </li>
              ))}
            </ul>
          </div>

          {/* Nhập số tiền */}
          <div className="payment-form__inner">
            <div className="payment-form__group">
              <label htmlFor="money" className="payment-form__label">Nhập số tiền cần nạp</label>
              <input 
                name="money" type="number" 
                className="payment-form__input" 
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                onBlur={handleBlur}/>
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
