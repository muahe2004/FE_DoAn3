import { Link } from "react-router-dom";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";

import "../styles/my-courses.css";

const fakeMyCourses = [
  {
    "maKhoaHoc": "KH101",
    "tenKhoaHoc": "Khóa học AI cơ bản",
    "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
    "trangThai": "Đã hoàn thành"
  },
  {
    "maKhoaHoc": "KH102",
    "tenKhoaHoc": "Thiết kế UI/UX cho người mới",
    "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
    "trangThai": "Đang học"
  },
  {
    "maKhoaHoc": "KH103",
    "tenKhoaHoc": "Lập trình Python nâng cao",
    "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
    "trangThai": "Chưa học"
  },
  {
    "maKhoaHoc": "KH104",
    "tenKhoaHoc": "Tạo ứng dụng mobile với Flutter",
    "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
    "trangThai": "Đang học"
  },
  {
    "maKhoaHoc": "KH103",
    "tenKhoaHoc": "Lập trình Python nâng cao",
    "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
    "trangThai": "Chưa học"
  },
  {
    "maKhoaHoc": "KH104",
    "tenKhoaHoc": "Tạo ứng dụng mobile với Flutter",
    "hinhAnh": "http://localhost:1000/uploads/COURSE.png",
    "trangThai": "Đang học"
  }
]



export default function MyCourses() {
  return (
    <div className="my-courses__wrapper">
      <Header title="Khóa học của tôi"></Header>
      <Navbar></Navbar>

      <div className="my-courses__inner">

        {
          fakeMyCourses.map((course) => (
            <div className="courses-card">
              <div className="courses-card__thumb">
                <img src={course.hinhAnh} alt="" className="courses-card__image" />
              </div>
              <div className="courses-card__content">
                <span className="courses-card__name">{course.tenKhoaHoc}</span>
              </div>
            </div>
          ))
        }

        

        

      </div>

      
      {/* <Footer></Footer> */}
      
    </div>
    
  );
}
