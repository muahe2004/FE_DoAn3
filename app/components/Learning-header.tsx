import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../styles/learning-header.css";
import "../styles/Responsive/Components/learning-header.css";


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

    return (
        <header className="learning-header">
            <div className="learning-header__wrapper">
                <h1 className="learning-header__logo">
                    <Link to="/">
                        <img className="learning-header__image" src="/images/ML.jpg" alt="MLearning Logo" />
                    </Link>
                </h1>

                <div className="learning-header__container">
                    {/* <div className="learning-header__menu">
                        <button className="learning-header__button" onClick={handleOpenMycourses}>Khóa học của tôi</button>
                    </div> */}
                    <img className="learning-header__notify" src="/icons/Bell-ring-white.svg" alt="" />

                    
                    <Link to={role ? (role === "Admin" ? "/admin" : "/users") : "/login"}>
                        <img src="/images/defaultAvatar.png" alt="" className="learning-header__avatar" />
                    </Link>
                </div>
            </div>

            
        </header>
    );
};

export default LearningHeader;
