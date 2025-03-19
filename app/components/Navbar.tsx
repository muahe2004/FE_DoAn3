import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-wrapper">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              <img src="./public/icons/Home.svg" alt="Trang chủ" className="navbar-icon" />
              <span>Trang chủ</span>
            </Link>
          </li>

          <li className="navbar-item">
            <Link to="/roadmap" className="navbar-link">
              <img src="./public/icons/Road.svg" alt="Lộ trình" className="navbar-icon" />
              <span>Lộ trình</span>
            </Link>
          </li>

          <li className="navbar-item">
            <Link to="/blog" className="navbar-link">
              <img src="./public/icons/Article.svg" alt="Bài viết" className="navbar-icon" />
              <span>Bài viết</span>
            </Link>
          </li>

          <li className="navbar-item">
            <Link to="/questions" className="navbar-link">
              <img src="./public/icons/Chat-bubbles-question.svg" alt="Hỏi đáp" className="navbar-icon" />
              <span>Hỏi đáp</span>
            </Link>
          </li>
        </ul>

        <button className="navbar-news">
          <img className="navbar-icon" src="./public/icons/News.svg" alt="Tin tức" />
        </button>
      </div>
    </div>
  );
}
