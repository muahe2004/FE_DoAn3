import { Link } from "react-router-dom";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";

import "../styles/invoices-page.css"
import "../styles/Admin/admin.css"

import Invoice from "~/components/Invoice";
import { useEffect, useRef, useState } from "react";
import { useGetInvoicesByUserIdQuery } from "~/services/apiInvoices";


import type { invoices } from "../types/invoices";
import type { Users } from "../types/user";
import SearchEngine from "~/components/Search-engine";
import Pagination from "~/components/Pagination";


export default function Invoices() {

  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState<any []>([]);

  const [firstCall, setFirstCall] = useState(true);
  const [totalPages, setTotalPages] = useState(1);;

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [showResult, setShowResult] = useState(false);

  // call api tìm kiếm
  useEffect(() => {
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

  // Call api = redux
  const getUserId = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
      return userInfo?.maNguoiDung || null;
    } catch {
      return null;
    }
  };

  const maNguoiNap = typeof window !== "undefined" ? getUserId() : null;

  const { data, isLoading, error } = useGetInvoicesByUserIdQuery({
    maNguoiNap,
    page,
    pageSize,
    count: firstCall,
  });

  // Sau lần gọi đầu, tắt count
  useEffect(() => {
    if (firstCall && data?.pagination?.totalPages) {
      setFirstCall(false);
      console.log(data);
      setTotalPages(data.pagination.totalPages);
    }
  }, [data, firstCall]);

  const handlePageChange = (newPage: number) => { setPage(newPage); };
  // const goToItem = (item: any) => { navigate(`/admin-course-details/${item.maKhoaHoc}`); }; // Sửa thành sang trang chi tiết người dùng

  // Tìm kiếm hóa đơn (chưa hoàn thiện)
  const handleSearch = (query: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/search-nguoi-dung/${query}`)
      .then((res) => {
        if (!res.ok) { throw new Error("Lỗi khi gọi API tìm kiếm"); }
        return res.json();
      })
      .then((resData: Users[]) => {
        if (Array.isArray(resData)) {
          setSearchResult(resData);
        } else {
          setSearchResult([]);
      }
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setSearchResult([]);
      });
  };

  return (
    <div>
      <Header className="header-admin" title="Hóa đơn nạp"></Header>
      <Navbar></Navbar>
      <SearchEngine
        placeholder="Tìm kiếm hóa đơn nạp..."
        getData={handleSearch}
        data={searchResult}
        renderItem={(item) => (
        <div
            className="search-engine__item"
            key={item.maNguoiDung}
            // onClick={() => goToItem(item)}
        >
            <div className="search-engine__thumb">
            <img
              src={item.anhDaiDien || "/images/COURSE.png"}
              alt={item.tenNguoiDung}
              className="search-engine__image"
            />
            </div>
            <div>
            <span className="search-engine__name">{item.tenNguoiDung}</span>
            </div>
        </div>
        )}
      />

      <Pagination totalPages={totalPages} onPageChange={(page) => handlePageChange(page)} />

      <div className="invoices-page">

        

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
          {data && data.invoicesData.map((invoice: invoices) => (
            <Invoice
              maHoaDon={invoice.maHoaDon}
              maNguoiDung={invoice.maNguoiDung}
              soTien={invoice.soTien}
              phuongThucNap={invoice.phuongThucNap}
              trangThai={invoice.trangThai}
              createdAt={invoice.createdAt}
            ></Invoice>
          ))}
        </div>
      </div>       
    </div>
  );
}
