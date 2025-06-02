import { useEffect, useRef, useState } from "react";
import { data, Link } from "react-router-dom"

import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import Course from "~/components/Course";

import "../styles/home.css";
import "../styles/Responsive/home.css";

interface KhoaHoc {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  moTaKhoaHoc: string;
  hinhAnh: string;
  doKho: string;
  giaBan: number;
  tongSoBaiHoc: number;
}

const mockDataFee = [
  {
      "maKhoaHoc": "KH001",
      "tenKhoaHoc": "Javascript Pro",
      "moTaKhoaHoc": "Khóa học JavaScript Cơ Bản giúp bạn làm quen và nắm vững nền tảng ngôn ngữ lập trình JavaScript – công cụ không thể thiếu trong phát triển web hiện đại. Thông qua các bài học trực quan, bạn sẽ từng bước hiểu được cách JavaScript hoạt động, cách viết mã hiệu quả và áp dụng vào các dự án thực tế.",
      "hinhAnh": "http://localhost:1000/uploads/javascript.png",
      "doKho": "Dễ",
      "giaBan": "500000.00",
      "maGiangVien": "ND001",
      "tenNguoiDung": "MLearning",
      "anhDaiDien": "http://localhost:1000/uploads/defaultAvatar.png",
      "soLuongDangKy": 0,
      "tongSoBaiHoc": 0
  },
  {
      "maKhoaHoc": "KH002",
      "tenKhoaHoc": "HTML - CSS Pro",
      "moTaKhoaHoc": "Xây dụng websites tĩnh với HTML và CSS cơ bản",
      "hinhAnh": "http://localhost:1000/uploads/HTMLCSS.png",
      "doKho": "Dễ",
      "giaBan": "200000.00",
      "maGiangVien": "ND001",
      "tenNguoiDung": "MLearning",
      "anhDaiDien": "http://localhost:1000/uploads/defaultAvatar.png",
      "soLuongDangKy": 0,
      "tongSoBaiHoc": 0
  },
  {
      "maKhoaHoc": "KH004",
      "tenKhoaHoc": "Node.js",
      "moTaKhoaHoc": "Học về Node.js cơ bản",
      "hinhAnh": "http://localhost:1000/uploads/Nodejs.png",
      "doKho": "Trung bình",
      "giaBan": "300000.00",
      "maGiangVien": "ND001",
      "tenNguoiDung": "MLearning",
      "anhDaiDien": "http://localhost:1000/uploads/defaultAvatar.png",
      "soLuongDangKy": 0,
      "tongSoBaiHoc": 0
  },
  {
      "maKhoaHoc": "KH005",
      "tenKhoaHoc": "React.js",
      "moTaKhoaHoc": "Học về React.js cơ bản",
      "hinhAnh": "http://localhost:1000/uploads/Reactjs.png",
      "doKho": "Khó",
      "giaBan": "300000.00",
      "maGiangVien": "ND001",
      "tenNguoiDung": "MLearning",
      "anhDaiDien": "http://localhost:1000/uploads/defaultAvatar.png",
      "soLuongDangKy": 0,
      "tongSoBaiHoc": 0
  }
]

const mockDataFree = [
  {
      "maKhoaHoc": "KH006",
      "tenKhoaHoc": "C++ cơ bản",
      "moTaKhoaHoc": "Học lập trình C++ cơ bản",
      "hinhAnh": "http://localhost:1000/uploads/Cpp.png",
      "doKho": "Dễ",
      "giaBan": "0.00",
      "maGiangVien": "ND001",
      "tenNguoiDung": "MLearning",
      "anhDaiDien": "http://localhost:1000/uploads/defaultAvatar.png",
      "soLuongDangKy": 0,
      "tongSoBaiHoc": 0
  },
  {
      "maKhoaHoc": "KH007",
      "tenKhoaHoc": "Kiến thức nhập môn IT",
      "moTaKhoaHoc": "Học những kiến thức cơ bản về nhập môn IT",
      "hinhAnh": "http://localhost:1000/uploads/Nhapmon.png",
      "doKho": "Dễ",
      "giaBan": "0.00",
      "maGiangVien": "ND001",
      "tenNguoiDung": "MLearning",
      "anhDaiDien": "http://localhost:1000/uploads/defaultAvatar.png",
      "soLuongDangKy": 0,
      "tongSoBaiHoc": 0
  },
  {
      "maKhoaHoc": "KH008",
      "tenKhoaHoc": "Responsive web design",
      "moTaKhoaHoc": "Responsive web design với grid system 12 column",
      "hinhAnh": "http://localhost:1000/uploads/Responsive.png",
      "doKho": "Trung bình",
      "giaBan": "0.00",
      "maGiangVien": "ND001",
      "tenNguoiDung": "MLearning",
      "anhDaiDien": "http://localhost:1000/uploads/defaultAvatar.png",
      "soLuongDangKy": 0,
      "tongSoBaiHoc": 0
  },
  {
      "maKhoaHoc": "KH009",
      "tenKhoaHoc": "WSL Ubuntu",
      "moTaKhoaHoc": "Cơ bản về WSL Ubuntu",
      "hinhAnh": "http://localhost:1000/uploads/Ubuntu.png",
      "doKho": "Trung bình",
      "giaBan": "0.00",
      "maGiangVien": "ND001",
      "tenNguoiDung": "MLearning",
      "anhDaiDien": "http://localhost:1000/uploads/defaultAvatar.png",
      "soLuongDangKy": 0,
      "tongSoBaiHoc": 0
  }
]

export default function Home() {

  const slideRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 3; 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  
// Khóa học có phí
  const [listFeeCourse, setListFeeCourse] = useState<KhoaHoc[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/courses/get-home-fee-courses`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setListFeeCourse(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Khóa học miễn phí
  const [listFreeCourses, setListFreeCourse] = useState<KhoaHoc[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/courses/get-home-no-fee-courses`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setListFreeCourse(data);
      })
      .catch((err) => {
        console.log("Lỗi: ", err);
      })
  }, []);

  return (
    <div className="home-Wrapper">
      <Header title="Học lập trình" />
      <Navbar></Navbar>

      {/* Slide show */}
      <div className="slide-show">
        <div 
          className="slide-show__inner"
          ref={slideRef}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }} 
        >
          <div className="slide-show__item">
            <img className="slide-show__image" src="./public/images/slidea.jpg" alt="HTML & CSS" />
          </div>
          <div className="slide-show__item">
            <img className="slide-show__image" src="./public/images/learning.jpg" alt="JavaScript" />
          </div>
          <div className="slide-show__item">
            <img className="slide-show__image" src="./public/images/blue.jpg" alt="Sass" />
          </div>
        </div>
      </div>

      {/* Khóa học Pro  */}
      <section className="courses-container">
        <h2 className="container-title">Khóa học Pro</h2>
        <div className="list-courses">
          {(listFeeCourse.length > 0 ? listFeeCourse : mockDataFee).map((khoaHoc) => (
            <Course 
              key={khoaHoc.maKhoaHoc}
              maKhoaHoc={khoaHoc.maKhoaHoc}
              tenKhoaHoc={khoaHoc.tenKhoaHoc}
              giaBan={Number(khoaHoc.giaBan)}
              hinhAnh={khoaHoc.hinhAnh}
              doKho={khoaHoc.doKho}
              children=""
              tongSoBaiHoc={khoaHoc.tongSoBaiHoc}
            />
          ))}
        </div>
      </section>

      {/* Khóa học Free  */}
      <section className="courses-container">
        <h2 className="container-title">Khóa học miễn phí</h2>
        <div className="list-courses">
          {(listFreeCourses.length > 0 ? listFreeCourses : mockDataFree).map((khoaHoc) => (
            <Course 
              key={khoaHoc.maKhoaHoc}
              maKhoaHoc={khoaHoc.maKhoaHoc}
              tenKhoaHoc={khoaHoc.tenKhoaHoc}
              giaBan={Number(khoaHoc.giaBan)}
              hinhAnh={khoaHoc.hinhAnh}
              doKho={khoaHoc.doKho}
              children=""
              tongSoBaiHoc={khoaHoc.tongSoBaiHoc}
            />
          ))}
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

            <p className="why-desc">Đa dạng khóa học lập trình: Python, JavaScript, C++, SQL,...</p>

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
      
      <Footer></Footer>
    </div>
  );
}
/*

                  _ooOoo_
                o8888888o
                88" . "88
                (| -_- |)
                O\  =  /O
              ____/`---'\____
            .'  \\|     |//  `.
          /  \\|||  :  |||//  \
          /  _||||| -:- |||||-  \
          |   | \\\  -  /// |   |
          | \_|  ''\---/''  |_/ |
          \  .-\__  `-`  ___/-. /
        ___`. .'  /--.--\  `. .'___
    ."" '<  `.___\_<|>_/___.' >' "".
    / | :  `- \`.;`\ _ /`;.`/ - ` : | \
    \  \ `-.   \_ __\ /__ _/   .-` /  /
  ======`-.____`-.___\_____/___.-`____.-'======
                   `=---='

         ~~~~~~~~~~~~~~~~~~~~~~~~~~
             PHẬT PHÁP VÔ BIÊN
            TÂM AN VẠN SỰ AN 🙏
*/