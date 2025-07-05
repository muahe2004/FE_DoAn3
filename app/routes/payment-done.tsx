import Button from "~/components/Button";
import "../styles/payment-done.css";

export default function PaymentDone() {
  return (
    <div className="payment-success-wrapper">
      <div className="payment-success-card">
        <div className="checkmark-circle">
          <img src="./icons/Check-white.svg" alt="Success" />
        </div>
        <h2 className="payment-success-title">Thanh toán thành công!</h2>

        <div className="payment-success-actions">
          <Button className="payment-success-btn" to="/all-courses">Xem khóa học</Button>
          <Button className="payment-success-btn button-secondary" to="/">Về trang chủ</Button>
        </div>
      </div>
    </div>
  );
}
