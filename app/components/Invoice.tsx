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
        <span className="invoices-element">3.000.000vnd</span>
      </div>

      <div className="invoices-type">
        <span className="invoices-element">Momo E-Wallet</span>
      </div>

      <div className="invoices-status">
        <span className="invoices-element">Hoàn thành</span>
      </div>

      <div className="invoices-date">
        <span className="invoices-element">28 May 2024</span>
      </div>

      
    </div>
  );
};

export default Invoice;
