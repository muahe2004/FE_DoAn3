import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../styles/learning-header.css";
import "../styles/Responsive/Components/learning-header.css";
import axios from "axios";


interface LearningHeaderProps {
    title: string;
    className?: string; 
}

interface RegisteredCourse {
    maKhoaHoc: string;
    tenKhoaHoc: string;
    hinhAnh: string;
    trangThai: string;
}

const LearningHeader: React.FC<LearningHeaderProps> = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState<string | null>(null);

    const [anhDaiDien, setAnhDaiDien] = useState(`${import.meta.env.VITE_API_URL}/uploads/defaultAvatar.png`);
    const [tenNguoiDung, setTenNguoiDung] = useState("Student");
    const [email, setEmail] = useState("Student@gmail.com");
    const [isClient, setIsClient] = useState(false); 
    const [userInfoReady, setUserInfoReady] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/role`, { 
            method: "GET",
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            setRole(data.role);  
        })
        .catch((err) => console.error("Lỗi:", err));
    }, []);

    // Đóng mở courses
    


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

    useEffect(() => {
        

        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            console.log("Không tìm thấy thông tin người dùng trong localStorage.");
            return;
        }

        const userInfo = JSON.parse(userInfoStr);

        setIsLogin(true);
        setAnhDaiDien(userInfo.anhDaiDien);
        setTenNguoiDung(userInfo.tenNguoiDung);
        setEmail(userInfo.email);

    }, []);

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
        })
        .catch((error) => {
            console.error("Lỗi khi gọi API:", error);
        });
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

    return (
        <header className="learning-header">
            <div className="learning-header__wrapper">
                <h1 className="learning-header__logo">
                    <Link to="/">
                        <img className="learning-header__image" src="/images/ML.jpg" alt="MLearning Logo" />
                    </Link>
                </h1>

                <div className="learning-header__container">
                    <img className="learning-header__notify" src="/icons/Bell-ring-white.svg" alt="" />

                    <button onClick={handleOpenActions}>
                        <img src="/images/defaultAvatar.png" alt="" className="learning-header__avatar" />
                    </button>
                </div>
            </div>

            

            {
                isMenuVisible && (
                    <div className="learning-header__action" ref={actionsRef}>
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
                                <button className="header-action__link" onClick={handleLogout}>Đăng xuất</button>
                            </span>
                        </div>
                    </div>
                )
            }

            

            
        </header>
    );
};

export default LearningHeader;
