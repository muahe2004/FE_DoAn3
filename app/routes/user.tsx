import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import Course from "~/components/Course";

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

const fakeMyCourses = 
[
    {
        "maKhoaHoc": "KH007",
        "tenKhoaHoc": "Khóa học free 1",
        "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
        "trangThai": "Đang học"
    },
    {
        "maKhoaHoc": "KH002",
        "tenKhoaHoc": "Lập trình Javascrips cơ bản",
        "hinhAnh": "https://i.ytimg.com/vi/0SJE9dYdpps/hq720.jpg?sqp=-…RUAAIhCGAE=&rs=AOn4CLDraNz0ai0WgtO490tuckzG631flg",
        "trangThai": "Đang học"
    },
    {
        "maKhoaHoc": "KH007",
        "tenKhoaHoc": "Khóa học free 1",
        "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
        "trangThai": "Đang học"
    },
    {
        "maKhoaHoc": "KH002",
        "tenKhoaHoc": "Lập trình Javascrips cơ bản",
        "hinhAnh": "https://i.ytimg.com/vi/0SJE9dYdpps/hq720.jpg?sqp=-…RUAAIhCGAE=&rs=AOn4CLDraNz0ai0WgtO490tuckzG631flg",
        "trangThai": "Đang học"
    },
    {
        "maKhoaHoc": "KH007",
        "tenKhoaHoc": "Khóa học free 1",
        "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
        "trangThai": "Đang học"
    },
    {
        "maKhoaHoc": "KH002",
        "tenKhoaHoc": "Lập trình Javascrips cơ bản",
        "hinhAnh": "https://i.ytimg.com/vi/0SJE9dYdpps/hq720.jpg?sqp=-…RUAAIhCGAE=&rs=AOn4CLDraNz0ai0WgtO490tuckzG631flg",
        "trangThai": "Đang học"
    },
    {
        "maKhoaHoc": "KH007",
        "tenKhoaHoc": "Khóa học free 1",
        "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
        "trangThai": "Đang học"
    }
];


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
    
    return (
        
        <div className="user-wrapper">
        <Header title="Trang cá nhân"></Header>
        <Navbar></Navbar>


        <div className="user-inner">
            <div className="user-inner__info">
                <div className="inner-info__avatar">
                    <img src="http://localhost:1000/uploads/defaultAvatar.png" alt="" className="inner-info__image" />
                </div>

                <div className="inner-info__box">
                    <span className="inner-info__name">Nguyễn Thị Thảo My </span>
                    <span className="inner-info__email" title="lyvanminh280504@gmail.com">lyvanminh280504@gmail.com</span>
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
