import { useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from "react-router-dom"

import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";
import Course from "~/components/Course";

import "../styles/home.css";
import "../styles/Responsive/home.css";
import Button from "~/components/Button";
import axios from "axios";

import type { userInfo } from '../types/userInfo';
import type { courses } from '../types/courses';

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
  const navigate = useNavigate();
  // Khóa học có phí
  const [listFeeCourse, setListFeeCourse] = useState<courses[]>([]);
  // Khóa học miễn phí
  const [listFreeCourses, setListFreeCourse] = useState<courses[]>([]);
  // Tìm kiếm
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState<courses []>([]);
  // Click ngoài thì phải đóng tìm kiếm
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [showResult, setShowResult] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  // lay so du
  const [userInfo, setUserInfo] = useState<userInfo | any>(null);
  const [soDu, setSoDu] = useState(0);

  // Lấy thông tin người dùng 
  const handleDataFromChild = (data: userInfo) => { 
    console.log(data);
    setUserInfo(data); };

  // Lấy số dư của người dùng
  const handleBalanceFromChild = (balance: number) => { setSoDu(balance); };

  // khoá học miễn phí
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/courses/get-home-fee-courses`)
      .then((res) => res.json())
      .then((data) => {
        setListFeeCourse(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // khoá học có phjis
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/courses/get-home-no-fee-courses`)
      .then((res) => res.json())
      .then((data) => {
        setListFreeCourse(data);
      })
      .catch((err) => {
        console.log("Lỗi: ", err);
      })
  }, []);

  // xử lý input tìm kiếm
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, "");
    
    setInputValue(sanitizedValue);
  };

  // call api tìm kiếm
  useEffect(() => {
    if (!inputValue.trim()) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/courses/search/${inputValue}`)
      .then((res) => {
          if (!res.ok) {
              console.log("Lỗi khi tìm kiếm");
          }
          return res.json();
      })
      .then((data) => {
          setSearchResult(data);
          console.log("Kết quả:", searchResult);
      });
  }, [inputValue]);

  // chọn khoá học
  const handleCourseClick = (maKhoaHoc: String) => {
    const myCourses = localStorage.getItem("myCourses");

    if (myCourses) {
      const listCourses = JSON.parse(myCourses);

      const courseExists = listCourses.some((course: { maKhoaHoc: string }) => course.maKhoaHoc === maKhoaHoc);

      if (courseExists) {
        navigate(`/learning/${maKhoaHoc}`);
      } else {
        navigate(`/courses/course-details/${maKhoaHoc}`);
      }
    } else {
      console.log("No courses found in localStorage");
      navigate(`/courses/course-details/${maKhoaHoc}`);
    }
  };
  
  // handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultRef.current &&
        !resultRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResult(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đóng mở actions
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleOpenActions = () => {
    setIsMenuVisible(true);
  }

  const actionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutsideActions = (event: MouseEvent) => {
        if (
            actionsRef.current &&
            !actionsRef.current.contains(event.target as Node)
        ) {
            setIsMenuVisible(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutsideActions);

    return () => {
        document.removeEventListener("mousedown", handleClickOutsideActions);
    };
  }, []);
  
  // Đăng xuất
  const handleLogout = async () => {
    console.log("Đăng xuất");

    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
            withCredentials: true
        });

        localStorage.removeItem("userInfo"); 
        localStorage.removeItem("myCourses");
        localStorage.removeItem("lastSelectedLecture");
        localStorage.removeItem("chatHistory");

        navigate("/");
        setRole(null);
        setIsMenuVisible(false);
        setUserInfo(null);
    } catch (error) {
        console.error("Lỗi khi logout:", error);
    }
  }

  return (
    <div className="home-Wrapper">
      <Header 
        sendDataToParent={handleDataFromChild} 
        sendBalanceToParent={handleBalanceFromChild}  
        title="Học lập trình" />
      <Navbar></Navbar>

      {/* video show */}
      <div className="video-show">

        {/* Head */}
        <div className="show-header">
          <h1 className="header-logo">
              <Link to="/">
                <img className="header-image" src="/images/ML.jpg" alt="MLearning Logo" />
              </Link>
          </h1>

          <ul className="show-header__list">
            <li className="show-header__item"><Link to="/">Về chúng tôi</Link></li>
            <li className="show-header__item"><Link to="/roadmap">Lộ trình</Link></li>
            <li className="show-header__item"><Link to="/all-courses">Khoá học</Link></li>
            <li className="show-header__item"><Link to="/">Bài viết</Link></li>
            <li className="show-header__item"><Link to="/">Hỏi đáp</Link></li>
          </ul>

          <div className="show-header__search">
            <img className="show-header__icon" src="/icons/Search_white.svg" alt="" />
            <input 
              className="header-input show-header__input" 
              ref={inputRef}
              type="text"
              placeholder="Tìm khóa học..."
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setShowResult(true)}
            />

            {/* Ô tìm kiếm */}
            <section ref={resultRef} className={`search-result show-search__result ${showResult && inputValue.trim() ? "show" : ""}`}>
                <div className="search-result__inner">
                    <div className="search-result__head">
                        <span className="search-result__inner--title">Kết quả cho: "{inputValue}"</span>
                        <span onClick={() => setShowResult(false)} className="search-result__inner--close">
                            <img className="search-result__icon" src="/icons/Close.svg" alt="" />
                        </span>
                    </div>
                    {
                        searchResult.length === 0 ? (
                            <p className="no-res">Không tìm thấy kết quả cho: "{inputValue}"</p>
                        ) : (
                            searchResult.map((item) => (
                                <div
                                    key={item.maKhoaHoc}
                                    onClick={() => handleCourseClick(item.maKhoaHoc)}
                                    className="search-result__item">
                                    <div className="search-result__thumb">
                                        <img src={item.hinhAnh} alt="" className="search-result__image" />
                                    </div>
                                    <div>
                                        <span className="search-result__name">{item.tenKhoaHoc}</span>
                                    </div>
                                </div>
                            )
                        )
                    )}
                </div>
            </section>
          </div>

          {/* phần avt */}
          {
            userInfo ? (
              <div className="show-header__container">
                  <div className="" onClick={handleOpenActions}>
                    <img src={userInfo.anhDaiDien} alt="" className="header-avatar" />
                  </div>
              </div>
            ) : (
              <div className="show-header__container">
                  <Button className="header-btn show-btn__login" to="/login">Đăng nhập</Button>
              </div>
            )
          }
        </div>
        
        {/* Video */}
        <video autoPlay muted loop>
          <source src="./videos/vid.mp4" type="video/mp4" />
        </video>

        <div className="video-show__overlay"></div>

        <div className="show-content">
          <h2 className="show-title">Chào mừng đến với MLearning</h2>
          <p className="show-desc">Chúng tôi đặt mục tiêu trở thành một công ty công nghệ giáo dục hàng đầu thế giới, 
            giúp thế giới giải quyết các vấn đề phức tạp thông qua sự hợp tác bền vững giữa doanh nghiệp, công nghệ và xã hội.
          </p>
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

      {/* Actions */}
      {
          isMenuVisible && (
              <div className="header-action" ref={actionsRef}>
                  <div className="header-action__info">
                      <img src={userInfo.anhDaiDien} alt="" className="header-action__avatar" />
                      <div className="header-action__box">
                          <span className="header-action__name">{userInfo.tenNguoiDung}</span>
                          <span className="header-action__mail">@{userInfo.email.split("@")[0]}</span>
                          <span className="header-action__desc">SD: </span>
                          <span className="header-action__balance">{soDu.toLocaleString("vi-VN")} ₫</span> 
                      </div>
                  </div>

                  <div className="header-action__row">
                      <span className="header-action__item">
                          <Link className="header-action__link" to={role ? (role === "Admin" ? "/admin" : "/user") : "/login"}>
                              {role === "Admin" ? "Trang quản trị" : "Trang cá nhân"}
                          </Link>
                      </span>
                  </div>

                  <div className="header-action__row header-action__row--courses">
                      <span className="header-action__item">
                          <Link className="header-action__link" to="/my-courses">Khóa học của tôi</Link>
                      </span>
                  </div>

                  <div className="header-action__row">
                      <span className="header-action__item">
                          <Link className="header-action__link" to="/payment">Nạp tiền</Link>
                      </span>
                  </div>

                  <div className="header-action__row">
                      <span className="header-action__item header-action__item--pd">
                          <Link className="header-action__link" to="/blog">Viết blog</Link>
                      </span>
                      <span className="header-action__item header-action__item--pd">
                          <Link className="header-action__link" to="">Bài viết của tôi</Link>
                      </span>
                      <span className="header-action__item">
                          <Link className="header-action__link" to="">Bài viết đã lưu</Link>
                      </span>
                  </div>

                  <div className="header-action__row">
                      <span className="header-action__item header-action__item--pd">
                          <Link className="header-action__link" to="">Cài đặt</Link>
                      </span>
                      <span className="header-action__item">
                          <button className="header-action__link" onClick={handleLogout}>Đăng xuất</button>
                      </span>
                  </div>
              </div>
          )
      }
      
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