import { Link } from "react-router-dom";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import Button from "~/components/Button";
import { useEffect, useState } from "react";

import "../styles/all-courses.css";
import Course from "~/components/Course";

interface Courses {
    maKhoaHoc: string;
    tenKhoaHoc: string;
    moTaKhoaHoc: string;
    hinhAnh: string;
    doKho: string;
    giaBan: number;
    tongSoBaiHoc: number;
  }
  

export default function AllCourses() {

    const [courses, setCourses] = useState<Courses []>([]);
    useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL}/api/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setCourses(data.data);
        })
        .catch((err) => {
          console.log("Lỗi: ", err);
        });
    }, []);


  return (
    <div className="all-courses__wrapper">
      <Header title="Khóa học"></Header>  
      <Navbar></Navbar>

      <div className="all-courses__inner">

        {
          courses.map((course) => (
            <Course 
                className="all-courses__card"
                key={course.maKhoaHoc}
                maKhoaHoc={course.maKhoaHoc}
                tenKhoaHoc={course.tenKhoaHoc}
                giaBan={Number(course.giaBan)}
                hinhAnh={course.hinhAnh}
                doKho={course.doKho}
                children=""
                tongSoBaiHoc={course.tongSoBaiHoc}
            ></Course>
          ))
        }
      </div>    
      

      <Footer></Footer>
    </div>
  );
}
