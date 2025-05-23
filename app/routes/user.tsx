import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import Course from "~/components/Course";
import Button from "~/components/Button";

import "../styles/user.css";

import type { userInfo } from '../types/userInfo';

interface RegisteredCourse {
    maKhoaHoc: string;
    tenKhoaHoc: string;
    hinhAnh: string;
    trangThai: string;
}

export default function User() {
    const [myCourses, setMyCourses] = useState<RegisteredCourse []>([]);
    const [userInfo, setUserInfo] = useState<userInfo | any>(null);
    const [soDu, setSoDu] = useState(0);

    // Lấy ra khóa học đã đăng ký
    useEffect(() => {
        const myCourse = localStorage.getItem("myCourses");
        if (myCourse) {
            try {
                setMyCourses(JSON.parse(myCourse));
            } catch (error) {
                console.error("Lỗi khi parse myCourses:", error);
                setMyCourses([]); // fallback nếu lỗi
            }
        }
    }, []);

    // Lấy thông tin người dùng 
    const handleDataFromChild = (data: userInfo) => { setUserInfo(data); };

    // Lấy số dư của người dùng
    const handleBalanceFromChild = (balance: number) => { setSoDu(balance); };

    return (
        
        <div className="user-wrapper">
        <Header 
            sendDataToParent={handleDataFromChild} 
            sendBalanceToParent={handleBalanceFromChild} 
            title="Trang cá nhân"></Header>
        <Navbar></Navbar>


        <div className="user-inner">
            <div className="user-inner__info">
                <div className="inner-info__avatar">
                    <img src={`${import.meta.env.VITE_API_URL}/uploads/defaultAvatar.png`} alt="" className="inner-info__image" />
                </div>

                <div className="inner-info__box">
                    <span className="inner-info__name">{userInfo?.tenNguoiDung}</span>
                    <span className="inner-info__email" title="lyvanminh280504@gmail.com">{userInfo?.email}</span>

                    <div className="inner-info__group">
                        <img src="./icons/Money-check.svg" alt="" className="inner-info__icon" />
                        <span className="inner-info__title">Số dư:</span>
                        <span className="inner-info__number">{soDu.toLocaleString("vi-VN") || 0} ₫</span>
                        <Button to="/payment" className="inner-info__deposit">Nạp tiền</Button>
                    </div>

                    <div className="inner-info__group">
                        <img src="./icons/Github.svg" alt="" className="inner-info__icon" />
                        <span className="inner-info__title">
                            <a
                                href={userInfo?.github ? `https://github.com/${userInfo?.github}` : "https://github.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                >
                                {userInfo?.github || "https://github.com"}
                            </a>
                        </span>
                    </div>

                    <div className="inner-info__group">
                        <img src="./icons/Phone.svg" alt="" className="inner-info__icon" />
                        <span className="inner-info__title">
                            <a
                                href={userInfo?.soDienThoai ? `https://zalo.me/${userInfo?.soDienThoai}` : "https://zalo.me"}
                                target="_blank"
                                rel="noopener noreferrer"
                                >
                                {userInfo?.soDienThoai || "+84"}
                            </a>
                        </span>
                    </div>

                    <div className="inner-info__group">
                        <img src="./icons/History.svg" alt="" className="inner-info__icon" />
                        <Button to="/invoices" className="inner-info__history">Lịch sử nạp tiền</Button>
                    </div>
                </div>
            </div>

            <div className="user-inner__features">
                <div className="user-inner__head">
                    <img src="/icons/Code.svg" alt="" className="user-inner__icon" />
                    <h2 className="user-inner__title">Các khóa học đã đăng ký</h2>
                </div>
                <div className="user-inner__courses">
                    {myCourses.map((course) => (
                        <div className="inner-courses__item"  key={course.maKhoaHoc}>
                            <div className="inner-courses__thumb">
                                <img src={course.hinhAnh} alt="" className="inner-courses__image" />
                            </div>

                            <div className="inner-course__content">
                                <span className="inner-course__name">{course.tenKhoaHoc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <Footer></Footer>
        </div>
  );
}
