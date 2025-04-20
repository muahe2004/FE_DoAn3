import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import AdminCourse from "~/components/Admin/Course";

import "../styles/Admin/admin.css";
import "../styles/Admin/admin_course.css";


interface CourseProps {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  doKho: string;
  hinhAnh: string;
  giaBan: string;
  moTaKhoaHoc: string;
}

export default function Admin() {
  const [courses, setCourses] = useState<CourseProps[]>([]);

  const navigate = useNavigate();

  // Kiểm tra role
  useEffect(() => {
    const getRole = async () => {
      try {
        const res = await fetch("http://localhost:1000/role", {
          method: "GET",
          credentials: "include", 
        });

        if (!res.ok) {
          navigate("/login"); 
          return;
        }

        const data = await res.json();

        if (data.role !== "Admin") {
          navigate("/"); 
        }
      } catch (err) {
        navigate("/login"); 
      }
    };

    getRole(); 
  }, [navigate]);


  // Toàn bộ khóa học
  useEffect(() => {
    fetch("http://localhost:1000/api/courses") 
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Lỗi khi lấy khóa học:", error));
  }, []);

  // Tìm kiếm
  // Tìm kiếm
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState<CourseProps []>([]);

  useEffect(() => {
      // Không gọi API nếu rỗng hoặc toàn khoảng trắng
      if (!inputValue.trim()) return;

      fetch(`http://localhost:1000/api/courses/search/${inputValue}`)
          .then((res) => {
              if (!res.ok) {
                  console.log("Lỗi khi tìm kiếm");
              }
              return res.json();
          })
          .then((data) => {
              setSearchResult(data);
              console.log("Kết quả:", searchResult);
          });
  }, [inputValue]);

  // Click ngoài thì phải đóng tìm kiếm
      const inputRef = useRef<HTMLInputElement>(null);
      const resultRef = useRef<HTMLDivElement>(null);
      const [showResult, setShowResult] = useState(false);
  
      useEffect(() => {
          const handleClickOutside = (event: MouseEvent) => {
            if (
              resultRef.current &&
              !resultRef.current.contains(event.target as Node) &&
              inputRef.current &&
              !inputRef.current.contains(event.target as Node)
            ) {
              setShowResult(false);
            }
          };
        
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
      }, []);
  
  return (
    <div className="admin-wrapper">
      <Header className="header-admin" title="Trang quản trị"></Header>
      <AdminNav></AdminNav>

      {/* Danh sách khóa học */}
      <div className="list-course">

        <div className="list-course__search">
          <img className="list-course-icon" src="/icons/Search.svg" alt="" />
          <input 
              className="list-course-input" 
              // ref={inputRef}
              type="text"
              placeholder="Tìm khóa học..."
              // value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowResult(true)}
          />

          {/* Ô tìm kiếm */}
          <section ref={resultRef} className={`search-result__admin ${showResult && inputValue.trim() ? "show" : ""}`}>
            <div className="search-result__inner">
                <div className="search-result__head">
                    <span className="search-result__inner--title">Kết quả cho: "{inputValue}"</span>
                    <span onClick={() => setShowResult(false)} className="search-result__inner--close">
                        <img className="search-result__icon" src="/icons/Close.svg" alt="" />
                    </span>
                </div>
                {
                    searchResult.length === 0 ? (
                        <p className="no-res">Không tìm thấy kết quả cho: "{inputValue}"</p>
                    ) : (
                        searchResult.map((item) => (
                            <Link to={`/admin-course-details/${item.maKhoaHoc}`}
                                key={item.maKhoaHoc}
                                className="search-result__item">
                                <div className="search-result__thumb">
                                    <img src={item.hinhAnh} alt="" className="search-result__image" />
                                </div>
                                <div>
                                    <span className="search-result__name">{item.tenKhoaHoc}</span>
                                </div>
                            </Link>
                        )
                    )
                )}
            </div>
        </section>
        </div>

        {/* Phần head */}
        <div className="list-course__head">
          

          {/* Mã khóa học */}
          <div className="course-id course-id_head">
              <span>ID</span>
          </div>

          {/* Tên khóa học */}
          <div className="course-name course-name_head">
              <span>TÊN KHÓA HỌC</span>
          </div>

          {/* Hình ảnh */}
          <div className="course-image_head">
              <span>HÌNH ẢNH</span>
          </div>

          {/* Độ khó */}
          <div className="course-level_head">
              <span>ĐỘ KHÓ</span>
          </div>

          {/* Giá */}
          <div className="course-price course-price_head">
              <span>GIÁ (VNĐ)</span>
          </div>

          {/* Sửa */}
          {/* <div className="course-update"></div> */}

          {/* Xóa */}
          {/* <div className="course-delete"></div> */}
        </div>

        

        {/* Phần hiển thị các khóa học */}
        <div className="list-course__inner">
          {courses.map((course) => (
              <AdminCourse 
                key={course.maKhoaHoc}
                maKhoaHoc={course.maKhoaHoc} 
                tenKhoaHoc={course.tenKhoaHoc} 
                doKho={course.doKho} 
                hinhAnh={course.hinhAnh} 
                giaBan={course.giaBan} 
                moTaKhoaHoc={course.moTaKhoaHoc || "Không có mô tả"} 
              />
            ))}


        </div>
      </div>
    </div>
    
  );
}
