import { useEffect, useState } from "react";

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


  useEffect(() => {
    fetch("http://localhost:1000/get-all-khoahoc") 
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Lỗi khi lấy khóa học:", error));
  }, []);
  return (
    <div className="admin-wrapper">
      <Header title="Trang quản trị"></Header>
      <AdminNav></AdminNav>

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
              <span>GIÁ BÁN</span>
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
