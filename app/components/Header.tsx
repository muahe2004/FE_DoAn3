import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Button from "./Button";
import axios from "axios";
import "../styles/header.css";

interface HeaderProps {
    title: string;
    className?: string; 
}

interface RegisteredCourse {
    maKhoaHoc: string;
    tenKhoaHoc: string;
    hinhAnh: string;
    trangThai: string;
}

const Header: React.FC<HeaderProps> = ({ title, className }) => {
    const navigate = useNavigate();

    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:1000/role", { 
            method: "GET",
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            setRole(data.role);  
        })
        .catch((err) => console.error("Lỗi:", err));
    }, []);

    // Khóa học của tôi
    const [listRegisteredCourse, setListRegisteredCourse] = useState<RegisteredCourse []>([]);
    const [isClient, setIsClient] = useState(false); // Biến để xác định môi trường client
    const [userInfoReady, setUserInfoReady] = useState(false);
    const [anhDaiDien, setAnhDaiDien] = useState("http://localhost:1000/uploads/defaultAvatar.png");
    const [tenNguoiDung, setTenNguoiDung] = useState("Student");
    const [email, setEmail] = useState("Student@gmail.com");

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchGoogleUserInfo = async () => {
            try {
                const res = await fetch("http://localhost:1000/auth-google/get-user-info", {
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
                console.log("Lưu thành công userInfo từ Google:", data);

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

        setIsLogin(true);
        setAnhDaiDien(userInfo.anhDaiDien);
        setTenNguoiDung(userInfo.tenNguoiDung);
        setEmail(userInfo.email);

        fetch(`http://localhost:1000/courses/registered/${maNguoiDung}`)
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
            await axios.post('http://localhost:1000/logout', {}, {
                withCredentials: true
            });

            localStorage.removeItem("userInfo"); 
            localStorage.removeItem("myCourses");

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
        fetch("http://localhost:1000/balance", { 
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
        <header className={`header ${className || ""}`}>
            <div className="header-wrapper">
                <h1 className="header-logo">
                    <Link to="/">
                        <img className="header-image" src="/images/ML.jpg" alt="MLearning Logo" />
                    </Link>
                    <span className="header-title">
                        {title}
                    </span>
                </h1>

                <div className="header-search">
                    <img className="header-icon" src="/icons/Search.svg" alt="" />
                    <input className="header-input" type="text" />
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
                            <Button className="button-secondary header-btn" to="/register">Đăng ký</Button>
                            <Button className="header-btn" to="/login">Đăng nhập</Button>
                        </div>
                    )
                }
            </div>

            {/* Danh sách khóa học đã đăng ký */}
            {
                isCourseVisible && (
                    <section className={`my-course ${isCourseVisible ? "visible" : ""}`} ref={courseRef}>
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
                                <Link className="header-action__link" to={role ? (role === "Admin" ? "/admin" : "/user") : "/login"}>Trang cá nhân</Link>
                            </span>
                        </div>

                        <div className="header-action__row">
                            <span className="header-action__item">
                                <Link className="header-action__link" to="">Nạp tiền</Link>
                            </span>
                        </div>

                        <div className="header-action__row">
                            <span className="header-action__item header-action__item--pd">
                                <Link className="header-action__link" to="">Viết blog</Link>
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
                                <button onClick={handleLogout}>Đăng xuất</button>
                            </span>
                        </div>
                    </div>
                )
            }
        </header>
    );
};

export default Header;
