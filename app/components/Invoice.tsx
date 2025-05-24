import { Link, useNavigate } from "react-router-dom";
import "../styles/invoice.css";

import type { invoices } from "../types/invoices";


const Invoice: React.FC<invoices> = ({maHoaDon, maNguoiDung, soTien, phuongThucNap, trangThai, ghiChu, updatedAt, createdAt, className}) => {
  return (
    <div key={maHoaDon} className={`invoices ${className || ""}`}>
      <div className="invoices-id">
        <span className="invoices-element">MOMO1747734087724</span>
      </div>
      
      <div className="invoices-amount">
        <span className="invoices-element">
          {Number(soTien).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
        </span>
      </div>

      <div className="invoices-type">
        <span className="invoices-element invoices-element__type" >
          {phuongThucNap === "Momo E-Wallet" && (
            <img
            className="invoices-element__icon"
              src="./icons/MoMo.svg" 
              alt="Momo"
              style={{ width: "24px", height: "24px" }}
            />
          )}
          {phuongThucNap}
        </span>
      </div>

      <div className="invoices-status">
        <span
          className={`invoices-element invoice-element__status ${
            trangThai === "Thành công"
              ? "status-done"
              : trangThai === "Đang xử lý"
              ? "status-in-process"
              : trangThai === "Lỗi"
              ? "status-error"
              : ""
          }`}
        >
          {trangThai}
        </span>
      </div>

      <div className="invoices-date">
        <span className="invoices-element">{new Date(createdAt).toLocaleDateString()}</span>
      </div>

      
    </div>
  );
};

export default Invoice;
