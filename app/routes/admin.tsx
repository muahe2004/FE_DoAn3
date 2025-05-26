import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "~/components/Header";
import AdminNav from "~/components/Admin/AdminNav";
import AdminCourse from "~/components/Admin/Course";
import SearchEngine from "~/components/Search-engine";
import Pagination from "~/components/Pagination";

import type {courses} from "../types/courses";

import "../styles/Admin/admin.css";
import "../styles/Admin/admin_course.css";

interface ApiCoursesResponse {
  data: courses[];
  pagination?: {
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    pageSize?: number;
  };
}

export default function Admin() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<courses[]>([]);
  const [firstCall, setFirstCall] = useState(true);
  const [totalPages, setTotalPages] = useState(1);;

  // Kiểm tra role
  useEffect(() => {
    const getRole = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/role`, {
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


  // Lấy khóa học
  const fetchCourses = ( page: number, firstCall: boolean, setFirstCall: React.Dispatch<React.SetStateAction<boolean>> ) => {
    const url = new URL(`${import.meta.env.VITE_API_URL}/api/courses`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('pageSize', '5');

    if (firstCall) {
      url.searchParams.append('count', 'true');
    }

    fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then((data: ApiCoursesResponse) => {
        setCourses(data.data || []);
        
        if (firstCall && data.pagination?.totalPages) {
          setTotalPages(data.pagination.totalPages);
          setFirstCall(false);
        }
      })
      .catch((error) => console.error('Lỗi khi lấy khóa học:', error));
  };

  // Lấy khóa học lần đầu (trả ra tổng trang)
  useEffect(() => {
    fetchCourses(1, firstCall, setFirstCall);
  }, []);

  // Chuyển trang (lấy khóa học)
  const onPageChange = (page: number) => {
    fetchCourses(page, firstCall, setFirstCall);
  };

  // Tìm kiếm
  const [searchResult, setSearchResult] = useState<courses[]>([]);

  const handleSearch = (query: string) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/courses/search/${query}`)
      .then((res) => {
        if (!res.ok) { throw new Error("Lỗi khi gọi API tìm kiếm"); }
        return res.json();
      })
      .then((resData: courses[]) => {
        if (Array.isArray(resData)) {
          setSearchResult(resData);
        } else {
          setSearchResult([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setSearchResult([]);
      });
  };

  const goToItem = (item: any) => { navigate(`/admin-course-details/${item.maKhoaHoc}`); };
  
  return (
    <div className="admin-wrapper">
      <Header className="header-admin" title="Trang quản trị"></Header>
      <AdminNav></AdminNav>
      <SearchEngine
        placeholder="Tìm kiếm khóa học..."
        getData={handleSearch}
        data={searchResult}
        renderItem={(item) => (
          <div
            className="search-engine__item"
            key={item.maKhoaHoc}
            onClick={() => goToItem(item)}
          >
            <div className="search-engine__thumb">
              <img
                src={item.hinhAnh || "/images/COURSE.png"}
                alt={item.tenKhoaHoc}
                className="search-engine__image"
              />
            </div>
            <div>
              <span className="search-engine__name">{item.tenKhoaHoc}</span>
            </div>
          </div>
        )}
      />
      <Pagination totalPages={totalPages} onPageChange={(page) => onPageChange(page)} />

      {/* Danh sách khóa học */}
      <div className="list-course">

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
        </div>

        {/* Phần hiển thị các khóa học */}
        <div className="list-course__inner">
          {
            courses.map((course) => (
              <AdminCourse 
                key={course.maKhoaHoc}
                maKhoaHoc={course.maKhoaHoc} 
                tenKhoaHoc={course.tenKhoaHoc} 
                doKho={course.doKho} 
                hinhAnh={course.hinhAnh} 
                giaBan={course.giaBan} 
                moTaKhoaHoc={course.moTaKhoaHoc || "Không có mô tả"} 
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}
