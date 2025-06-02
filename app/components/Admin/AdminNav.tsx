import "../../styles/Admin/admin_nav.css";
import "../../styles/navbar.css";
import { Link } from "react-router-dom";

export default function AdminNav() {
    return (
        <div className="admin-navbar">
            <div className="navbar-wrapper">
                <ul className="navbar-list">
                    <li className="navbar-item">
                        <Link to="/admin" className="navbar-link">
                            <img src="/icons/Home.svg" alt="Trang chủ" className="navbar-icon" />
                            <span>Trang chủ</span>
                        </Link>
                    </li>

                    <li className="navbar-item">
                        <Link to="/add-course" className="navbar-link">
                            <img src="/icons/Folder-plus.svg" alt="Lộ trình" className="navbar-icon" />
                            <span>Khóa học</span>
                        </Link>
                    </li>

                    <li className="navbar-item">
                        <Link to="/add-lesson" className="navbar-link">
                            <img src="/icons/Square-plus.svg" alt="Lộ trình" className="navbar-icon" />
                            <span>Chương</span>
                        </Link>
                    </li>

                    <li className="navbar-item">
                        <Link to="/add-lecture" className="navbar-link">
                            <img src="/icons/Circle-plus.svg" alt="Bài viết" className="navbar-icon" />
                            <span>Bài học</span>
                        </Link>
                    </li>

                    <li className="navbar-item">
                        <Link to="/add-question" className="navbar-link">
                            <img src="/icons/circle-question.svg" alt="Câu hỏi" className="navbar-icon" />
                            <span>Câu hỏi</span>
                        </Link>
                    </li>

                    <li className="navbar-item">
                        <Link to="/admin-user" className="navbar-link">
                            <img src="/icons/user.svg" alt="Bài viết" className="navbar-icon" />
                            <span>Người dùng</span>
                        </Link>
                    </li>

                    <li className="navbar-item">
                        <Link to="/admin-analytics" className="navbar-link">
                            <img src="/icons/Chart.svg" alt="Hỏi đáp" className="navbar-icon" />
                            <span>Thống kê</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}