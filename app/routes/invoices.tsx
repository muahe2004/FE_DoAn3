import { Link } from "react-router-dom";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";

import "../styles/invoices-page.css"
import "../styles/Admin/admin.css"

import Invoice from "~/components/Invoice";
import { useEffect, useRef, useState } from "react";


export default function Invoices() {

  // Tìm kiếm
    const [inputValue, setInputValue] = useState("");
    const [searchResult, setSearchResult] = useState<CourseProps []>([]);
  
    useEffect(() => {
        // Không gọi API nếu rỗng hoặc toàn khoảng trắng
        if (!inputValue.trim()) return;
  
        fetch(`${import.meta.env.VITE_API_URL}/api/courses/${inputValue}`)
            .then((res) => {
                if (!res.ok) {
                    console.log("Lỗi khi tìm kiếm");
                }
                return res.json();
            })
            .then((data) => {
                setSearchResult(data);
                console.log("Kết quả:", searchResult);
            });
    }, [inputValue]);
  
    // Click ngoài thì phải đóng tìm kiếm
    const inputRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const [showResult, setShowResult] = useState(false);
  
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            resultRef.current &&
            !resultRef.current.contains(event.target as Node) &&
            inputRef.current &&
            !inputRef.current.contains(event.target as Node)
          ) {
            setShowResult(false);
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
  return (
    <div>
      <Header className="header-admin" title="Hóa đơn nạp"></Header>
      <Navbar></Navbar>

      <div className="invoices-page">

        <div className="invoices__search">
          <img className="list-course-icon" src="/icons/Search.svg" alt="" />
          <input 
            className="list-course-input" 
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm hóa đơn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowResult(true)}
          />

          {/* Ô tìm kiếm */}
          {/* <section ref={resultRef} className={`search-result__admin ${showResult && inputValue.trim() ? "show" : ""}`}>
            <div className="search-result__inner">
                <div className="search-result__head">
                    <span className="search-result__inner--title">Kết quả cho: "{inputValue}"</span>
                    <span onClick={() => setShowResult(false)} className="search-result__inner--close">
                        <img className="search-result__icon" src="/icons/Close.svg" alt="" />
                    </span>
                </div>
                {
                    searchResult.length === 0 ? (
                        <p className="no-res">Không tìm thấy kết quả cho: "{inputValue}"</p>
                    ) : (
                        searchResult.map((item) => (
                            <Link to={`/admin-course-details/${item.maKhoaHoc}`}
                                key={item.maKhoaHoc}
                                className="search-result__item">
                                <div className="search-result__thumb">
                                    <img src={item.hinhAnh} alt="" className="search-result__image" />
                                </div>
                                <div>
                                    <span className="search-result__name">{item.tenKhoaHoc}</span>
                                </div>
                            </Link>
                        )
                    )
                )}
            </div>
          </section> */}
        </div>

        {/* Phần head */}
        <div className="invoices-page__head">
          
          <div className="invoices-id">
            <span>Mã hóa đơn</span>
          </div>

          <div className="invoices-amount">
            <span>Số tiền nạp</span>
          </div>

          <div className="invoices-type">
            <span>Phương thức</span>
          </div>

          <div className="invoices-status">
            <span>Trạng thái</span>
          </div>

          <div className="invoices-date">
            <span>Ngày nạp</span>
          </div>
        </div>
        
        <div className="invoices-page__inner">
            <Invoice
              maHoaDon="HD0001"
              maNguoiDung="ND0001"
              soTien="1000"
              phuongThucNap="Momo"
              trangThai="Done"
            ></Invoice>

            <Invoice
              maHoaDon="HD0001"
              maNguoiDung="ND0001"
              soTien="1000"
              phuongThucNap="Momo"
              trangThai="Done"
            ></Invoice>
        </div>
        
      </div> 

      <Footer></Footer>
      
    </div>
    
  );
}
