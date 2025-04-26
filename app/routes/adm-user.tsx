import { useEffect, useState } from "react";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";

import "../styles/Admin/adm-user.css";

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
        fetch(`http://localhost:1000/api/users`, {
            method: "GET",
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Lỗi khi lấy người dùng: ", error));
    }, [])
  
      
  return (
    <div className="adm-user__wrapper">
        <Header title="Quản lý người dùng" />
        <AdminNav />

        <div className="adm-user__inner">
            {/* Thanh tìm kiếm */}
            <div className="adm-user__search">
                <img className="adm-user__icon" src="/icons/Search.svg" alt="" />
                <input 
                    className="adm-user__input" 
                    // ref={inputRef}
                    type="text"
                    placeholder="Tìm khóa học..."
                    // value={inputValue}
                    //   onChange={(e) => setInputValue(e.target.value)}
                    //   onFocus={() => setShowResult(true)}
                />

                
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
