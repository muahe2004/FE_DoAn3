import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import "../styles/Responsive/Components/navbar.css";
import ChatBot from "./ChatBot";
import Button from "./Button";

export default function Navbar() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => setIsChatOpen(true);
  const handleCloseChat = () => setIsChatOpen(false);
  return (
    <div className="navbar">
      <div className="navbar-wrapper">
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              <img src="/icons/Home.svg" alt="Trang chủ" className="navbar-icon" />
              <span>Trang chủ</span>
            </Link>
          </li>

          <li className="navbar-item">
            <Link to="/roadmap" className="navbar-link">
              <img src="/icons/Road.svg" alt="Lộ trình" className="navbar-icon" />
              <span>Lộ trình</span>
            </Link>
          </li>

          {/* <li className="navbar-item">
            <Link to="/blog" className="navbar-link">
              <img src="/icons/Article.svg" alt="Bài viết" className="navbar-icon" />
              <span>Bài viết</span>
            </Link>
          </li> */}

          {/* <li className="navbar-item">
            <Link to="/questions" className="navbar-link">
              <img src="/icons/Chat-bubbles-question.svg" alt="Hỏi đáp" className="navbar-icon" />
              <span>Hỏi đáp</span>
            </Link>
          </li> */}
        </ul>

        {/* <button className="navbar-news" onClick={handleOpenChat}>
          <img className="navbar-icon" src="/icons/News.svg" alt="Tin tức" />
        </button> */}

        <Button className="navbar-news" onClick={handleOpenChat} type="button">AI</Button>
      </div>

      <ChatBot isOpen={isChatOpen} onClose={handleCloseChat} ></ChatBot>
    </div>
  );
}
