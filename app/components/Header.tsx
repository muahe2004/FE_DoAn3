import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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

                    
                    <Link to={role ? (role === "Admin" ? "/admin" : "/users") : "/login"}>
                        <img src={anhDaiDien} alt="" className="header-avatar" />
                    </Link>
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
        </header>
    );
};

export default Header;
