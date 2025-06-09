import { data, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Button from "./Button";
import axios from "axios";
import "../styles/header.css";
import "../styles/Responsive/Components/header.css";

import type { userInfo } from '../types/userInfo';

interface HeaderProps {
    title: string;
    className?: string; 
    sendDataToParent?: (data: userInfo) => void;
    sendBalanceToParent?: (balance: number) => void;
}

interface RegisteredCourse {
    maKhoaHoc: string;
    tenKhoaHoc: string;
    hinhAnh: string;
    trangThai: string;
}

const Header: React.FC<HeaderProps> = ({ title, className, sendDataToParent, sendBalanceToParent }) => {
    const navigate = useNavigate();

    const [showHeader, setShowHeader] = useState(false);

    useEffect(() => {
        // Nếu k phải trang chủ thì k cần ẩn
        if (location.pathname !== '/') {
            setShowHeader(true);
            return;
        };

        const handleScroll = () => {
            const halfScreenHeight = window.innerHeight / 2;
            setShowHeader(window.scrollY >= halfScreenHeight);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // cleanup
    }, []);

    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/role`, { 
            method: "GET",
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            setRole(data.role);  
            // console.log(role);
        })
        .catch((err) => console.error("Lỗi:", err));
    }, []);

    // Khóa học của tôi
    const [listRegisteredCourse, setListRegisteredCourse] = useState<RegisteredCourse []>([]);
    const [isClient, setIsClient] = useState(false); 
    const [userInfoReady, setUserInfoReady] = useState(false);

    const [anhDaiDien, setAnhDaiDien] = useState(`${import.meta.env.VITE_API_URL}/uploads/defaultAvatar.png`);
    const [tenNguoiDung, setTenNguoiDung] = useState("Student");
    const [email, setEmail] = useState("Student@gmail.com");

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchGoogleUserInfo = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth-google/get-user-info`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!res.ok) {
                    console.log("Chưa đăng nhập hoặc token không hợp lệ");
                    return;
                }

                const data = await res.json();
                localStorage.setItem("userInfo", JSON.stringify(data));

                // Báo hiệu đã có user info
                setUserInfoReady(true);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin người dùng Google:", err);
            }
        };

        fetchGoogleUserInfo();
    }, []);

    useEffect(() => {
        if (!isClient || !userInfoReady) return;

        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            console.log("Không tìm thấy thông tin người dùng trong localStorage.");
            return;
        }

        const userInfo = JSON.parse(userInfoStr);
        const maNguoiDung = userInfo.maNguoiDung;

        // console.log(userInfo);
        sendDataToParent?.(userInfo);

        setIsLogin(true);
        setAnhDaiDien(userInfo.anhDaiDien);
        setTenNguoiDung(userInfo.tenNguoiDung);
        setEmail(userInfo.email);

        fetch(`${import.meta.env.VITE_API_URL}/api/courses/registered/${maNguoiDung}`)
            .then((res) => res.json())
            .then((data) => {
                setListRegisteredCourse(data);
                localStorage.setItem("myCourses", JSON.stringify(data));
            })
            .catch((err) => {
                console.log("Lỗi khi lấy danh sách khóa học:", err);
            });
    }, [isClient, userInfoReady]);


    // Đóng mở courses
    const [isCourseVisible, setIsCourseVisible] = useState(false); 

    const handleOpenMycourses = () => {
        setIsCourseVisible(true);
    }

    const courseRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (courseRef.current && !courseRef.current.contains(event.target as Node)) {
                setIsCourseVisible(false);
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
            setIsLogin(false);
        } catch (error) {
            console.error("Lỗi khi logout:", error);
        }
    }

    const [isLogin, setIsLogin] = useState(false);

    // lay so du
    const [soDu, setSoDu] = useState(0);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/balance`, { 
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
            sendBalanceToParent?.(soDuMoi); 
        })
        .catch((error) => {
            console.error("Lỗi khi gọi API:", error);
        });
    }, []);

    // Tìm kiếm
    const [inputValue, setInputValue] = useState("");
    const [searchResult, setSearchResult] = useState<RegisteredCourse []>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Loại bỏ ký tự đặc biệt (chỉ giữ chữ cái, số và khoảng trắng)
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, "");

        setInputValue(sanitizedValue);
    };

    useEffect(() => {
        if (!inputValue.trim()) return;

        fetch(`${import.meta.env.VITE_API_URL}/api/courses/search/${encodeURIComponent(inputValue)}`)
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
    
    // Click ngoài thì phải đóng tìm kiếm
    const inputRef = useRef<HTMLInputElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const [showResult, setShowResult] = useState(false);

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
      
    return (
        <header className={`header ${showHeader ? 'show' : ''} ${className || ''}`}>
            <div className="header-wrapper">
                <h1 className="header-logo">
                    <Link to="/">
                        <img className="header-image" src="/images/ML.jpg" alt="MLearning Logo" />
                    </Link>
                    <span className="header-title">
                        {title}
                    </span>
                </h1>

                <div className="header-search ">
                    <img className="header-icon" src="/icons/Search.svg" alt="" />
                    <input 
                        className="header-input" 
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm khóa học..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setShowResult(true)}
                    />

                    {/* Ô tìm kiếm */}
                    <section ref={resultRef} className={`search-result ${showResult && inputValue.trim() ? "show" : ""}`}>
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

                {
                    isLogin ? (
                        <div className="header-container">
                            <div className="header-menu">
                                <button className="header-button" type="button" onClick={handleOpenMycourses}>Khóa học của tôi</button>
                            </div>
                            <img className="header-notify" src="/icons/Bell-ring.svg" alt="" />

                            <div className="" onClick={handleOpenActions}>
                                <img src={anhDaiDien} alt="" className="header-avatar" />
                            </div>
                        </div>
                    ) : (
                        <div className="header-container header-container__logout">
                            <Button className="button-secondary header-btn header-btn__register" to="/register">Đăng ký</Button>
                            <Button className="header-btn header-btn__login" to="/login">Đăng nhập</Button>
                        </div>
                    )
                }
            </div>

            {/* Danh sách khóa học đã đăng ký */}
            {
                isCourseVisible && (
                    <section className={`my-course ${isCourseVisible ? "visible" : ""}`} ref={courseRef}>
                        <Link to="/my-courses" className="my-course__more">Xem tất cả</Link>
                        <div className="my-course__content">
                            {listRegisteredCourse.map((course) => (
                                <Link to={`/learning/${course.maKhoaHoc}`} className="my-course__item" key={course.maKhoaHoc}>
                                    <img src={course.hinhAnh} alt="" className="my-course__image" />
                                    <div className="my-course__box">
                                        <span className="my-course__name">{course.tenKhoaHoc}</span>
                                        <span className="my-course__status">{course.trangThai}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                )
            }
            {/* Actions */}
            {
                isMenuVisible && (
                    <div className="header-action" ref={actionsRef}>
                        <div className="header-action__info">
                            <img src={anhDaiDien} alt="" className="header-action__avatar" />
                            <div className="header-action__box">
                                <span className="header-action__name">{tenNguoiDung}</span>
                                <span className="header-action__mail">@{email.split("@")[0]}</span>
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
        </header>
    );
};


export default Header;
