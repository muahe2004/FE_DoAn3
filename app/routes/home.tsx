import { useEffect, useRef, useState } from "react";
import "../styles/home.css";

import { Link } from "react-router-dom"
import Header from "~/components/Header";
import Footer from "~/components/Footer";
{/* <link rel="stylesheet" href="/src/styles/home.css" /> */}

import Button from "~/components/Button";
import Navbar from "~/components/Navbar";

import Course from "~/components/Course";
// import "../styles/course.css";

export default function Home() {

  const slideRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 3; // Số lượng slide

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 3000); // Chuyển slide mỗi 3.5 giây

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const courses = document.querySelectorAll(".course");

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           entry.target.classList.add("show");
  //         }
  //       });
  //     },
  //     { threshold: 0.3 } // Kích hoạt khi 20% phần tử xuất hiện
  //   );

  //   courses.forEach((course) => observer.observe(course));

  //   return () => {
  //     courses.forEach((course) => observer.unobserve(course));
  //   };
  // }, []);

  return (
    <div className="home-Wrapper">
      <Header title="Học lập trình" />
      <Navbar></Navbar>

      {/* Slide show */}
      <div className="slide-show">
        <div 
          className="slide-show__inner"
          ref={slideRef}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }} // Dịch chuyển slide
        >
          <div className="slide-show__item">
            <img className="slide-show__image" src="./public/images/HTML_CSS.png" alt="HTML & CSS" />
          </div>
          <div className="slide-show__item">
            <img className="slide-show__image" src="./public/images/JS.png" alt="JavaScript" />
          </div>
          <div className="slide-show__item">
            <img className="slide-show__image" src="./public/images/Sass.png" alt="Sass" />
          </div>
        </div>
      </div>

      {/* Khóa học Pro  */}
      <section className="courses-container">
        <h2 className="container-title">Khóa học Pro</h2>
        <div className="list-courses">
          <Course 
            maKhoaHoc="KH001"
            tenKhoaHoc="Javascript cơ bản" 
            giaBan="499.000"
            hinhAnh="https://files.fullstack.edu.vn/f8-prod/courses/19/66aa28194b52b.png"
            children=""
          ></Course>

          <Course 
            maKhoaHoc="KH002"
            tenKhoaHoc="HTML CSS cơ bản" 
            giaBan="499.000"
            hinhAnh="https://files.fullstack.edu.vn/f8-prod/courses/15/62f13d2424a47.png"
            children=""
          ></Course>

          <Course 
            maKhoaHoc="KH003"
            tenKhoaHoc="Ngôn ngữ Sass" 
            giaBan="499.000"
            hinhAnh="https://files.fullstack.edu.vn/f8-prod/courses/27/64e184ee5d7a2.png"
            children=""
          ></Course>

          <Course 
            maKhoaHoc="KH004"
            tenKhoaHoc="NodeJS cơ bản" 
            giaBan="499.000"
            hinhAnh="https://files.fullstack.edu.vn/f8-prod/courses/6.png"
            children=""
          ></Course>
        </div>
      </section>

      {/* Khóa học Free  */}
      <section className="courses-container">
        <h2 className="container-title">Khóa học miễn phí</h2>
        <div className="list-courses">
          <Course 
            maKhoaHoc="KH001"
            tenKhoaHoc="Kiến thức nền tảng" 
            giaBan="0"
            hinhAnh="https://files.fullstack.edu.vn/f8-prod/courses/7.png"
            children=""
          ></Course>

          <Course 
            maKhoaHoc="KH002"
            tenKhoaHoc="C++ cơ bản" 
            giaBan="0"
            hinhAnh="https://files.fullstack.edu.vn/f8-prod/courses/21/63e1bcbaed1dd.png"
            children=""
          ></Course>

          <Course 
            maKhoaHoc="KH003"
            tenKhoaHoc="Responsive Web Design" 
            giaBan="0"
            hinhAnh="https://files.fullstack.edu.vn/f8-prod/courses/3.png"
            children=""
          ></Course>

          <Course 
            maKhoaHoc="KH004"
            tenKhoaHoc="Ubuntu và Terminal" 
            giaBan="0"
            hinhAnh="https://files.fullstack.edu.vn/f8-prod/courses/14/624faac11d109.png"
            children=""
          ></Course>
        </div>
      </section>

      {/* Cắt web =)) */}
      <section className="why-container">
        <div className="why-hero">
          {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, maiores?</p> */}
          <div className="why-images">
            <img className="why-img img-first" src="./public/images/Code1.png" alt="" />
            <img className="why-img img-second" src="./public/images/Code2.png" alt="" />
            <img className="why-img img-third" src="./public/images/Code3.png" alt="" />
          </div>

          <div className="why-content">
            <p className="why-title">
              Vì sao MLearning là nền tảng học lập trình <br />
              <span className="why-top">HÀNG ĐẦU TẠI VIỆT NAM ?</span>
            </p>

            <p className="why-desc">Đa dạng khóa học lập trình: Python, Java Script, C++, SQL,...</p>

            <p className="why-desc">
              Học viên được code và chấm điểm trực tiếp trên web, 
              đánh giá chính xác năng lực hiện tại của mình.
            </p>

            <p className="why-desc">
              Đội ngủ giảng viên tận tâm, uy tín...
            </p>

            <p className="why-desc">
              Hình thức học tập đa dạng, thú vị.
            </p>
          </div>
        </div>
      </section>

      {/* Tính năng  */}
      <section className="home-container">
        <h2 className="container-title container-title__second">Nền tảng <span className="title-focus">ĐA DẠNG TÍNH NĂNG</span></h2>
        <div className="container-list">
          <div className="container-item">
            <Link to="" className="container-link">HỌC TẬP</Link>
          </div>
          <div className="container-item">
            <Link to="" className="container-link">LUYỆN TẬP</Link>
          </div>
          <div className="container-item">
            <Link to="" className="container-link">THI ĐẤU</Link>
          </div>
          <div className="container-item">
            <Link to="" className="container-link">ĐÁNH GIÁ</Link>
          </div>
          <div className="container-item">
            <Link to="" className="container-link">THẢO LUẬN</Link>
          </div>
          <div className="container-item">
            <Link to="" className="container-link">XẾP HẠNG</Link>
          </div>
        </div>
      </section>

      {/* More info */}
      <section className="home-container moreInfo-container">
        <h2 className="container-title moreInfo-title">MLearning</h2>
        <p className="container-desc">
          MLearning với nền tảng học trực tuyến nhiều tính năng đã thu hút hơn 1.000.000 học viên trên toàn cầu, 
          hơn 200.000 chứng chỉ được trao, con số này ngày một tăng, 
          khẳng định giá trị mà chương trình học của chúng tôi mang lại.</p>
        <div className="container-list moreInfo-list">
          <div className="moreInfo-item">
            <span className="moreInfo-number">1,000,000+</span>
            <span className="moreInfo-note">Học viên</span>
          </div>

          <div className="moreInfo-item">
            <span className="moreInfo-number">300+</span>
            <span className="moreInfo-note">Cuộc thi lập trình</span>
          </div>

          <div className="moreInfo-item">
            <span className="moreInfo-number">200,000+</span>
            <span className="moreInfo-note">Chứng chỉ được trao</span>
          </div>

          <div className="moreInfo-item">
            <span className="moreInfo-number">25+</span>
            <span className="moreInfo-note">Quốc gia đang sử dụng</span>
          </div>
        </div>
      </section>

      <Footer title=""></Footer>
    </div>
  );
}
