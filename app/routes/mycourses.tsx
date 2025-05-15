import { Link } from "react-router-dom";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import { useEffect, useState } from "react";


import "../styles/my-courses.css";
import "../styles/Responsive/my-courses.css";

interface RegisteredCourse {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  hinhAnh: string;
  trangThai: string;
}

export default function MyCourses() {

  const [myCourses, setMyCourses] = useState<RegisteredCourse []>([]);

  useEffect(() => {
    const listCourses = localStorage.getItem("myCourses");

    if (!listCourses) {
      setMyCourses([]);
    } else {
      setMyCourses(JSON.parse(listCourses));
    }
  }, [])

  return (
    <div className="my-courses__wrapper">
      <Header title="Khóa học của tôi"></Header>
      <Navbar></Navbar>

      <div className="my-courses__inner">

        {
          myCourses.map((course) => (
            <Link to={`/learning/${course.maKhoaHoc}`} className="courses-card" key={course.maKhoaHoc}>
              <div className="courses-card__thumb">
                <img src={course.hinhAnh} alt="" className="courses-card__image" />
              </div>
              <div className="courses-card__content">
                <span className="courses-card__name">{course.tenKhoaHoc}</span>
              </div>
            </Link>
          ))
        }
      </div>
      <Footer></Footer>
    </div>
    
  );
}
