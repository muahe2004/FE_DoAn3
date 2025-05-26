import { useEffect, useRef, useState } from "react";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";

import "../styles/Admin/adm-user.css";
import { Link, useNavigate } from "react-router";
import SearchEngine from "~/components/Search-engine";
import type { courses } from "~/types/courses";
import Pagination from "~/components/Pagination";

interface Users {
    maNguoiDung: string;
    tenNguoiDung: string;
    email: string;
    soDu: number;
    anhDaiDien: string;
    loaiNguoiDung: string;
    soDienThoai: string;
    github: string;
}

export default function Analytics() {

    const [users, setUsers] = useState<Users []>([]);

    useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: "GET",
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data)) {
                setUsers(data);
            } else if (Array.isArray(data.users)) {
                setUsers(data.users);
            } else {
                setUsers([]); 
            }
        })
        .catch((error) => {
            console.error("Lỗi khi lấy người dùng: ", error);
            setUsers([]); 
        });
}, []);


    

    // Tìm kiếm
      const [searchResult, setSearchResult] = useState<courses[]>([]);
    
      const handleSearch = (query: string) => {
        fetch(`${import.meta.env.VITE_API_URL}/api/courses/search/${query}`)
          .then((res) => {
            if (!res.ok) { throw new Error("Lỗi khi gọi API tìm kiếm"); }
            return res.json();
          })
          .then((resData: courses[]) => {
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

      const navigate = useNavigate();
  const goToItem = (item: any) => { navigate(`/admin-course-details/${item.maKhoaHoc}`); };
      
  return (
    <div className="adm-user__wrapper">
        <Header className="header-admin" title="Quản lý người dùng" />
        <AdminNav />
        <SearchEngine
            placeholder="Tìm kiếm người dùng..."
            getData={handleSearch}
            data={searchResult}
            renderItem={(item) => (
            <div
                className="search-engine__item"
                key={item.maKhoaHoc}
                onClick={() => goToItem(item)}
            >
                <div className="search-engine__thumb">
                <img
                    src={item.hinhAnh || "/images/COURSE.png"}
                    alt={item.tenKhoaHoc}
                    className="search-engine__image"
                />
                </div>
                <div>
                <span className="search-engine__name">{item.tenKhoaHoc}</span>
                </div>
            </div>
            )}
        />
        <Pagination></Pagination>

        <div className="adm-user__inner">
            

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
