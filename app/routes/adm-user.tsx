import { useEffect, useRef, useState } from "react";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";

import "../styles/Admin/adm-user.css";
import { Link } from "react-router";

interface Users {
    maNguoiDung: string;
    tenNguoiDung: string;
    email: string;
    soDu: number;
    anhDaiDien: string;
    loaiNguoiDung: string;
}

export default function Analytics() {

    const [users, setUsers] = useState<Users []>([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
            method: "GET",
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Lỗi khi lấy người dùng: ", error));
    }, [])

    // Tìm kiếm
    const [inputValue, setInputValue] = useState("");
    const [searchResult, setSearchResult] = useState<Users []>([]);

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
    <div className="adm-user__wrapper">
        <Header className="header-admin" title="Quản lý người dùng" />
        <AdminNav />

        <div className="adm-user__inner">
            {/* Thanh tìm kiếm */}
            <div className="adm-user__search">
                <img className="adm-user__icon" src="/icons/Search.svg" alt="" />
                <input 
                    className="adm-user__input" 
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setShowResult(true)}
                />

                {/* Ô tìm kiếm */}
                <section ref={resultRef} className={`search-result__admin ${showResult && inputValue.trim() ? "show" : ""}`}>
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
                                    <Link to={``}
                                        // key={item.maKhoaHoc}
                                        className="search-result__item">
                                        <div className="search-result__thumb">
                                            {/* <img src={item.hinhAnh} alt="" className="search-result__image" /> */}
                                        </div>
                                        <div>
                                            {/* <span className="search-result__name">{item.tenKhoaHoc}</span> */}
                                        </div>
                                    </Link>
                                )
                            )
                        )}
                    </div>
                </section>
        
            </div>

            {/* head */}
            <div className="adm-user__head">
                <div className="user-head__title user-head__ID">
                    <span>UID</span>
                </div>

                <div className="user-head__title user-head__avatar">
                    <span>AVT</span>
                </div>

                <div className="user-head__title user-head__name">
                    <span>TÊN NGƯỜI DÙNG</span>
                </div>

                <div className="user-head__title user-head__email">
                    <span>EMAIL</span>
                </div>

                <div className="user-head__title user-head__role">
                    <span>LOẠI</span>
                </div>

                <div className="user-head__title user-head__balance">
                    <span>SỐ DƯ</span>
                </div>
            </div>

            <div className="adm-user__list">

                {
                    users.map((user) => (
                        <div className="user-list__item">
                            <div className="list-item__info list-item__ID">
                                <span>{user.maNguoiDung}</span>
                            </div>

                            <div className="list-item__info list-item__avatar">
                                <span>
                                    <img className="list-item__img" src={user.anhDaiDien} alt="" />
                                </span>
                            </div>

                            <div className="list-item__info list-item__name">
                                <span>{user.tenNguoiDung}</span>
                            </div>

                            <div className="list-item__info list-item__email">
                                <span>{user.email}</span>
                            </div>

                            <div className={`list-item__info list-item__role ${user.loaiNguoiDung === "Admin" ? "admin-role" : ""}`}>
                                <span>{user.loaiNguoiDung}</span>
                            </div>


                            <div className="list-item__info list-item__balance">
                                <span>{user.soDu}</span>
                            </div>
                        </div>
                    ))
                }

                
            </div>
      </div>
    </div>
  );
}
