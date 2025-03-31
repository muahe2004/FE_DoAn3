import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/header.css";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
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
        <header className="header">
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
                        <button className="header-button">Khóa học của tôi</button>
                    </div>
                    <img className="header-notify" src="/icons/Bell-ring.svg" alt="" />

                    
                    <Link to={role ? (role === "Admin" ? "/admin" : "/users") : "/login"}>
                        <img src="/images/lvm.jpg" alt="" className="header-avatar" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
