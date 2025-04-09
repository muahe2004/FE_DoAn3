import Button from "~/components/Button";

import "../styles/payment-done.css";


export default function PaymentDone() {
  return (
    <div className="payment-done__wrapper">
      {/* <Header title="Nạp tiền"></Header>       */}
      <div className="payment-done__inner">
        <div className="payment-done__box">
          <img className="payment-done__icon" src="./icons/Check-white.svg" alt="" />
        </div>

        <h2 className="payment-done__thanks">Cảm ơn bạn đã thanh toán</h2>

        <p className="payment-done__desc payment-done__desc--bold">Thực hiện thanh toán thành công!</p>

        <p className="payment-done__desc">Đăng ký khóa học tại MLearning ngay bây giờ!</p>

        <div className="payment-done__action">
          <Button className="payment-done__btn" to="/">Khóa học</Button>
          <Button className="payment-done__btn" to="/">Trang chủ</Button>
        </div>
      </div>

      {/* <Footer className = 'payment-done__footer'></Footer> */}
    </div>
  );
}

