import { useEffect, useState } from "react";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";

import { useNavigate } from "react-router";
import SearchEngine from "~/components/Search-engine";
import Pagination from "~/components/Pagination";

import "../styles/Admin/adm-user.css";

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

interface ApiUsersResponse {
  usersData: Users[];
  pagination?: {
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
  };
}

export default function Analytics() {

    const [users, setUsers] = useState<Users []>([]);
    const [firstCall, setFirstCall] = useState(true);
    const [totalPages, setTotalPages] = useState(1);;

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

    // Lấy người dùng
    const fetchUsers = ( page: number, firstCall: boolean, setFirstCall: React.Dispatch<React.SetStateAction<boolean>> ) => {
        const url = new URL(`${import.meta.env.VITE_API_URL}/api/users`);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('pageSize', '7');
    
        if (firstCall) {
          url.searchParams.append('count', 'true');
        }
    
        fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then((data: ApiUsersResponse) => {
                setUsers(data.usersData || []);
                
                if (firstCall && data.pagination?.totalPages) {
                setTotalPages(data.pagination.totalPages);
                setFirstCall(false);
                }
            })
            .catch((error) => console.error('Lỗi khi lấy khóa học:', error));
    };
    
    useEffect(() => {
        fetchUsers(1, firstCall, setFirstCall);
    }, []);
    
    const onPageChange = (page: number) => {
        fetchUsers(page, firstCall, setFirstCall);
    };
    

    // Tìm kiếm
    const [searchResult, setSearchResult] = useState<Users[]>([]);

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

    const navigate = useNavigate();
    const goToItem = (item: any) => { navigate(`/admin-course-details/${item.maKhoaHoc}`); }; // Sửa thành sang trang chi tiết người dùng
      
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
                    key={item.maNguoiDung}
                    onClick={() => goToItem(item)}
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
            <Pagination totalPages={totalPages} onPageChange={(page) => onPageChange(page)} />

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
