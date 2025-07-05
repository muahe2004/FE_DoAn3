import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "~/components/Navbar";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import Button from "~/components/Button";

import "../styles/read-blog.css";

import type { articles } from '../types/articles';


export default function ReadBlog() {
  const {maBaiViet} = useParams();
  const [articleContent, setArticlesContent] = useState<articles | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/articles/${maBaiViet}`);
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            setArticlesContent(data);
        } else {
            console.log("Lỗi khi lấy thông tin bài học!");
        } 

        
      } catch (error) {
          console.error("Lỗi: ", error);
      }
    };
    fetchArticles();
  }, [maBaiViet])

  return (
    <div className="read-blog">
        <Header title="Blog"></Header>
        <Navbar></Navbar>

        <div className="read-blog__head">
          <div className="read-blog__title">{articleContent?.tenBaiViet}</div>
          <div className="read-blog__container">
            <img className="blog-user__avt" src={articleContent?.anhDaiDien} alt="" />

            <div className="blog-user__box">
              <span className="user-box__item">{articleContent?.tenNguoiDung}</span>
              <span className="user-box__item user-box__item--role">{articleContent?.loaiNguoiDung}</span>
            </div>

            <div className="blog-user__action">
              <svg 
                className="blog-user__icon"
                width="20px"
                height="20px"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 512 512">
                <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
              </svg>
              <svg 
                className="blog-user__icon"
                width="20px"
                height="20px"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512">
                <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
              </svg>
            </div>
          </div>
        </div>

        <div 
          className="read-blog__inner"
          dangerouslySetInnerHTML={{ __html: articleContent?.noiDung || ""}}  
        ></div>
        <Footer className = 'blog-footer'></Footer>
    </div>
  );
}
