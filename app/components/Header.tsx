import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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

    const [isCourseVisible, setIsCourseVisible] = useState(false); 

    const handleOpenMycourses = () => {
        setIsCourseVisible(true);
    }

    // Khóa học của tôi
    const [listRegisteredCourse, setListRegisteredCourse] = useState<RegisteredCourse []>([]);
    const [isClient, setIsClient] = useState(false); // Biến để xác định môi trường client

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [anhDaiDien, setAnhDaiDien] = useState("http://localhost:1000/uploads/defaultAvatar.png");
    // Lấy thông tin người dùng từ localStorage chỉ khi trên client
    useEffect(() => {
        if (!isClient) return; 

        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            console.log("Không tìm thấy thông tin người dùng trong localStorage.");
            return;
        }

        const userInfo = JSON.parse(userInfoStr);
        const maNguoiDung = userInfo.maNguoiDung;
        setAnhDaiDien(userInfo.anhDaiDien);

        fetch(`http://localhost:1000/courses/registered/${maNguoiDung}`)
            .then((res) => res.json())
            .then((data) => {
                setListRegisteredCourse(data);
                localStorage.setItem("myCourses", JSON.stringify(data));
            })
            .catch((err) => {
                console.log("Lỗi: ", err);
            });
    }, [isClient]);

    // Tạo ref cho phần tử danh sách khóa học
    const courseRef = useRef<HTMLDivElement | null>(null);

    // Đóng phần tử khi click ngoài
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
        } catch (error) {
            console.error("Lỗi khi logout:", error);
        }
    }
    
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

                <div className="header-container">
                    <div className="header-menu">
                        <button className="header-button" type="button" onClick={handleOpenMycourses}>Khóa học của tôi</button>
                    </div>
                    <img className="header-notify" src="/icons/Bell-ring.svg" alt="" />

                    
                    {/* <Link to={role ? (role === "Admin" ? "/admin" : "/users") : "/login"}>
                        <img src={anhDaiDien} alt="" className="header-avatar" />
                    </Link> */}

                    <div className="" onClick={handleOpenActions}>
                        <img src={anhDaiDien} alt="" className="header-avatar" />
                    </div>
                </div>
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
                                <span className="header-action__name">Lý Văn Minh</span>
                                <span className="header-action__mail">lyvanminh@gmail.com</span>
                            </div>
                        </div>

                        <div className="header-action__row">
                            <span className="header-action__item">
                                <Link to={role ? (role === "Admin" ? "/admin" : "/users") : "/login"}>Trang cá nhân</Link>
                            </span>
                        </div>

                        <div className="header-action__row">
                            <span className="header-action__item header-action__item--pd">
                                <Link to="">Viết blog</Link>
                            </span>
                            <span className="header-action__item header-action__item--pd">
                                <Link to="">Bài viết của tôi</Link>
                            </span>
                            <span className="header-action__item">
                                <Link to="">Bài viết đã lưu</Link>
                            </span>
                        </div>

                        <div className="header-action__row">
                            <span className="header-action__item header-action__item--pd">
                                <Link to="">Cài đặt</Link>
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
