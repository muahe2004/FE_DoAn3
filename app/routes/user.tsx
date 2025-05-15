import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import Course from "~/components/Course";
import Button from "~/components/Button";

import "../styles/user.css";

interface RegisteredCourse {
    maKhoaHoc: string;
    tenKhoaHoc: string;
    hinhAnh: string;
    trangThai: string;
}

interface CourseProps {
    maKhoaHoc: string; 
    tenKhoaHoc: string;
    giaBan: string;
    children: React.ReactNode; 
    hinhAnh: string;
    doKho: string;
    tongSoBaiHoc: number;
}


export default function User() {
    const [myCourses, setMyCourses] = useState<RegisteredCourse []>([]);

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

    const [tenNguoiDung, setTenNguoiDung] = useState("User name");
    const [email, setEmail] = useState("User email");
    const [anhDaiDien, setAnhDaiDien] = useState(`${import.meta.env.VITE_API_URL}/uploads/defaultAvatar.png`);

    useEffect(() => {
        const myInfo = localStorage.getItem("userInfo");
        if (!myInfo) {
            console.log("Không tìm thấy thông tin người dùng trong localStorage.");
            return;
        } 

        const userInfo = JSON.parse(myInfo);
        setAnhDaiDien(userInfo.anhDaiDien);
        setTenNguoiDung(userInfo.tenNguoiDung);
        setEmail(userInfo.email);
    }, []);

    const [soDu, setSoDu] = useState(0);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/balance`, { 
            method: "GET",
            credentials: "include",
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Lỗi khi lấy số dư: " + res.statusText);
            }
            return res.json();
        })
        .then((data) => {
            const soDuMoi = parseFloat(data.soDu);
            setSoDu(soDuMoi);
        })
        .catch((error) => {
            console.error("Lỗi khi gọi API:", error);
        });
    }, []);
    

    
    return (
        
        <div className="user-wrapper">
        <Header title="Trang cá nhân"></Header>
        <Navbar></Navbar>


        <div className="user-inner">
            <div className="user-inner__info">
                <div className="inner-info__avatar">
                    <img src={`${import.meta.env.VITE_API_URL}/uploads/defaultAvatar.png`} alt="" className="inner-info__image" />
                </div>

                <div className="inner-info__box">
                    <span className="inner-info__name">{tenNguoiDung}</span>
                    <span className="inner-info__email" title="lyvanminh280504@gmail.com">{email}</span>

                    <div className="inner-info__group">
                        <img src="./icons/Money-check.svg" alt="" className="inner-info__icon" />
                        <span className="inner-info__title">Số dư:</span>
                        <span className="inner-info__number">{soDu.toLocaleString("vi-VN") || 0} ₫</span>
                        <Button to="/payment" className="inner-info__deposit">Nạp tiền</Button>
                    </div>

                    <div className="inner-info__group">
                        <img src="./icons/Github.svg" alt="" className="inner-info__icon" />
                        <span className="inner-info__title">
                            <a href="https://github.com/muahe2004" target="_blank" rel="noopener noreferrer">
                                muahe2004
                            </a>
                        </span>
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
                        <div className="inner-courses__item">
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
